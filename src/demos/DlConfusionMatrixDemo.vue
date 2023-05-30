<template>
    <div>
        <dl-confusion-matrix
            :matrix="matrix"
            :labels="labels"
        />

        <dl-confusion-matrix
            :matrix="matrix"
            :labels="labels"
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
        </dl-confusion-matrix>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlConfusionMatrix, DlButton } from '../components'

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
        DlConfusionMatrix,
        DlButton
    },
    setup() {
        const SIZE = 10
        const matrix = getMatrix(SIZE)
        const labels = getLabels(SIZE)

        return { matrix, labels, getLink }
    }
})
</script>
