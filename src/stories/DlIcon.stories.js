import { DlIcon } from '..'
import { colors } from '../assets/globalsKeys'

export default {
    title: 'Library/Components/DlIcon',
    component: DlIcon,
    argTypes: {
        size: {
            name: 'size',
            type: { name: 'number', required: false },
            defaultValue: 'm',
            description:
                'The size of the icon, it can be s,m,l and xl or a string',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            },
            control: {
                type: 'number'
            }
        },
        icon: {
            name: 'icon',
            type: { name: 'string', required: true },
            defaultValue: 'https://console.dataloop.ai',
            description: 'Dataloop icons - icon font class name',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'icon-dl-add' }
            },
            control: {
                type: 'text'
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: null,
            description: 'CSS Color of the icon',
            control: {
                type: 'select',
                options: colors
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        },
        svg: {
            name: 'svg',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The given icon is an SVG instead of CSS based icon',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        inline: {
            name: 'svg',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description:
                'The icon will not take the whole width of its container',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        svgSource: {
            name: 'svgSource',
            type: { name: 'string', required: false },
            defaultValue: null,
            description: 'The source of the SVG',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlIcon },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <dl-icon v-bind="args" /> 
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    color: 'dl-color-secondary',
    size: '50px',
    icon: 'icon-dl-search'
}

export const PreviewSVG = Template.bind({})
PreviewSVG.args = {
    icon: 'mastercard',
    size: '50px',
    color: 'dl-color-secondary',
    svg: true,
    svgSource: '@dataloop-ai/icons/assets'
}
