<template>
    <div
        id="DlConfusionMatrix"
        :style="`max-width: ${maxWidth}`"
        class="confusion-matrix-container"
    >
        <dl-empty-state v-if="isEmpty" v-bind="emptyStateProps">
            <template v-for="(_, slot) in $slots" #[slot]="props">
                <slot :name="slot" v-bind="props" />
            </template>
        </dl-empty-state>
        <div
            v-else-if="isValidMatrix"
            ref="wrapper"
            :style="matrixStyles"
            class="wrapper"
        >
            <span ref="labelY" class="label-tag y">
                {{ leftLabel }}
            </span>
            <div ref="yAxisOuter" class="y-axis-outer">
                <div ref="yAxis" class="y-axis" style="min-height: 100%">
                    <div
                        v-for="(label, index) in labels"
                        :key="index"
                        class="y-axis__element"
                        style="
                            display: flex;
                            flex-grow: 1;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        <img
                            v-if="labelImages[0]"
                            class="legend-avatar"
                            :src="labelImages[index]"
                        />
                        <span v-else class="label label-y">
                            {{ label }}
                        </span>
                        <dl-tooltip :offset="[0, 0]">
                            {{ getLabelString(label) }}
                        </dl-tooltip>
                    </div>
                </div>
            </div>
            <div ref="verticalWrapper" class="vertical_wrapper">
                <div
                    ref="matrixWrapper"
                    class="matrix-wrapper"
                    @scroll="handleMatrixScroll"
                >
                    <div ref="matrix" class="matrix">
                        <div
                            v-for="cell in flattenedMatrix"
                            :key="`${cell.x}-${cell.y}`"
                            class="matrix__cell"
                            :style="`background-color: ${getCellBackground(
                                cell.value
                            )}; color: ${getCellTextColor(cell.value)}`"
                            @mousedown="openLink(cell)"
                        >
                            {{
                                cell.value > 0
                                    ? normalized
                                        ? cell.value
                                        : cell.unnormalizedValue
                                    : null
                            }}
                            <dl-tooltip
                                id="MatrixTooltip"
                                class="matrix-tooltip"
                                background-color="dl-color-shadow"
                                color="dl-color-tooltip-background"
                                :offset="[5, 5]"
                            >
                                <div class="matrix-tooltip__body">
                                    <span>{{ cell.xLabel }}</span>
                                    <span>{{ cell.yLabel }}</span>
                                    <span class="matrix-tooltip__value">
                                        <span
                                            v-if="cell.value"
                                            class="matrix-tooltip__color"
                                            :style="`background-color: ${getCellBackground(
                                                cell.value
                                            )}`"
                                        />
                                        {{
                                            normalized
                                                ? `Normalized ${cell.value}`
                                                : `Unnormalized ${cell.unnormalizedValue}`
                                        }}
                                    </span>
                                </div>
                            </dl-tooltip>
                        </div>
                    </div>
                </div>
                <div class="x-axis">
                    <div
                        v-for="(label, index) in visibleLabels"
                        :key="index"
                        style="
                            display: flex;
                            flex-grow: 100;
                            width: 100%;
                            justify-content: center;
                            overflow: hidden;
                        "
                    >
                        <span
                            :ref="`xAxis-${index}`"
                            class="x-axis__element"
                            :style="`
                                justify-content: center;
                                display: flex;${
                                !labelImages[0]
                                    ? `transform: rotate(${
                                        rotateXLabels ? '70' : '0'
                                    }deg); line-height: ${
                                        rotateXLabels ? 100 : 10
                                    }px`
                                    : ''
                            };`"
                        >
                            <span class="x-axis__element--text">
                                <img
                                    v-if="labelImages[0]"
                                    class="legend-avatar"
                                    :src="labelImages[index]"
                                />
                                <span v-else class="label label-x">
                                    {{ label }}
                                </span>
                            </span>
                        </span>
                        <dl-tooltip
                            self="top middle"
                            :offset="debouncedCalculateXAxisElOffset(index)"
                        >
                            {{ getLabelString(label) }}
                        </dl-tooltip>
                    </div>
                </div>
                <dl-brush
                    track-size="18px"
                    thumb-size="20px"
                    :max="matrix.length"
                    :min-range="2"
                    :max-range="cellDisplayLimit"
                    :selection-color="getCellBackground(0.1)"
                    :color="getCellBackground()"
                    :step="1"
                    drag-range
                    :model-value="currentBrushState"
                    @update:model-value="handleBrushUpdate"
                />
                <span class="label-tag x"> {{ bottomLabel }} </span>
            </div>
            <div ref="colorSpectrum" class="color-spectrum">
                <div class="color-spectrum__gradient" />
                <div class="color-spectrum__gradation">
                    <div
                        v-for="(value, index) in gradationValues"
                        :key="index"
                        class="color-spectrum__gradation--element"
                    >
                        <span class="color-spectrum__gradation--element-line"
                        >-</span
                        >
                        {{ value !== gradationValues[0] ? value : null }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="invalid">
            The given props cannot create a valid matrix.
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    getCurrentInstance,
    PropType,
    ref
} from 'vue-demi'
import DlBrush from '../../components/DlBrush.vue'
import { DlTooltip } from '../../../../shared'
import {
    DlConfusionMatrixCell,
    DlConfusionMatrixLabel,
    DlConfusionMatrixBrushState
} from '../../types'
import { hexToRgbA } from '../../../../../utils/colors'
import { colorNames } from '../../../../../utils/css-color-names'
import DlEmptyState from '../../../../basic/DlEmptyState/DlEmptyState.vue'
import { DlEmptyStateProps } from '../../../../basic/DlEmptyState/types'
import { useThemeVariables } from '../../../../../hooks/use-theme'
import {
    getGradationValues,
    validateMatrix,
    setZoom,
    flattenConfusionMatrix
} from './utils'
import { debounce, isObject } from 'lodash'
import { stateManager } from '../../../../../StateManager'

const confusionMatrixEmptyStateProps = {
    subtitle:
        'There was a problem processing the request. Please refresh the page.'
}
export default defineComponent({
    components: {
        DlBrush,
        DlTooltip,
        DlEmptyState
    },
    props: {
        labels: {
            required: true,
            type: Array as PropType<string[] | DlConfusionMatrixLabel[]>,
            default: (): string[] | DlConfusionMatrixLabel[] => []
        },
        matrix: {
            required: true,
            type: Array as PropType<number[][] | DlConfusionMatrixCell[][]>,
            default: (): number[][] | DlConfusionMatrixCell[][] => []
        },
        normalized: {
            type: Boolean,
            default: true
        },
        cellDisplayLimit: {
            type: Number,
            default: 10
        },
        color: {
            type: String,
            default: '--dl-color-secondary'
        },
        bottomLabel: {
            type: String,
            default: 'Predicted Label'
        },
        leftLabel: {
            type: String,
            default: 'True Label'
        },
        maxWidth: {
            type: String,
            default: '800px'
        },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () => confusionMatrixEmptyStateProps
        }
    },
    setup(props) {
        const vm = getCurrentInstance()
        const { variables, isDark = { value: false } } = useThemeVariables()
        const currentBrushState = ref<{ min: number; max: number }>({
            min: 0,
            max: Math.min(props.matrix.length, props.cellDisplayLimit)
        })
        const cellWidth = ref<number | null>(null)
        const rotateXLabels = ref(true)
        const resizeObserver = ref<ResizeObserver>(null)
        const isDisposed = ref(false)

        const getCellBackground = (value: number = 1): string => {
            const object: { [key: string]: any } = {
                ...variables,
                ...colorNames
            }
            const hex = object[props.color]
            return hexToRgbA(hex, value)
        }

        const getCellTextColor = (value: number) => {
            if (isDark.value) return 'var(--dl-color-text-buttons)'
            return `var(--dl-color-text${value < 0.5 ? '-darker' : ''}-buttons)`
        }

        const gradationDarkColor = computed(() => {
            return isDark.value
                ? getCellBackground()
                : 'var(--dl-color-secondary)'
        })

        const gradationLightColor = computed(() => {
            return isDark.value
                ? 'var(--dl-color-text-darker-buttons)'
                : 'var(--dl-color-text-buttons)'
        })

        const calculateXAxisElOffset = (index: number): number[] => {
            let el = vm.refs[`xAxis-${index}`] as HTMLElement
            if (!el) return null
            if (Array.isArray(el)) {
                el = el[0]
            }
            if (!el) {
                return [0, 0]
            }
            const height = el.clientHeight
            const offsetHeight = -1 * (height / 2)
            return [0, offsetHeight + 30]
        }

        const debouncedCalculateXAxisElOffset = computed(() => {
            if (stateManager.disableDebounce) {
                return calculateXAxisElOffset
            }
            return debounce(calculateXAxisElOffset, 100)
        })

        return {
            resizeObserver,
            variables,
            getCellBackground,
            getCellTextColor,
            cellWidth,
            currentBrushState,
            rotateXLabels,
            calculateXAxisElOffset,
            debouncedCalculateXAxisElOffset,
            isDisposed,
            gradationDarkColor,
            gradationLightColor
        }
    },
    computed: {
        visibleLabels(): DlConfusionMatrixLabel[] | string[] {
            return this.labels.slice(
                this.currentBrushState.min,
                this.currentBrushState.max
            )
        },
        labelImages(): string[] {
            return this.visibleLabels.map((label: any) => label.image)
        },
        isValidMatrix(): boolean {
            return validateMatrix(this.matrix, this.labels)
        },
        flattenedMatrix(): DlConfusionMatrixCell[] {
            return flattenConfusionMatrix(
                this.matrix,
                this.labels.map(this.getLabelString)
            )
        },
        matrixStyles(): Record<string, number | string> {
            return {
                '--matrix-rows': this.matrix.length,
                '--cell-dimensions': `${this.cellWidth}px`,
                '--gradation-dark': this.gradationDarkColor,
                '--gradation-light': this.gradationLightColor
            }
        },
        gradationValues(): number[] {
            return this.normalized
                ? [1, 0.8, 0.6, 0.4, 0.2, 0]
                : getGradationValues(this.matrix)
        }
    },
    watch: {
        matrix: {
            handler(value) {
                this.currentBrushState.max = Math.min(
                    this.cellDisplayLimit,
                    value.length
                )
                this.$nextTick(() => {
                    this.resizeMatrix()
                })
            }
        },
        currentBrushState() {
            this.calculateRotatedXLabels()
        },
        isEmpty(val) {
            this.handleResizeObserver({ dispose: !val })
        }
    },
    mounted() {
        this.isDisposed = false
        if (!this.isValidMatrix) return
        if (this.isEmpty) return

        this.handleResizeObserver()
        this.$nextTick(() => {
            setTimeout(() => {
                if (this.isDisposed) return
                this.calculateRotatedXLabels()
                this.updateBrush(this, this.currentBrushState)
            }, 300)
        })
    },
    beforeUnmount() {
        this.isDisposed = true
        this.handleResizeObserver({ dispose: true })
    },
    methods: {
        getLabelString(label: DlConfusionMatrixLabel | string) {
            if (isObject(label)) {
                return (label as DlConfusionMatrixLabel).title
            }
            return label as string
        },
        calculateRotatedXLabels() {
            const longest = Math.max(
                ...this.visibleLabels.map(
                    (el: DlConfusionMatrixLabel | string) =>
                        this.getLabelString(el).length
                )
            )
            this.rotateXLabels = longest * 12 > this.getMatrixCellWidth()
        },
        handleResizeObserver(options: { dispose?: boolean } = {}) {
            if (this.isDisposed) return
            const { dispose } = options
            if (dispose && this.resizeObserver) {
                this.resizeObserver.unobserve(this.$refs.wrapper as Element)
                this.resizeObserver.disconnect()
                this.resizeObserver = null
            } else {
                this.resizeMatrix()
                if (!this.resizeObserver) {
                    this.resizeObserver = new ResizeObserver(this.resizeMatrix)
                    this.resizeObserver.observe(this.$refs.wrapper as Element)
                    window.onresize = this.resizeMatrix
                }
            }
        },
        resizeMatrix() {
            if (this.isDisposed) return
            const colorSpectrum = this.$refs.colorSpectrum as HTMLElement
            const verticalWrapper = this.$refs.verticalWrapper as HTMLElement
            const labelY = this.$refs.labelY as HTMLElement
            const yAxisOuter = this.$refs.yAxisOuter as HTMLElement
            const width = verticalWrapper?.offsetWidth

            labelY.style.marginTop = `-${this.leftLabel.length * 16}px`
            this.cellWidth = Math.round(width / this.matrix.length)
            colorSpectrum.style.height = `${width}px`
            yAxisOuter.style.height = `${width}px`

            this.resizeYAxis()
        },
        handleBrushUpdate(brush: DlConfusionMatrixBrushState) {
            if (
                brush.min === this.currentBrushState.min &&
                brush.max === this.currentBrushState.max
            )
                return
            this.updateBrush(this, brush)
        },
        updateBrush: debounce(
            (ctx: any, brush: DlConfusionMatrixBrushState) => {
                setZoom(
                    ctx.matrix.length / (brush.max - brush.min),
                    ctx.$refs.matrix
                )
                const scroll = brush.min * ctx.getMatrixCellWidth()
                const container = ctx.$refs.matrixWrapper
                container.scroll(scroll, 0)
                ctx.currentBrushState = brush
                ctx.resizeYAxis()
            },
            30
        ),
        resizeYAxis() {
            const yAxis = this.$refs.yAxis as HTMLElement
            yAxis.style.height = `${this.getMatrixWidth()}px`
        },
        getMatrixWidth() {
            const matrixElement = this.$refs.matrix as HTMLElement
            const width = matrixElement.getBoundingClientRect().width
            return width
        },
        getMatrixCellWidth() {
            return this.getMatrixWidth() / this.matrix.length
        },
        handleMatrixScroll(e: MouseEvent | UIEvent) {
            const target = e.target as HTMLElement
            ;(this.$refs.yAxisOuter as HTMLElement).scroll(0, target.scrollTop)
        },
        openLink(cell: DlConfusionMatrixCell) {
            if (!cell.link) return
            window.open(cell.link, '_blank')
        }
    }
})
</script>

<style lang="scss" scoped>
.confusion-matrix-container {
    margin: auto;
}
.wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    user-select: none;
}
.vertical_wrapper {
    width: calc(100% - 120px);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.label {
    display: block;
    width: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.label-x {
    transform: translateX(40%);
    text-align: start;
}
.label-y {
    text-align: right;
}

.label-tag {
    font-size: 0.8em;
    color: var(--dl-color-medium);
}
.label-tag.y {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-align: center;
    margin-right: 10px;
}
.label-tag.x {
    margin-top: 15px;
}
.x-axis {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin: 10px 0px 15px 0px;
    min-height: 100px;
    max-height: 100px;
    &__element {
        width: var(--cell-dimensions);
        max-width: 100px;
        text-overflow: ellipsis;
        &--text {
            font-size: 12px;
        }
        .legend-avatar {
            max-height: 30px;
            max-width: 100%;
        }
    }
}
.y-axis {
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__element {
        text-align: center;
        line-height: var(--cell-dimensions);
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        min-width: 30px;
        .legend-avatar {
            max-height: 100%;
            max-width: 30px;
        }
    }
}
.y-axis-outer {
    overflow: hidden;
    margin-right: 10px;
    width: 200px;
}
.y-axis,
.x-axis {
    color: var(--dl-color-darker);
    font-size: 0.7em;
}

.matrix-wrapper {
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
}
.matrix-wrapper::-webkit-scrollbar {
    width: 14px;
}
.matrix-wrapper::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: var(--dl-color-separator);
}

.matrix {
    display: grid;
    grid-template-rows: repeat(var(--matrix-rows), 1fr);
    grid-template-columns: repeat(var(--matrix-rows), 1fr);

    &__cell {
        font-size: calc(var(--cell-dimensions) * 0.33);
        cursor: pointer;
        box-sizing: border-box;
        width: var(--cell-dimensions);
        height: var(--cell-dimensions);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.color-spectrum {
    color: var(--dl-color-darker);
    display: flex;
    width: 20px;
    margin: 0px 15px;
    &__gradient {
        width: 40%;
        background-image: linear-gradient(
            var(--gradation-dark),
            var(--gradation-light)
        );
    }
    &__gradation {
        width: 60%;
        font-size: 0.8em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &--element {
            width: 100%;
            display: flex;
            &-line {
                color: var(--dl-color-separator);
                margin-right: 5px;
            }
        }
    }
}

#MatrixTooltip {
    padding: 0;
}

.matrix-tooltip {
    &__body {
        border: 1px solid var(--dl-color-separator);
        padding: 8px;
        font-size: 10px;
        line-height: 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    &__value {
        display: flex;
        align-items: center;
    }

    &__color {
        display: inline-block;
        width: 12px;
        height: 12px;
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.invalid {
    display: flex;
    justify-content: center;
    align-items: center;
}

.legend-avatar {
    border-radius: 50%;
}
</style>
