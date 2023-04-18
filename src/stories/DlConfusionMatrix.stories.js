import { DlConfusionMatrix } from '..'

const matrix = [
    [2, 0, 0.3, 0, 0.2, 0, 0, 0],
    [0, 5, 0, 0.6, 0, 0.1, 0, 0],
    [0, 0, 6, 0, 0, 2.5, 0, 5],
    [0, 1.7, 6, 1, 0, 0, 0, 0],
    [0, 1, 0, 8, 1, 0, 0, 0],
    [0, 0, 0, 0.5, 2, 1, 0, 0],
    [0, 2, 0, 0.1, 5, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 4]
]

const labels = [
    'Label',
    'Label',
    'Label',
    'Label',
    'Label',
    'Label',
    'Label',
    'Label'
]

export default {
    title: 'Library/Components/DlConfusionMatrix',
    component: DlConfusionMatrix,
    argTypes: {
        matrix: {
            name: 'matrix',
            control: 'array',
            defaultValue: matrix,
            description: 'The confusion matrix as a two-dimensional array',
            table: {
                type: { summary: Array },
                defaultValue: { summary: matrix }
            }
        },
        labels: {
            name: 'labels',
            control: 'array',
            defaultValue: labels,
            description: 'The labels for the confusion matrix',
            table: {
                type: { summary: Array },
                defaultValue: { summary: labels }
            }
        },
        normalized: {
            name: 'normalize',
            control: 'boolean',
            defaultValue: true,
            description:
                'The values inside the matrix will be normalized within a range from 0 to 1',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: true }
            }
        },
        color: {
            name: 'color',
            control: 'text',
            defaultValue: '--dl-color-secondary',
            description: 'The main color of the matrix',
            table: {
                type: { summary: String },
                defaultValue: { summary: '--dl-color-secondary' }
            }
        },
        leftLabel: {
            name: 'leftLabel',
            control: 'text',
            defaultValue: 'True Value',
            description: 'The label on the left of the matrix',
            table: {
                type: { summary: String },
                defaultValue: { summary: '--dl-color-secondary' }
            }
        },
        bottomLabel: {
            name: 'bottomLabel',
            control: 'text',
            defaultValue: 'Predicted Value',
            description: 'The label at the bottom of the matrix',
            table: {
                type: { summary: String },
                defaultValue: { summary: '--dl-color-secondary' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlConfusionMatrix },
    setup() {
        return { args }
    },
    template: `
       <div style="width: 800px; height: 500px">
           <dl-confusion-matrix
            v-bind="args"
           />
        </div>
        `
})

export const Preview = Template.bind({})
Preview.args = {
    matrix,
    labels
}
