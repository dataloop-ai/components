import { DlSeparator } from '../'

export default {
    title: 'Library/Components/DlSeparator',
    component: DlSeparator,
    argTypes: {
        color: {
            name: 'color',
            description: 'The color of the separator'
        },
        type: {
            name: 'type',
            description: 'Type of the separator',
            options: ['horizontal', 'vertical'],
            control: 'select'
        },
        indent: {
            name: 'indent',
            description: 'Indent of the separator'
        }
    }
}

const Template = (args) => ({
    components: { DlSeparator },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlSeparator v-bind="args" />
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
