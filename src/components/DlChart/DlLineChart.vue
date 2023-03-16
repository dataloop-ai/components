<template>
    <div :class="chartWrapperClasses">
        <DlLine
            :id="id"
            ref="lineChart"
            :class="chartClasses"
            :style="(chartStyles, `max-height: ${wrapperHeight}`)"
            :data="chartData"
            :options="chartOptions"
            @mouseout="onChartLeave"
        />
        <slot
            v-if="displayLabels"
            v-bind="{ ...labelStyles, labels: xLabels, chartWidth }"
            name="axe-x-labels"
        >
            <dl-chart-labels
                :font-size="labelStyles.labelSize"
                :title="labelStyles.title"
                :title-size="labelStyles.titleSize"
                :title-color="labelStyles.titleColor"
                :label-color="labelStyles.labelColor"
                :width="chartWidth"
                :labels="xLabels"
            />
        </slot>
        <slot
            v-if="displayBrush"
            v-bind="{
                chartWidth,
                modelValue: brush.value,
                handleBrushUpdate,
                brushClasses,
                ...brushProperties
            }"
            name="brush"
        >
            <dl-brush
                :model-value="brush.value"
                :width="chartWidth"
                :min="brushProperties.min"
                :max="brushProperties.max"
                :class="brushClasses"
                :thumb-size="brushProperties.thumbSize"
                :track-size="brushProperties.trackSize"
                :step="brushProperties.step"
                :drag-range="brushProperties.dragRange"
                @update:model-value="handleBrushUpdate"
            />
        </slot>
        <slot
            v-if="displayLegend"
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
import { Line as DlLine } from '.'
import { CommonProps, ColumnChartProps, defaultLineChartProps } from './props'
import { defineComponent, reactive, watch, ref, computed } from 'vue-demi'
import DlBrush from './DlBrush.vue'
import DlChartLegend from './DlChartLegend.vue'
import DlChartLabels from './DlChartLabels.vue'
import { updateKeys } from '../../utils/update-key'
import { hexToRgbA } from '../../utils'
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
    BarControllerDatasetOptions,
    TimeScale
} from 'chart.js'
import type {
    Chart,
    ChartMeta,
    ChartDataset,
    ActiveElement,
    ChartData,
    DatasetController,
    LineControllerDatasetOptions
} from 'chart.js'
import { orderBy, merge, isEqual, unionBy, cloneDeep } from 'lodash'
import { useThemeVariables } from '../../hooks/use-theme'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale
)

export default defineComponent({
    name: 'DlLineChart',
    components: {
        DlBrush,
        DlChartLegend,
        DlLine,
        DlChartLabels
    },
    props: {
        id: {
            type: String,
            default: null
        },
        ...CommonProps,
        ...ColumnChartProps
    },
    setup(props, { slots }) {
        const { variables } = useThemeVariables()

        const chartWidth = ref('100%')

        const chartHoverDataset: { value: null | ChartMeta } = {
            value: null
        }

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

        const chart = computed(() => {
            return lineChart.value?.chart?.value || {}
        })

        const replaceColor = (key: keyof typeof variables) =>
            variables[key] || key

        const lineChart = ref(null)

        const brush = reactive({
            value: {
                min: 0,
                max:
                    orderBy(props.data.datasets, (o) => o.data.length)[0].data
                        .length - 1
            }
        })

        const getChartBackup = () => {
            if (!chart.value) {
                return {
                    data: {},
                    options: {}
                }
            }
            const datasets: DatasetController<'line'> = updateKeys(
                props.data.datasets,
                [
                    'backgroundColor',
                    'pointBackgroundColor',
                    'pointBorderColor',
                    'borderColor',
                    'hoverBorderColor',
                    'hoverBackgroundColor',
                    'pointHoverBackgroundColor',
                    'pointHoverBorderColor'
                ],
                replaceColor
            ).map((item: LineControllerDatasetOptions) => {
                return {
                    ...item,
                    hoverBackgroundColor:
                        item.hoverBackgroundColor ||
                        hexToRgbA(item.backgroundColor as string, 0.2),
                    hoverBorderColor:
                        item.hoverBorderColor ||
                        hexToRgbA(item.backgroundColor as string, 0.2)
                }
            })

            const chartProps = cloneDeep({
                options: props.options,
                data: {
                    ...props.data,
                    datasets
                }
            })

            return chartProps
        }

        const chartWrapperClasses = computed(() => {
            const classes = 'dl-line-chart-wrapper'

            if (props.rootClass) {
                classes.concat(' ', props.rootClass)
            }

            return classes
        })

        const chartClasses = computed(() => {
            const classes = 'dl-line-chart'

            if (props.chartClass) {
                classes.concat(' ', props.chartClass)
            }

            return classes
        })

        const brushClasses = computed(() => {
            const classes = 'dl-brush'

            if (props.brushClass) {
                classes.concat(' ', props.brushClass)
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

        const brushProperties = computed(() => {
            return merge(defaultLineChartProps.brushProps, props.brushProps)
        })

        const legendProperties = computed(() => {
            return merge(defaultLineChartProps.legendProps, props.legendProps)
        })

        const replaceDataColors = (data: ChartData) =>
            updateKeys(
                data,
                [
                    'backgroundColor',
                    'pointBackgroundColor',
                    'pointBorderColor',
                    'borderColor',
                    'hoverBorderColor',
                    'hoverBackgroundColor',
                    'pointHoverBackgroundColor',
                    'pointHoverBorderColor'
                ],
                replaceColor
            )

        const chartData = ref(replaceDataColors(props.data))

        const legendDatasets = ref(
            unionBy(
                props.legendProps?.datasets || [],
                props.data?.datasets || [],
                'label'
            )
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

                const backup = getChartBackup()

                for (const dataset of filteredItems) {
                    chart.value.data.datasets[dataset.index].backgroundColor = (
                        backup.data as ChartData<'line'>
                    ).datasets[dataset.index].backgroundColor
                    chart.value.data.datasets[dataset.index].borderColor = (
                        backup.data as ChartData<'line'>
                    ).datasets[dataset.index].borderColor
                }
                chartHoverDataset.value = null

                chart.value.update()
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
                            ...d,
                            index: i
                        }))
                        .filter(
                            (dataset: ChartDataset) =>
                                dataset.label !== chartHoverDataset.value.label
                        )
                    const backup = getChartBackup()
                    for (const dataset of filteredItems) {
                        chartJS.data.datasets[dataset.index].backgroundColor = (
                            backup.data as ChartData<'line'>
                        ).datasets[dataset.index].backgroundColor

                        chartJS.data.datasets[dataset.index].borderColor = (
                            backup.data as ChartData<'line'>
                        ).datasets[dataset.index].borderColor
                    }

                    chartHoverDataset.value = null

                    chartJS.update()
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

                        chart.value.data.datasets[dataset.index].borderColor =
                            dataset?.hoverBorderColor ||
                            hexToRgbA(dataset.backgroundColor as string, 0.2)
                    }

                    chartHoverDataset.value = datasetItem

                    chartJS.update()

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

                    const backup = getChartBackup()
                    for (const dataset of filteredItems) {
                        chartJS.data.datasets[dataset.index].backgroundColor = (
                            backup.data as ChartData<'line'>
                        ).datasets[dataset.index].backgroundColor

                        chartJS.data.datasets[dataset.index].borderColor = (
                            backup.data as ChartData<'line'>
                        ).datasets[dataset.index].borderColor
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
            updateKeys(
                merge(
                    { onResize, onHover },
                    defaultLineChartProps.options,
                    props.options
                ),
                ['color'],
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

        const handleBrushUpdate = (value: { min: number; max: number }) => {
            brush.value.min = value.min
            brush.value.max = value.max

            chart.value.options.scales.x.min = value.min
            chart.value.options.scales.x.max = value.max

            xLabels.value = chart.value.data.labels.slice(
                value.min,
                value.max + brushProperties.value.step
            )

            chart.value.update()
        }

        const xLabels = ref(props.data.labels)

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
                    dataset?.hoverBackgroundColor ||
                    hexToRgbA(dataset.backgroundColor, 0.2)

                chart.value.data.datasets[dataset.index].borderColor =
                    dataset?.hoverBorderColor ||
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

            const backup = getChartBackup()

            for (const dataset of filteredItems) {
                chart.value.data.datasets[dataset.index].backgroundColor = (
                    backup.data as ChartData<'line'>
                ).datasets[dataset.index].backgroundColor

                chart.value.data.datasets[dataset.index].borderColor = (
                    backup.data as ChartData<'line'>
                ).datasets[dataset.index].borderColor
            }
            chart.value.update()
        }

        const labelStyles = computed(() => {
            const options = merge(
                {},
                defaultLineChartProps.options,
                props.options
            )
            return {
                title: options.scales.x.title.text,
                titleSize: `${options.scales.x.title.font.size}px`,
                titleColor: options.scales.x.title.color.replace('--', ''),
                labelColor: options.scales.x.ticks.color.replace('--', ''),
                fontSize: `${options.scales.x.ticks.font.size}px`
            }
        })

        const hideData = (item: BarControllerDatasetOptions, index: number) => {
            onLeaveLegend(item, index)

            chart.value.data.datasets[index].hidden = !!item.hidden

            legendDatasets.value.splice(index, 1, {
                ...legendDatasets.value[index],
                hidden: !!item.hidden
            })

            chart.value.update()
        }

        watch(variables, () => {
            merge(chart.value.data, getChartBackup().data)

            merge(
                chart.value.options,
                updateKeys(
                    merge(
                        { onResize, onHover },
                        defaultLineChartProps.options,
                        props.options
                    ),
                    ['color'],
                    replaceColor
                )
            )

            chart.value.options.scales.x.min = brush.value.min
            chart.value.options.scales.x.max = brush.value.max

            chart.value.update()
        })

        watch(
            [props.data, props.options],
            ([newData = {}, newOptions = {}]) => {
                chartData.value = replaceDataColors(newData as ChartData)

                xLabels.value = (newData as ChartData)?.labels

                chartOptions.value = updateKeys(
                    merge(
                        { onResize, onHover },
                        defaultLineChartProps.options,
                        newOptions
                    ),
                    ['color'],
                    replaceColor
                )
            },
            { deep: true }
        )

        return {
            variables,
            chartData,
            chartOptions,
            brush,
            xLabels,
            lineChart,
            handleBrushUpdate,
            chartWrapperClasses,
            chartClasses,
            brushClasses,
            legendClasses,
            brushProperties,
            legendDatasets,
            legendProperties,
            hideData,
            chartWidth,
            onHoverLegend,
            onLeaveLegend,
            onChartLeave,
            chart,
            labelStyles
        }
    },
    data() {
        return {}
    }
})
</script>

<style scoped lang="scss">
.dl-line-chart-wrapper {
    display: flex;
    flex-direction: column;
    align-self: stretch;
}

.dl-brush {
    margin-top: 10px;
}

.dl-legend {
    margin-top: 16px;
    margin-bottom: 16px;
}

.dl-brush,
.dl-legend {
    align-self: flex-end;
}
</style>
