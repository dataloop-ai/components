import { defineComponent, shallowRef, computed } from 'vue-demi'
import type { ChartType, ChartComponentLike, DefaultDataPoint } from 'chart.js'
import {
    Chart as ChartJS,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController
} from 'chart.js'
import type { TypedChartComponent, ChartComponentRef } from './types'
import { CommonProps } from './props'
import { Chart } from './chart'
import { compatProps } from './utils'

const template = `<Chart v-bind="{...allProps}" />`

export function createTypedChart<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown
>(
    type: TType,
    registerables: ChartComponentLike
): TypedChartComponent<TType, TData, TLabel> {
    ChartJS.register(registerables)

    return defineComponent({
        components: {
            Chart
        },
        props: CommonProps,
        setup(props) {
            const canvasRef = shallowRef<ChartJS | null>(null)
            const reforwardRef = (chartRef: ChartComponentRef) => {
                canvasRef.value = chartRef?.chart
            }

            const allProps = computed(() => {
                return compatProps(
                    {
                        ref: reforwardRef as any
                    },
                    {
                        type,
                        ...props
                    }
                )
            })

            return {
                allProps
            }
        },
        template
    }) as any
}

export const Bar = /* #__PURE__ */ createTypedChart('bar', BarController)

export const Doughnut = /* #__PURE__ */ createTypedChart(
    'doughnut',
    DoughnutController
)

export const Line = /* #__PURE__ */ createTypedChart('line', LineController)

export const Pie = /* #__PURE__ */ createTypedChart('pie', PieController)

export const PolarArea = /* #__PURE__ */ createTypedChart(
    'polarArea',
    PolarAreaController
)

export const Radar = /* #__PURE__ */ createTypedChart('radar', RadarController)

export const Bubble = /* #__PURE__ */ createTypedChart(
    'bubble',
    BubbleController
)

export const Scatter = /* #__PURE__ */ createTypedChart(
    'scatter',
    ScatterController
)
