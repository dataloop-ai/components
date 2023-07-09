<template>
    <div
        :style="`max-width: ${maxWidth}`"
        class="confusion-matrix-container"
    >
        <div
            v-if="isValidMatrix"
            ref="wrapper"
            :style="matrixStyles"
            class="wrapper"
        >
            <span
                ref="labelY"
                class="label-tag y"
            >
                {{ leftLabel }}
            </span>
            <div
                ref="yAxisOuter"
                class="y-axis-outer"
            >
                <div
                    ref="yAxis"
                    class="y-axis"
                >
                    <div
                        v-for="(label, index) in labels"
                        :key="index"
                        class="y-axis__element"
                    >
                        <img
                            v-if="labelImages[0]"
                            class="legend-avatar"
                            :src="labelImages[index]"
                        >
                        <span v-else>
                            {{ label }}
                        </span>
                        <dl-tooltip :offset="[0, 0]">
                            {{ labelStrings[index] }}
                        </dl-tooltip>
                    </div>
                </div>
            </div>
            <div
                ref="verticalWrapper"
                class="vertical_wrapper"
            >
                <div
                    ref="matrixWrapper"
                    class="matrix-wrapper"
                    @scroll="handleMatrixScroll"
                >
                    <div
                        ref="matrix"
                        class="matrix"
                    >
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
                                                ? 'Normalized'
                                                : 'Unnormalized'
                                        }}
                                        {{
                                            normalized
                                                ? cell.value
                                                : cell.unnormalizedValue
                                        }}
                                    </span>
                                </div>
                            </dl-tooltip>
                        </div>
                    </div>
                </div>
                <div
                    class="x-axis"
                    style="margin-top: 10px"
                >
                    <span
                        v-for="(label, index) in visibleLabels"
                        ref="xAxis"
                        :key="index"
                        class="x-axis__element"
                        :style="`${
                            !labelImages[0]
                                ? `transform: rotate(${
                                    rotateXLabels ? '70' : '0'
                                }deg); line-height: ${
                                    rotateXLabels ? 100 : 10
                                }px`
                                : ''
                        }`"
                    >
                        <span class="x-axis__element--text">
                            <img
                                v-if="labelImages[0]"
                                class="legend-avatar"
                                :src="labelImages[index]"
                            >
                            <span v-else>
                                {{ label }}
                            </span>
                        </span>
                        <dl-tooltip self="top middle">
                            {{ labelStrings[index] }}</dl-tooltip>
                    </span>
                </div>
                <dl-brush
                    track-size="18px"
                    thumb-size="20px"
                    :max="matrix.length"
                    :max-range="2"
                    :selection-color="getCellBackground(0.1)"
                    :color="getCellBackground()"
                    :step="1"
                    drag-range
                    @update:model-value="handleBrushUpdate"
                />
                <span class="label-tag x"> {{ bottomLabel }} </span>
            </div>
            <div
                ref="colorSpectrum"
                class="color-spectrum"
            >
                <div class="color-spectrum__gradient" />
                <div class="color-spectrum__gradation">
                    <div
                        v-for="value in gradationValues"
                        :key="value"
                        class="color-spectrum__gradation--element"
                    >
                        <span class="color-spectrum__gradation--element-line">-</span>
                        {{ value !== gradationValues[0] ? value : null }}
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="invalid"
        >
            The given props cannot create a valid matrix.
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import DlBrush from '../../components/DlBrush.vue'
import { DlTooltip } from '../../../../shared'
import {
    DlConfusionMatrixCell,
    DlConfusionMatrixLabel,
    DlConfusionMatrixBrushState
} from '../../types'
import { hexToRgbA } from '../../../../../utils/colors'
import { colorNames } from '../../../../../utils/css-color-names'
import { useThemeVariables } from '../../../../../hooks/use-theme'
import {
    getGradationValues,
    validateMatrix,
    setZoom,
    getCellWidth,
    flattenConfusionMatrix
} from './utils'
import { debounce, isObject } from 'lodash'
export default defineComponent({
    components: {
        DlBrush,
        DlTooltip
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
        }
    },
    setup(props) {
        const { variables } = useThemeVariables()

        const tooltipState = ref<{
            x: string
            y: string
            visible?: boolean
            value?: number
            yLabel?: string
            xLabel?: string
        } | null>(null)
        const currentBrushState = ref<{ min: number; max: number }>({
            min: 0,
            max: props.matrix.length
        })
        const cellWidth = ref<number | null>(null)
        const rotateXLabels = ref(true)

        const getCellBackground = (value: number = 1): string => {
            const object: { [key: string]: any } = {
                ...variables,
                ...colorNames
            }
            const hex = object[props.color]
            return hexToRgbA(hex, value)
        }

        const getCellTextColor = (value: number) => {
            const isDark =
                document.documentElement.getAttribute('data-theme') ===
                'dark-mode'
            if (isDark) return 'var(--dl-color-text-buttons)'
            return `var(--dl-color-text${value < 0.5 ? '-darker' : ''}-buttons)`
        }

        return {
            variables,
            getCellBackground,
            getCellTextColor,
            cellWidth,
            currentBrushState,
            rotateXLabels
        }
    },
    computed: {
        visibleLabels(): DlConfusionMatrixLabel[] {
            if (this.labels[0]) {
                const arr = this.labels as DlConfusionMatrixLabel[]
                return arr.slice(
                    this.currentBrushState.min,
                    this.currentBrushState.max
                )
            }
            return []
        },
        labelStrings(): string[] | DlConfusionMatrixLabel[] {
            if (isObject(this.labels[0])) {
                const arr = this.labels as DlConfusionMatrixLabel[]
                return arr.map((label: DlConfusionMatrixLabel) => label.title)
            }
            return this.labels
        },
        labelImages(): string[] {
            return this.visibleLabels.map((label: any) => label.image)
        },
        isValidMatrix(): boolean {
            return validateMatrix(this.matrix, this.labels)
        },
        flattenedMatrix(): DlConfusionMatrixCell[] {
            return flattenConfusionMatrix(this.matrix, this.labelStrings)
        },
        matrixStyles(): Record<string, number | string> {
            return {
                '--matrix-rows': this.matrix.length,
                '--cell-dimensions': `${this.cellWidth}px`,
                '--general-color': this.getCellBackground()
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
                this.currentBrushState.max = value.length
                this.resizeMatrix()
            }
        },
        currentBrushState() {
            const longest = Math.max(
                ...this.visibleLabels.map(
                    (el: DlConfusionMatrixLabel) =>
                        (isObject(el) ? el.title : `${el}`).length
                )
            )
            this.rotateXLabels = longest * 12 > getCellWidth()
        }
    },
    mounted() {
        if (!this.isValidMatrix) return
        this.resizeMatrix()
        const resizeObserver = new ResizeObserver(this.resizeMatrix)
        resizeObserver.observe(this.$refs.wrapper as Element)
        window.onresize = this.resizeMatrix
    },
    methods: {
        resizeMatrix() {
            const colorSpectrum = this.$refs.colorSpectrum as HTMLElement
            const verticalWrapper = this.$refs.verticalWrapper as HTMLElement
            const labelY = this.$refs.labelY as HTMLElement
            const yAxisOuter = this.$refs.yAxisOuter as HTMLElement
            const width = verticalWrapper?.offsetWidth

            labelY.style.marginTop = `-${this.leftLabel.length * 16}px`
            this.cellWidth = width / this.matrix.length
            colorSpectrum.style.height = `${width}px`
            yAxisOuter.style.height = `${width}px`
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
                const scroll = brush.min * (getCellWidth() - 2)
                const container = ctx.$refs.matrixWrapper
                container.scroll(scroll, 0)
                ctx.currentBrushState = brush
                ctx.resizeYAxis()
            },
            30
        ),
        resizeYAxis() {
            const yAxis = this.$refs.yAxis as HTMLElement
            yAxis.style.height = `${getCellWidth() * this.matrix.length}px`
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

<style lang="scss">
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
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    margin-top: 10px;
    min-height: 100px;
    max-height: 100px;
    &__element {
        width: var(--cell-dimensions);
        overflow: hidden;
        text-overflow: ellipsis;
        &--text {
            font-size: 12px;
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
    }
}
.y-axis-outer {
    overflow: hidden;
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
        font-size: 12px;
        cursor: pointer;
        border: 1px solid var(--dl-color-separator);
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
    margin: 0px 15px;
    &__gradient {
        width: 40%;
        background-image: linear-gradient(
            var(--general-color),
            var(--dl-color-text-buttons)
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

.matrix-tooltip {
    --dl-tooltip-padding: 0px;

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
    width: 30px;
    height: 30px;
}
</style>
