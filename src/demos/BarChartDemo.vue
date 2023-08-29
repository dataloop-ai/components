<template>
    <div
        style="
            display: flex;
            width: 900px;
            flex-wrap: wrap;
            flex-direction: row;
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { ChartOptions } from 'chart.js'
import { DlBarChart } from '../components'

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

export default defineComponent({
    name: 'DlChartDemo',
    components: {
        DlBarChart
    },
    data() {
        return {
            data,
            options,
            legendProps
        }
    },
    methods: {}
})
</script>

<style scoped lang="scss"></style>
