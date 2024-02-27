<template>
    <div
        style="
            display: flex;
            width: 900px;
            flex-wrap: wrap;
            flex-direction: column;
            gap: 0px;
        "
    >
        <dl-bar-chart
            :legend-props="legendProps"
            :data="data"
            :options="options"
            :items-in-view="6"
        />

        <dl-bar-chart
            :legend-props="legendProps"
            :data="data"
            :options="options"
            :items-in-view="6"
            is-empty
        />

        <div style="color: var(--dl-color-darker); margin-bottom: 30px">
            Customized DlBarChart with data labels
        </div>
        <!-- @vue-ignore -->
        <dl-bar-chart
            :data="cdlData"
            :options="cdlOptions"
            :plugins="cdlPlugins"
            :items-in-view="data.labels.length + 1"
        >
            <template #legend><span /></template>
        </dl-bar-chart>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { ChartOptions } from 'chart.js'
import { DlBarChart } from '../components'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const labelsFn = () => {
    const a = []
    for (let i = 0; i < 20; i++) {
        a.push(`${i}`)
    }
    return a
}

const dataFn = () => {
    const a = []
    for (let i = 1; i <= 20; i++) {
        a.push(i)
    }
    return a
}

const data = {
    labels: labelsFn(),
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: dataFn()
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: dataFn()
        }
    ]
}

const legendProps = {
    alignItems: 'center'
}

const options: ChartOptions = {
    scales: {
        y: {
            afterFit: (scaleInstance) => {
                scaleInstance.width = 50
            }
        }
    }
}

const cdlData = {
    labels: labelsFn().map((l) => `Data [${l}]:`),
    datasets: [
        {
            label: 'Duh',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: dataFn(),
            datalabels: {
                align: 'end',
                anchor: 'start'
            }
        },
        {
            label: 'Duh',
            backgroundColor: '--dl-color-info-background',
            borderRadius: 4,
            data: dataFn().map((n) => 20 - n),
            datalabels: {
                align: 'start',
                anchor: 'end'
            }
        }
    ]
}

const cdlOptions: ChartOptions = {
    plugins: {
        datalabels: {
            color: '--dl-color-darker',
            font: {
                weight: 'bold'
            },
            formatter (value, context) {
                switch (context.datasetIndex) {
                    case 0:
                        return context.chart.data.labels[context.dataIndex]
                    case 1:
                        return (
                            'Value is ' +
                            context.chart.data.datasets[0].data[
                                context.dataIndex
                            ]
                        )
                }
            }
        },
        tooltip: {
            callbacks: {
                label (tooltipItem) {
                    return 'Value is ' + tooltipItem.formattedValue
                }
            },
            filter (tooltipItem) {
                return tooltipItem.datasetIndex === 0
            }
        }
    },
    scales: {
        x: {
            stacked: true,
            display: false
        },
        y: {
            stacked: true,
            display: false
        }
    }
}

export default defineComponent({
    name: 'DlChartDemo',
    components: {
        DlBarChart
    },
    data() {
        return {
            cdlData,
            cdlOptions,
            cdlPlugins: [ChartDataLabels],
            data,
            options,
            legendProps
        }
    },
    methods: {}
})
</script>

<style scoped lang="scss"></style>
