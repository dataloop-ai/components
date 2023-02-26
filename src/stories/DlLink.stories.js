import { DlLink } from '..'
import { colors } from '../assets/globalsKeys'

export default {
    title: 'Library/Components/DlLink',
    component: DlLink,
    argTypes: {
        href: {
            name: 'href',
            type: { name: 'string', required: true },
            defaultValue: 'https://console.dataloop.ai',
            description: 'The link itself',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'text'
            }
        },
        newtab: {
            name: 'newtab',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'Open the link on click in a new tab',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'boolean'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The user will not be able to click on the link',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'boolean'
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: null,
            description: 'The color of the text',
            control: {
                type: 'select',
                options: colors
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlLink },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlLink v-bind="args"> {{args.default}} </DlLink>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    color: 'dl-color-secondary',
    default: 'Click Me'
}
