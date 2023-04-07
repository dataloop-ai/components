import { DlEllipsis } from '..'

export default {
    title: 'Library/Components/DlEllipsis',
    component: DlEllipsis,
    argTypes: {
        text: {
            name: 'text',
            description: 'The text',
            type: { name: 'string', required: true, default: null },
            control: {
                type: 'text'
            }
        },
        middleEllipsis: {
            name: 'middleEllipsis',
            description: 'middleEllipsis',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        tooltip: {
            name: 'tooltip',
            description: 'The tooltip of the text',
            type: { name: 'boolean', required: false, default: true },
            control: {
                type: 'boolean'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlEllipsis },
    setup() {
        return { args }
    },
    template: `
    <div style="white-space: nowrap; width: 70%;">
        <DlEllipsis v-bind="args" />
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,'
}
