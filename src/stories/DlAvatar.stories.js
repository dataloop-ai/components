import { DlAvatar } from '..'

export default {
    title: 'Library/Components/DlAvatar',
    component: DlAvatar,
    argTypes: {
        color: {
            name: 'color',
            description: 'The color of the avatar',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        name: {
            name: 'name',
            description:
                'The name of which the initials will be shown in the avatar',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        size: {
            name: 'size',
            description: 'The size of the avatar',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        tooltip: {
            name: 'tooltip',
            description:
                'The tooltip to be shown when hovering over the avatar',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        textColor: {
            name: 'textColor',
            description: 'The color of the text inside the avatar',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlAvatar },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlAvatar v-bind="args"> {{args.default}} </DlAvatar>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    color: 'dl-color-secondary',
    name: 'John Doe',
    size: '20px'
}
