<template>
    <div
        style="
            display: flex;
            width: 1000px;
            flex-wrap: wrap;
            flex-direction: row;
            gap: 0;
        "
    >
        <dl-scatter-chart
            id="example-one"
            :brush-props="brushProps"
            :legend-props="legendProps"
            :data="data"
            :options="options"
            style="width: 100%"
        />

        <dl-scatter-chart
            id="example-two"
            :brush-props="brushProps"
            :legend-props="legendProps"
            :data="data"
            :options="options"
            style="width: 100%"
            is-empty
            :display-labels="false"
            :display-legend="false"
            :display-brush="false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlScatterChart } from '../components'
import { orderBy } from 'lodash'

const data = {
    labels: [
        {
            title: '0.1'
        },
        {
            title: '0.2'
        },
        {
            title: '0.3'
        },
        {
            title: '0.4'
        },
        {
            title: '0.5'
        },
        {
            title: '0.6'
        },
        {
            title: '0.7'
        },
        {
            title: '0.8'
        },
        {
            title: '0.9'
        },
        {
            title: '1'
        }
    ],
    datasets: [
        {
            label: 'Scatter Dataset',
            data: [
                { x: 0.1, y: 0.1 },
                { x: 0.2, y: 0.1 },
                { x: 0.3, y: 0.2 },
                { x: 0.4, y: 0.3 },
                { x: 0.5, y: 0.35 },
                { x: 0.6, y: 0.39 },
                { x: 0.7, y: 0.4 },
                { x: 0.8, y: 0.8 },
                { x: 0.9, y: 0.8 }
            ],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 5,
            showLine: true
        },
        {
            label: 'Dataset 2',
            data: [
                { x: 0.2, y: 0.1 },
                { x: 0.2, y: 0.2 },
                { x: 0.4, y: 0.2 },
                { x: 0.4, y: 0.3 },
                { x: 0.6, y: 0.65 },
                { x: 0.6, y: 0.85 },
                { x: 0.8, y: 0.6 },
                { x: 0.8, y: 0.7 },
                { x: 0.9, y: 0.8 }
            ],
            backgroundColor: 'rgba(45, 162, 50, 1)',
            borderColor: 'rgba(45, 162, 50, 1)',
            pointRadius: 5,
            showLine: true
        }
    ]
}

const brushProps = {
    min: 0,
    max: orderBy(data.datasets, (o) => o.data.length)[0].data.length - 1
}

const options = {
    scales: {
        x: {
            type: 'linear',
            position: 'bottom',
            axis: 'Recall',
            scaleLabel: {
                display: true,
                labelString: 'Recall'
            }
        },
        y: {
            type: 'linear',
            position: 'left',
            axis: 'Precision',
            scaleLabel: {
                display: true,
                labelString: 'Precision'
            }
        }
    }
}

const legendProps = {
    alignItems: 'center'
}

export default defineComponent({
    name: 'DlScatterChartDemo',
    components: {
        DlScatterChart
    },
    data() {
        return {
            resolution: 'hour',
            options,
            data,
            brushProps,
            legendProps,
            noPointsData: {
                ...data,
                datasets: [
                    { ...data.datasets[0], pointRadius: 0, borderWidth: 1 }
                ]
            },
            tensionLineData: {
                ...data,
                datasets: [{ ...data.datasets[1], pointRadius: 0 }]
            },
            tensionOptions: { ...options, tension: 0.5 }
        }
    },
    methods: {}
})
</script>

<style scoped lang="scss"></style>
