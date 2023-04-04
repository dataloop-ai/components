<template>
    <dl-confusion-matrix
        :matrix="matrix"
        :labels="labels"
        :get-link="getLink"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlConfusionMatrix from '../components/compound/DlCharts/charts/DlConfusionMatrix/DlConfusionMatrix.vue'
import { MatrixCell } from '../components/compound/DlCharts/charts/DlConfusionMatrix/types'
export default defineComponent({
    components: {
        DlConfusionMatrix
    },
    setup() {
        const matrix = []
        const labels = []
        const size = 10

        for (let i = 0; i < size; i++) {
            const row = []
            for (let j = 0; j < size; j++) {
                row.push(Math.floor(Math.random() * 10))
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

        const getLink = (cell: MatrixCell) => {
            return `www.confusion-matrix.com/cell-${cell.xLabel}-${cell.yLabel}-${cell.value}`
        }

        return { matrix, labels, getLink }
    }
})
</script>
