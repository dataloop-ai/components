<template>
    <div
        style="
            display: flex;
            width: 800px;
            flex-wrap: wrap;
            flex-direction: row;
            gap: 0;
        "
    >
        <dl-column-chart
            :brush-props="brushProps"
            :legend-props="legendProps"
            :data="data[0]"
            :options="options[0]"
            style="width: 50%"
        />
        <dl-column-chart
            :brush-props="brushProps"
            :legend-props="legendProps"
            :data="data[1]"
            :options="options[1]"
            style="width: 50%"
        >
            <template #axe-x-labels="{ labels, chartWidth }">
                <div
                    :style="`display: flex; width: ${chartWidth}; align-self: flex-end; justify-content: space-between;`"
                >
                    <div
                        v-for="(url, key) in labels"
                        :key="key"
                        style="
                            display: flex;
                            width: 100%;
                            justify-content: center;
                        "
                    >
                        <dl-avatar size="24px">
                            <img :src="url">
                        </dl-avatar>
                        <div />
                    </div>
                </div>
            </template>
        </dl-column-chart>

        <dl-column-chart
            :brush-props="brushProps"
            :legend-props="legendProps"
            :data="data[0]"
            :options="options[0]"
            style="width: 100%"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlColumnChart from '../components/DlChart/DlColumnChart.vue'
import DlAvatar from '../components/Basic/DlAvatar/DlAvatar.vue'

import { orderBy } from 'lodash'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = [
    {
        labels: [
            'JanuaryJanuaryJanuaryJanuary',
            'February',
            'March',
            'April',
            'May',
            'June'
        ],
        datasets: [
            {
                label: 'Data One 1',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 2',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 3',
                backgroundColor: '--dl-color-negative',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 4',
                backgroundColor: '--dl-color-positive',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 5',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 6',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 7',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 8',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            }
        ]
    },

    {
        labels: [
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200'
        ],
        datasets: [
            {
                label: 'Data One',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            }
        ]
    }
]

const brushProps = {
    min: 0,
    max: orderBy(data[0].datasets, (o) => o.data.length)[0].data.length - 1
}

const options = [
    {
        scales: {
            y: {
                ticks: {
                    callback(value: string, index: number, ticks: string[]) {
                        return value + 's'
                    }
                },
                suggestedMax: 45
            },
            x: {
                min: 0,
                max:
                    orderBy(data[0].datasets, (o) => o.data.length)[0].data
                        .length - 1
            }
        }
    },

    {
        scales: {
            y: {
                ticks: {
                    callback(value: string, index: number, ticks: string[]) {
                        return value + 's'
                    }
                },
                suggestedMax: 45
            },
            x: {
                min: 0,
                max:
                    orderBy(data[1].datasets, (o) => o.data.length)[0].data
                        .length - 1
            }
        }
    }
]

const legendProps = {
    alignItems: 'center'
}

export default defineComponent({
    name: 'DlColumnChartDemo',
    components: {
        DlColumnChart,
        DlAvatar
    },
    data() {
        return {
            options,
            data,
            brushProps,
            legendProps
        }
    }
})
</script>

<style scoped lang="scss"></style>
