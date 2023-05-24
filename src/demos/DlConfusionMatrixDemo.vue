<template>
    <dl-confusion-matrix
        :matrix="matrix"
        :labels="labels"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlConfusionMatrix } from '../components'

const getLink = (number: number) => {
    return `www.confusion-matrix.com/cell-${number}`
}

const getMatrix = (size: number) => {
    const newMatrix = []

    for (let i = 0; i < size; i++) {
        const row = []
        for (let j = 0; j < size; j++) {
            const value = Math.floor(Math.random() * 10)
            row.push({
                value,
                link: getLink(value)
            })
        }
        newMatrix.push(row)
    }
    return newMatrix
}

const getLabels = (size: number) => {
    const items = ['Van', 'Truck', 'Motorcycle', 'Car', 'Bus']

    // const items = [
    //     { title: 'Van', image: 'https://picsum.photos/200/200' },
    //     { title: 'Truck', image: 'https://picsum.photos/200/200' },
    //     { title: 'Motorcycle', image: 'https://picsum.photos/200/200'},
    //     { title: 'Car', image: 'https://picsum.photos/200/200'},
    //     { title: 'Bus', image: 'https://picsum.photos/200/200'}
    // ]
    const newLabels = []

    for (let i = 0; i < size; i++) {
        newLabels.push(items[Math.floor(Math.random() * items.length)])
    }

    return newLabels
}

export default defineComponent({
    components: {
        DlConfusionMatrix
    },
    setup() {
        const SIZE = 10
        const matrix = getMatrix(SIZE)
        const labels = getLabels(SIZE)

        return { matrix, labels, getLink }
    }
})
</script>
