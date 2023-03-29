<template>
    <div>
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
                ref="yAxis"
                class="y-axis"
            >
                <div
                    v-for="(row, index) in currentMatrix"
                    :key="index"
                    class="y-axis__element"
                >
                    <img
                        v-if="labelImages[0]"
                        class="legend-avatar"
                        :src="labelImages[index]"
                    >
                    <span v-else>
                        {{ labels[index] }}
                    </span>
                    <dl-tooltip> {{ labelStrings[index] }}</dl-tooltip>
                </div>
            </div>
            <div
                ref="verticalWrapper"
                class="vertical_wrapper"
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
                        @mouseenter="showTooltip(this, cell, $event)"
                        @mouseleave="hideTooltip(this)"
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
                <div class="x-axis">
                    <span
                        v-for="(row, index) in currentMatrix"
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
                                {{ labels[index] }}
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
import DlBrush from '../DlBrush/DlBrush.vue'
import DlTooltip from '../DlTooltip.vue'
import { MatrixCell, Label, BrushState } from './types'
import { hexToRgbA } from '../../utils/colors'
import { colorNames } from '../../utils/css-color-names'
import { useThemeVariables } from '../../hooks/use-theme'
import { getGradationValues, normalizeMatrix, validateMatrix } from './utils'
import { debounce } from 'lodash'
export default defineComponent({
    components: {
        DlBrush,
        DlTooltip
    },
    props: {
        labels: {
            required: true,
            type: Array as PropType<string[] | Label[]>,
            default: (): [] => []
        },
        matrix: {
            required: true,
            type: Array as PropType<number[][]>,
            default: (): [] => []
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
        currentMatrix: number[][]
        tooltipState: { x: string; y: string } | null
        currentBrushState: { min: number; max: number }
        cellWidth: number
        timer: number
    } {
        return {
            currentMatrix: this.matrix,
            tooltipState: null,
            currentBrushState: { min: 0, max: this.matrix.length },
            cellWidth: null,
            timer: null
        }
    },
    computed: {
        labelStrings(): string[] | Label[] {
            if (typeof this.labels[0] === 'object')
                return this.labels.map((label: any) => label.title)
            else return this.labels
        },
        labelImages(): string[] {
            return this.labels.map((label: any) => label.image)
        },
        isValidMatrix(): boolean {
            return validateMatrix(this.matrix, this.labelStrings)
        },
        flattenedMatrix(): MatrixCell[] {
            return normalizeMatrix(
                this.currentMatrix.flatMap(
                    (row: number[], rowIndex: number) => {
                        return row.map(
                            (cellValue: number, cellIndex: number) => {
                                return {
                                    value: cellValue,
                                    unnormalizedValue: cellValue,
                                    xLabel: this.labelStrings[rowIndex],
                                    yLabel: this.labelStrings[cellIndex],
                                    x: rowIndex,
                                    y: cellIndex
                                }
                            }
                        )
                    }
                )
            )
        },
        matrixStyles(): object {
            return {
                '--matrix-rows': this.currentMatrix.length,
                '--cell-dimensions': `${this.cellWidth}px`,
                '--general-color': this.getCellBackground()
            }
        },
        tooltipStyles(): object {
            return {
                left: `${this.tooltipState?.x + 10}px`,
                top: `${this.tooltipState?.y + 30}px`
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
            const yAxis = this.$refs.yAxis as HTMLElement
            const labelY = this.$refs.labelY as HTMLElement
            const width = verticalWrapper.offsetWidth

            this.cellWidth = width / this.currentMatrix.length

            colorSpectrum.style.height = `${width}px`
            yAxis.style.height = `${width}px`

            labelY.style.height = `${labelY.offsetWidth}px`
            labelY.style.marginTop = `${yAxis.offsetHeight / 2}px`
        },
        handleBrushUpdate(brush: BrushState) {
            if (
                brush.min === this.currentBrushState.min &&
                brush.max === this.currentBrushState.max
            )
                return
            this.updateBrush(this, brush)
        },
        updateBrush: debounce((context: any, brush: BrushState) => {
            const matrix: number[][] = []
            for (let i = brush.min; i < brush.max; i++)
                matrix.push([...context.matrix[i]])
            const newMatrix: number[][] = []
            matrix.forEach((row) => {
                newMatrix.push(row.slice(brush.min, brush.max))
            })
            context.currentMatrix = newMatrix
            context.currentBrushState = brush
            context.resizeMatrix()
        }, 30),
        showTooltip: debounce(
            (context: any, { xLabel, yLabel, value }, e: MouseEvent) => {
                context.tooltipState = {
                    value,
                    xLabel,
                    yLabel,
                    x: e.pageX,
                    y: e.pageY,
                    visible: true
                }
            }
        ),
        hideTooltip: debounce((context: any) => {
            context.tooltipState.visible = false
        })
    }
})
</script>

<style lang="scss">
.wrapper {
    display: flex;
    width: 100%;
    height: 100%;
}
.vertical_wrapper {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.label-tag {
    font-size: 14px;
    color: var(--dl-color-medium);
}
.label-tag.y {
    transform: rotate(-90deg);
}
.label-tag.x {
    margin-top: 15px;
}
.x-axis {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    min-height: 100px;
    max-height: 100px;
    &__element {
        width: var(--cell-dimensions);
        text-align: center;
        line-height: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.y-axis {
    width: 5%;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__element {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: var(--cell-dimensions);
    }
}
.y-axis,
.x-axis {
    color: var(--dl-color-darker);
    font-size: 16px;
}

.matrix {
    display: grid;
    grid-template-rows: repeat(var(--matrix-rows), 1fr);
    grid-template-columns: repeat(var(--matrix-rows), 1fr);

    &__cell {
        font-size: 60%;
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
        font-size: 80%;
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
    font-size: 80%;
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
