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
            :empty-state-props="{
                responsive: true,
                style: 'min-height: 350px;',
                bgSize: '130px',
                bgImage: `url(./src/demos/assets/agenda.svg)`,
                title: 'Lorem ipsum',
                subtitle:
                    'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                info: 'To learn more about this analytics, read our documentation.'
            }"
        >
            <template #links="">
                <div style="display: flex; gap: 5px; padding: 0 20px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </dl-bar-chart>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { ChartOptions } from 'chart.js'
import { DlBarChart, DlButton } from '../components'

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
        DlBarChart,
        DlButton
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
