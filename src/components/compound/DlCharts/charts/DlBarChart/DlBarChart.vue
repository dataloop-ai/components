<template>
    <div :class="chartWrapperClasses">
        <div
            class="canvas-container"
            :style="`height: ${wrapperHeight}`"
        >
            <Bar
                :id="id"
                ref="barChart"
                :class="chartClasses"
                :style="chartStyles"
                :data="chartData"
                :options="chartOptions"
                @mouseout="onChartLeave"
                @wheel.native="handleChartScroll"
            />
            <dl-chart-scroll-bar
                v-if="maxItems > thisItemsInView"
                :wrapper-styles="{
                    marginTop: '10px'
                }"
                :height="wrapperHeight"
                :item-count="maxItems"
                :items-in-view="thisItemsInView"
                :position="scrollPosition"
                :scroll-deficit="50"
                @position-update="handleScrollUpdate"
            />
        </div>
        <slot
            v-bind="{ labels: xLabels, chartWidth }"
            name="axe-x-labels"
        />
        <slot
            v-bind="{
                data: legendDatasets,
                chartWidth,
                onHide: hideData,
                onHoverLegend,
                onLeaveLegend,
                ...legendProperties
            }"
            name="legend"
        >
            <dl-chart-legend
                :datasets="legendDatasets"
                :width="chartWidth"
                :class="legendClasses"
                :align-items="legendProperties.alignItems"
                @hide="hideData"
                @on-hover="onHoverLegend"
                @on-leave="onLeaveLegend"
            />
        </slot>
    </div>
</template>

<script lang="ts">
import { Bar } from '../../types/typedCharts'
import {
    CommonProps,
    BarChartProps,
    defaultBarChartProps
} from '../../types/props'
import { defineComponent, reactive, ref, watch, computed } from 'vue-demi'
import DlChartLegend from '../../components/DlChartLegend.vue'
import DlChartScrollBar from '../../components/DlChartScrollBar.vue'
import { updateKey } from '../../../../../utils/update-key'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarControllerDatasetOptions
} from 'chart.js'
import type { Chart, ChartMeta, ChartDataset, ActiveElement } from 'chart.js'
import { isEqual, merge } from 'lodash'
import { rgba2hex, hexToRgbA, revertRGBAOpacity } from '../../../../../utils'
import { useThemeVariables } from '../../../../../hooks/use-theme'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
)
export default defineComponent({
    name: 'DlBarChart',
    components: {
        Bar,
        DlChartScrollBar,
        DlChartLegend
    },
    props: {
        ...CommonProps,
        ...BarChartProps,
        itemsInView: {
            type: Number,
            required: true
        },
        id: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const { variables } = useThemeVariables()

        const chartWidth = ref('100%')

        const chartHoverDataset: { value: null | ChartMeta } = {
            value: null
        }

        const thisItemsInView = computed(() => props.itemsInView - 1)

        const onResize = (
            chart: Chart,
            size: { height: number; width: number }
        ) => {
            if (chart?.scales?.x?.width) {
                chartWidth.value = `${parseInt(
                    chart.scales.x.width as unknown as string
                )}px`
            }
        }

        const replaceColor = (key: keyof typeof variables) =>
            variables[key] || key

        const chartData = ref(
            updateKey(
                updateKey(props.data, 'backgroundColor', replaceColor),
                'hoverBackgroundColor',
                replaceColor
            )
        )

        const barChart = ref()

        const scrollPosition = ref(0)

        const chart = computed(() => {
            return barChart.value?.chart?.value || {}
        })

        let scroll: number = 0
        let steps: number = 0

        const chartWrapperClasses = computed(() => {
            const classes = 'dl-bar-chart-wrapper'

            if (props.rootClass) {
                classes.concat(' ', props.rootClass)
            }

            return classes
        })

        const chartClasses = computed(() => {
            const classes = 'dl-bar-chart'

            if (props.chartClass) {
                classes.concat(' ', props.chartClass)
            }

            return classes
        })

        const legendClasses = computed(() => {
            const classes = 'dl-legend'

            if (props.legendClass) {
                classes.concat(' ', props.legendClass)
            }

            return classes
        })

        const legendProperties = computed(() => {
            return merge(defaultBarChartProps.legendProps, props.legendProps)
        })

        const legendDatasets = ref(
            props.legendProps?.datasets?.length > 0
                ? props.legendProps.datasets
                : chartData.value?.datasets || []
        )

        const onChartLeave = () => {
            if (chartHoverDataset.value) {
                const filteredItems = chart.value.data.datasets
                    .map((d: ChartDataset, i: number) => ({
                        ...d,
                        index: i
                    }))
                    .filter(
                        (dataset: ChartDataset) =>
                            dataset.label !== chartHoverDataset.value.label
                    )

                for (const dataset of filteredItems) {
                    chart.value.data.datasets[dataset.index].backgroundColor =
                        rgba2hex(revertRGBAOpacity(dataset.backgroundColor))
                }
                chart.value.update()
                chartHoverDataset.value = null
            }
        }

        const onHover = (
            event: Event,
            items: ActiveElement[],
            chartJS: Chart
        ) => {
            if (event.type !== 'mousemove') {
                return
            }
            const hover = !!document.querySelector('.drag-clone')
            chartJS.options.plugins.tooltip.enabled = !hover
            if (hover) return
            if (
                items.length === 0 ||
                chartJS.getElementsAtEventForMode(
                    event,
                    'nearest',
                    {
                        intersect: true
                    },
                    true
                ).length === 0
            ) {
                if (chartHoverDataset.value) {
                    const filteredItems = chartJS.data.datasets
                        .map((d: ChartDataset, i: number) => ({
                            ...(d as ChartDataset),
                            index: i
                        }))
                        .filter(
                            (dataset: ChartDataset) =>
                                dataset.label !== chartHoverDataset.value.label
                        )

                    for (const dataset of filteredItems) {
                        chartJS.data.datasets[dataset.index].backgroundColor =
                            rgba2hex(
                                revertRGBAOpacity(
                                    dataset.backgroundColor as string
                                )
                            )
                    }
                    chartJS.update()

                    chartHoverDataset.value = null
                }
                return
            } else {
                const item = items[0]

                const datasetItem = chartJS.getDatasetMeta(item.datasetIndex)

                if (!chartHoverDataset.value) {
                    const filteredDatasets = chartJS.data.datasets
                        .map((d: ChartDataset, i: number) => ({
                            ...d,
                            index: i
                        }))
                        .filter(
                            (ds: ChartDataset) => ds.label !== datasetItem.label
                        )

                    for (const dataset of filteredDatasets) {
                        chartJS.data.datasets[dataset.index].backgroundColor =
                            hexToRgbA(dataset.backgroundColor as string, 0.2)
                    }

                    chartJS.update()

                    chartHoverDataset.value = datasetItem

                    return
                }

                if (!isEqual(chartHoverDataset.value, datasetItem)) {
                    const filteredItems = chartJS.data.datasets
                        .map((d: ChartDataset, i: number) => ({
                            ...d,
                            index: i
                        }))
                        .filter(
                            (dataset: ChartDataset) =>
                                dataset.label !== chartHoverDataset.value.label
                        )

                    for (const dataset of filteredItems) {
                        chartJS.data.datasets[dataset.index].backgroundColor =
                            rgba2hex(
                                revertRGBAOpacity(
                                    dataset.backgroundColor as string
                                )
                            )
                    }

                    chartHoverDataset.value = datasetItem

                    const allFilteredItems = chartJS.data.datasets
                        .map((d: ChartDataset, i: number) => ({
                            ...d,
                            index: i
                        }))
                        .filter(
                            (dataset: ChartDataset) =>
                                dataset.label !== datasetItem.label
                        )

                    for (const dataset of allFilteredItems) {
                        chartJS.data.datasets[dataset.index].backgroundColor =
                            hexToRgbA(dataset.backgroundColor as string, 0.2)
                    }
                    chartJS.update()
                }
            }
        }

        const chartOptions = reactive(
            updateKey(
                merge(
                    {
                        onHover,
                        onResize,
                        scales: {
                            y: {
                                max: thisItemsInView.value
                            },
                            x: {
                                suggestedMax: chartData.value.labels.length
                            }
                        }
                    },
                    defaultBarChartProps.options,
                    props.options
                ),
                'color',
                replaceColor
            )
        )

        watch(
            () => chart.value?.scales?.x?.width,
            (val: string) => {
                if (val) {
                    chartWidth.value = `${parseInt(val as unknown as string)}px`
                }
            },
            { deep: true }
        )

        const xLabels = ref(props.data?.labels)

        const maxItems = computed(() => chartData.value?.labels.length)

        const handleScrollUpdate = ({ position }: { position: number }) => {
            if (position >= maxItems.value - thisItemsInView.value) return
            chart.value.options.scales.y.min = position
            chart.value.options.scales.y.max = position + thisItemsInView.value

            scrollPosition.value = position

            chart.value.update()
        }

        const hideData = (item: BarControllerDatasetOptions, index: number) => {
            onLeaveLegend(item, index)

            chart.value.data.datasets[index].hidden = !!item.hidden

            legendDatasets.value.splice(index, 1, {
                ...legendDatasets.value[index],
                hidden: !!item.hidden
            })

            chart.value.update()
        }

        const handleChartScroll = (e: WheelEvent) => {
            e.preventDefault()
            scroll += e.deltaY
            const newSteps = Math.trunc(scroll / 1000)
            const newStepsModule = Math.abs(newSteps)

            if (newSteps !== steps) {
                if (newSteps > steps) {
                    const diff =
                        chart.value.options.scales.y.max + newStepsModule
                    if (diff >= maxItems.value) {
                        scrollPosition.value =
                            maxItems.value - thisItemsInView.value
                        chart.value.options.scales.y.min =
                            maxItems.value - thisItemsInView.value - 1
                        chart.value.options.scales.y.max = maxItems.value
                    } else {
                        scrollPosition.value += newStepsModule
                        chart.value.options.scales.y.min += newStepsModule
                        chart.value.options.scales.y.max += newStepsModule
                    }
                } else {
                    const diff =
                        chart.value.options.scales.y.min - newStepsModule
                    if (diff < 0) {
                        scrollPosition.value = 0
                        chart.value.options.scales.y.min = 0
                        chart.value.options.scales.y.max = thisItemsInView.value
                    } else {
                        scrollPosition.value -= newStepsModule
                        chart.value.options.scales.y.min -= newStepsModule
                        chart.value.options.scales.y.max -= newStepsModule
                    }
                }
                chart.value.update()

                steps = newSteps
            }
        }

        const onHoverLegend = (
            item: BarControllerDatasetOptions,
            index: number
        ) => {
            const filteredItems = chart.value.data.datasets
                .map((d: ChartDataset, i: number) => ({
                    ...d,
                    index: i
                }))
                .filter(
                    (dataset: ChartDataset & { index: number }) =>
                        dataset.index! !== index
                )

            for (const dataset of filteredItems) {
                chart.value.data.datasets[dataset.index].backgroundColor =
                    hexToRgbA(dataset.backgroundColor, 0.2)
            }
            chart.value.update()
        }

        const onLeaveLegend = (
            item: BarControllerDatasetOptions,
            index: number
        ) => {
            const filteredItems = chart.value.data.datasets
                .map((d: ChartDataset, i: number) => ({
                    ...d,
                    index: i
                }))
                .filter(
                    (dataset: ChartDataset & { index: number }) =>
                        dataset.index !== index
                )

            for (const dataset of filteredItems) {
                chart.value.data.datasets[dataset.index].backgroundColor =
                    rgba2hex(revertRGBAOpacity(dataset.backgroundColor))
            }
            chart.value.update()
        }

        watch(variables, () => {
            merge(
                chart.value.data,
                updateKey(
                    updateKey(props.data, 'backgroundColor', replaceColor),
                    'hoverBackgroundColor',
                    replaceColor
                )
            )

            merge(
                chart.value.options,
                updateKey(
                    merge(
                        {
                            onHover,
                            onResize,
                            scales: {
                                y: {
                                    max: thisItemsInView.value
                                }
                            }
                        },
                        defaultBarChartProps.options,
                        props.options
                    ),
                    'color',
                    replaceColor
                )
            )

            chart.value.update()
        })

        return {
            variables,
            chartData,
            chartOptions,
            xLabels,
            barChart,
            maxItems,
            chartWrapperClasses,
            chartClasses,
            legendClasses,
            legendDatasets,
            legendProperties,
            handleChartScroll,
            handleScrollUpdate,
            chartWidth,
            hideData,
            onHoverLegend,
            onLeaveLegend,
            onChartLeave,
            scrollPosition,
            thisItemsInView
        }
    },
    data() {
        return {}
    }
})
</script>

<style scoped lang="scss">
.dl-bar-chart-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.dl-bar-chart {
    width: 99% !important;
}

.canvas-container {
    height: 100%;
    width: 100%;
    display: flex;
}

.dl-legend {
    align-self: flex-end;
}
</style>
