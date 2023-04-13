<template>
    <dl-confusion-matrix
        :matrix="matrix"
        :labels="labels"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlConfusionMatrix from '../components/compound/DlCharts/charts/DlConfusionMatrix/DlConfusionMatrix.vue'
import { DlConfusionMatrixCell } from '../components/compound/DlCharts/charts/DlConfusionMatrix/types'
export default defineComponent({
    components: {
        DlConfusionMatrix
    },
    setup() {
        const matrix = []
        const labels = []
        const size = 10

        const getLink = (number: number) => {
            return `www.confusion-matrix.com/cell-${number}`
        }

        for (let i = 0; i < size; i++) {
            const row = []
            for (let j = 0; j < size; j++) {
                const value = Math.floor(Math.random() * 10)
                row.push({
                    value,
                    link: getLink(value)
                })
            }
            matrix.push(row)
        }

        // const items = [
        //     { title: 'Van', image: 'https://picsum.photos/200/200' },
        //     { title: 'Truck', image: 'https://picsum.photos/200/200' },
        //     { title: 'Motorcycle', image: 'https://picsum.photos/200/200'},
        //     { title: 'Car', image: 'https://picsum.photos/200/200'},
        //     { title: 'Bus', image: 'https://picsum.photos/200/200'}
        // ]

        const items = ['Van', 'Truck', 'Motorcycle', 'Car', 'Bus']

        for (let i = 0; i < size; i++) {
            labels.push(items[Math.floor(Math.random() * items.length)])
        }

        return { matrix, labels, getLink }
    }
})
</script>
