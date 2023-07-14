<template>
    <div>
        <dl-accordion title="Matrix">
            <dl-confusion-matrix
                :matrix="matrix"
                :labels="labels"
            />
        </dl-accordion>
        <dl-accordion title="one label matrix">
            <dl-confusion-matrix
                :matrix="oneLabelMatrix"
                :labels="oneLabelLabels"
            />
        </dl-accordion>
        <dl-accordion title="two label matrix">
            <dl-confusion-matrix
                :matrix="twoLabelMatrix"
                :labels="twoLabelLabels"
            />
        </dl-accordion>
        <dl-accordion title="a hundred label matrix">
            <dl-confusion-matrix
                :matrix="aHundredLabelMatrix"
                :labels="aHundredLabelLabels"
            />
        </dl-accordion>
        <dl-accordion title="empty state">
            <dl-confusion-matrix
                :matrix="matrix"
                :labels="labels"
                is-empty
                :empty-state-props="{
                    responsive: true,
                    style: 'min-height: 350px;',
                    bgSize: '130px',
                    bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
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
        </dl-accordion>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlConfusionMatrix, DlButton, DlAccordion } from '../components'
import { DlConfusionMatrixCell } from '../types'

const getLink = (number: number) => {
    return `www.confusion-matrix.com/cell-${number}`
}

const getMatrix = (size: number) => {
    const newMatrix: DlConfusionMatrixCell[][] = []

    for (let i = 0; i < size; i++) {
        const row: DlConfusionMatrixCell[] = []
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
        DlButton,
        DlAccordion
    },
    setup() {
        const SIZE = 10
        const matrix = getMatrix(SIZE)
        const labels = getLabels(SIZE)

        const oneLabelMatrix = getMatrix(1)
        const oneLabelLabels = getLabels(1)

        const twoLabelMatrix = getMatrix(2)
        const twoLabelLabels = getLabels(2)

        const aHundredLabelMatrix = getMatrix(100)
        const aHundredLabelLabels = getLabels(100)

        return {
            matrix,
            labels,
            getLink,
            oneLabelMatrix,
            oneLabelLabels,
            aHundredLabelMatrix,
            aHundredLabelLabels,
            twoLabelMatrix,
            twoLabelLabels
        }
    }
})
</script>
