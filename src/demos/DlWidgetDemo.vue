<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlWidget,
    DlGridRow,
    DlGrid,
    DlBarChart,
    DlConfusionMatrix
} from '../components'

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

const matrix: number[][] = []
const labels: string[] = []
const size: number = 10

for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * 10))
    }
    matrix.push(row)
}

const items = ['Van', 'Truck', 'Motorcycle', 'Car', 'Bus']

for (let i = 0; i < size; i++) {
    labels.push(items[Math.floor(Math.random() * items.length)])
}

export default defineComponent({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart,
        DlGridRow,
        DlConfusionMatrix
    },
    setup() {
        return { data, labels, matrix }
    }
})
</script>

<template>
    <div>
        <dl-grid gap="20px">
            <dl-grid-row>
                <dl-widget>
                    <template #header>
                        <span>Widget 7</span>
                        <span style="font-size: 12px; color: gray">Subtitle</span>
                    </template>
                    <template #content>
                        <dl-confusion-matrix
                            :matrix="matrix"
                            :labels="labels"
                        />
                    </template>
                    <template #description>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Libero eligee a cupiditate modi dicta eveniet
                            veritatis?</span>
                    </template>
                </dl-widget>
            </dl-grid-row>

            <dl-grid-row gap="20px">
                <dl-widget>
                    <template #header>
                        <span>Widget 2</span>
                    </template>
                    <template #content>
                        <dl-bar-chart
                            :legend-props="legendProps"
                            :data="data"
                            :options="options"
                            :items-in-view="6"
                        />
                    </template>
                </dl-widget>

                <dl-widget>
                    <template #header>
                        <span>Widget 3</span>
                    </template>
                    <template #content>
                        <dl-bar-chart
                            :legend-props="legendProps"
                            :data="data"
                            :options="options"
                            :items-in-view="6"
                        />
                    </template>
                </dl-widget>
            </dl-grid-row>
        </dl-grid>
    </div>
</template>
