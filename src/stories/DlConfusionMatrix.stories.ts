import { DlConfusionMatrix } from '..'
import {
    DlConfusionMatrixCell,
    DlConfusionMatrixLabel
} from '../components/compound/DlCharts/types'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlConfusionMatrix>

const meta: Meta<typeof DlConfusionMatrix> = {
    title: 'Library/Components/DlConfusionMatrix',
    component: DlConfusionMatrix
}

const getLink = (number: number) => {
    return `www.confusion-matrix.com/cell-${number}`
}

const getMatrix = (size: number) => {
    const newMatrix: DlConfusionMatrixCell[][] = []

    for (let i = 0; i < size; i++) {
        const row: DlConfusionMatrix[] = []
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

const getLabels = (size: number, type: string) => {
    let items: (string | DlConfusionMatrixLabel)[] = []
    if (type === 'avatar') {
        items = [
            { title: 'Van', image: 'https://picsum.photos/200/200' },
            { title: 'Truck', image: 'https://picsum.photos/200/200' },
            { title: 'Motorcycle', image: 'https://picsum.photos/200/200' },
            { title: 'Car', image: 'https://picsum.photos/200/200' },
            { title: 'Bus', image: 'https://picsum.photos/200/200' }
        ]
    } else {
        items = ['Van', 'Truck', 'Motorcycle', 'Car', 'Bus']
    }

    const newLabels: (string | DlConfusionMatrixLabel)[] = []

    for (let i = 0; i < size; i++) {
        newLabels.push(items[Math.floor(Math.random() * items.length)])
    }

    return newLabels
}

export default meta

export const WithStringLabels: Story = {
    args: {
        matrix: getMatrix(10),
        labels: getLabels(10, 'string')
    }
}

export const WithAvatars: Story = {
    args: {
        matrix: getMatrix(10),
        labels: getLabels(10, 'avatar')
    }
}

export const WithManyLabels: Story = {
    args: {
        matrix: getMatrix(30),
        labels: getLabels(30, 'string')
    }
}
