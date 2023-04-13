<template>
    <div class="confusion-matrix-container">
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
                        <dl-tooltip> {{ labelStrings[index] }}</dl-tooltip>
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
                            )}; color: var(--dl-color-text${
                                cell.value < 0.5 ? '-darker' : ''
                            }-buttons)`"
                            @mouseenter="handleShowTooltip(cell, $event)"
                            @mouseleave="handleHideTooltip"
                            @mousedown="openLink(cell)"
                        >
                            {{
                                cell.value > 0
                                    ? normalized
                                        ? cell.value
                                        : cell.unnormalizedValue
                                    : null
                            }}
                        </div>
                    </div>
                </div>
                <div class="x-axis">
                    <span
                        v-for="(label, index) in visibleLabels"
                        :key="index"
                        class="x-axis__element"
                        :style="`${
                            !labelImages[0] ? 'transform: rotate(70deg);' : ''
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
                            <dl-tooltip> {{ labelStrings[index] }}</dl-tooltip>
                        </span>
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
        <div
            v-if="tooltipState?.visible"
            :style="tooltipStyles"
            class="tooltip"
        >
            <span class="tooltip__x">{{ tooltipState.xLabel }}</span>
            <span class="tooltip__y">{{ tooltipState.yLabel }}</span>
            <span>
                <span
                    v-if="tooltipState.value"
                    class="tooltip__color"
                    :style="`background-color: ${getCellBackground(
                        tooltipState.value
                    )}`"
                />
                {{ normalized ? 'Normalized' : 'Unnormalized' }}
                {{ tooltipState.value }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import DlBrush from '../../components/DlBrush.vue'
import DlTooltip from '../../../../essential/DlTooltip/DlTooltip.vue'
import {
    DlConfusionMatrixCell,
    DlConfusionMatrixLabel,
    DlConfusionMatrixBrushState
} from './types'
import { hexToRgbA } from '../../../../../utils/colors'
import { colorNames } from '../../../../../utils/css-color-names'
import { useThemeVariables } from '../../../../../hooks/use-theme'
import {
    getGradationValues,
    normalizeMatrix,
    validateMatrix,
    setZoom,
    getCellWidth,
    flattenConfusionMatrix
} from './utils'
import { debounce } from 'lodash'
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
        }
    },
    setup(props) {
        const { variables } = useThemeVariables()

        const getCellBackground = (value: number = 1) => {
            return hexToRgbA(
                { ...variables, ...colorNames }[props.color],
                value
            )
        }
        return { variables, getCellBackground }
    },
    data(): {
        tooltipState: { x: string; y: string } | null
        currentBrushState: { min: number; max: number }
        cellWidth: number
    } {
        return {
            tooltipState: null,
            currentBrushState: { min: 0, max: this.matrix.length },
            cellWidth: null
        }
    },
    computed: {
        visibleLabels(): string[] | DlConfusionMatrixLabel[] {
            return this.labels.slice(
                this.currentBrushState.min,
                this.currentBrushState.max
            )
        },
        labelStrings(): string[] | DlConfusionMatrixLabel[] {
            if (typeof this.labels[0] === 'object')
                return this.labels.map((label: any) => label.title)
            else return this.labels
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
        matrixStyles(): object {
            return {
                '--matrix-rows': this.matrix.length,
                '--cell-dimensions': `${this.cellWidth}px`,
                '--general-color': this.getCellBackground()
            }
        },
        tooltipStyles(): object {
            return {
                left: `${this.tooltipState?.x + 10}px`,
                top: `${this.tooltipState?.y + 15}px`
            }
        },
        gradationValues(): number[] {
            return this.normalized
                ? [1, 0.8, 0.6, 0.4, 0.2, 0]
                : getGradationValues(this.matrix)
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

            this.cellWidth = width / this.matrix.length
            colorSpectrum.style.height = `${width}px`
            labelY.style.width = `${this.cellWidth * 2}px`
            labelY.style.height = `${labelY.offsetWidth}px`
            labelY.style.marginTop = `${width / 2}px`
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
                const scroll = brush.min * getCellWidth() + 2
                const container = ctx.$refs.matrixWrapper
                container.scroll(scroll, scroll)
                ctx.currentBrushState = brush
                ctx.resizeYAxis()
            },
            30
        ),
        resizeYAxis() {
            (this.$refs.yAxis as HTMLElement).style.height = `${
                getCellWidth() * this.matrix.length
            }px`
        },
        handleMatrixScroll(e: MouseEvent) {
            const target = e.target as HTMLElement
            ;(this.$refs.yAxisOuter as HTMLElement).scroll(0, target.scrollTop)
        },
        handleShowTooltip(cell: DlConfusionMatrixCell, e: MouseEvent) {
            this.showTooltip(this, cell, e)
        },
        handleHideTooltip() {
            this.hideTooltip(this)
        },
        showTooltip: debounce(
            (ctx: any, cell: DlConfusionMatrixCell, e: MouseEvent) => {
                ctx.tooltipState = {
                    value: ctx.normalized ? cell.value : cell.unnormalizedValue,
                    xLabel: cell.xLabel,
                    yLabel: cell.yLabel,
                    x: e.pageX,
                    y: e.pageY,
                    visible: true
                }
            },
            200
        ),
        hideTooltip: debounce((ctx: any) => {
            if (ctx?.tooltipState) ctx.tooltipState.visible = false
        }, 200),
        openLink(cell: DlConfusionMatrixCell) {
            if (!cell.link) return
            window.open(cell.link, '_blank')
        }
    }
})
</script>

<style lang="scss">
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
    transform: rotate(-90deg);
    margin-right: 10px;
}
.label-tag.x {
    margin-top: 15px;
}
.x-axis {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    min-height: 100px;
    max-height: 100px;
    &__element {
        width: var(--cell-dimensions);
        line-height: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.y-axis {
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__element {
        text-align: end;
        line-height: var(--cell-dimensions);
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.y-axis-outer {
    overflow: hidden;
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
        font-size: 80%;
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

.tooltip {
    position: absolute;
    border: 1px solid var(--dl-color-separator);
    padding: 8px;
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    background-color: var(--dl-color-shadow);
    border-radius: 3px;
    animation: fadeIn 0.4s;

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
