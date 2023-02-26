import { DlSkeleton } from '../'

export default {
    title: 'Library/Components/DlSkeleton',
    component: DlSkeleton,
    argTypes: {
        width: {
            name: 'width',
            type: { name: 'string', required: false },
            defaultValue: '100%',
            description: 'Width of the skeleton container',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'text'
            }
        },
        height: {
            name: 'height',
            type: { name: 'string', required: false },
            defaultValue: '100%',
            description: 'Height of the skeleton container',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'text'
            }
        },
        margin: {
            name: 'margin',
            type: { name: 'string', required: false },
            defaultValue: '0 auto',
            description: 'Margin of the skeleton container',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '0 auto' }
            },
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSkeleton },
    setup() {
        return { args }
    },
    template: '<dl-skeleton v-bind="args" />'
})

export const Preview = Template.bind({})
Preview.args = {
    width: '500px',
    height: '500px',
    margin: '0 auto'
}
