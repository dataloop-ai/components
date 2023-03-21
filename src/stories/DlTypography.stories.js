import { DlTypography } from '../'
import { colors } from '../assets/globalsKeys'

export default {
    title: 'Library/Components/DlTypography',
    component: DlTypography,
    argTypes: {
        uppercase: {
            name: 'uppercase',
            type: { name: 'boolean', required: false },
            description: 'Make all characters inside the typography uppercase',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        bold: {
            name: 'bold',
            type: { name: 'boolean', required: false },
            description: 'Make all characters inside the typography bold',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: null,
            description: 'CSS Color of the typography',
            control: {
                type: 'select',
                options: colors
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        },
        size: {
            name: 'size',
            type: { name: 'string', required: false },
            defaultValue: 'body',
            description: 'The size of the text inside typography',
            control: {
                type: 'select',
                options: ['h1', 'h2', 'h3', 'h4', 'body']
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'body' }
            }
        },
        variant: {
            name: 'variant',
            type: { name: 'string', required: false },
            defaultValue: 'p',
            description: 'The variant of the text inside typography',
            control: {
                type: 'select',
                options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'p' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTypography },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
        <dl-typography v-bind="args">Typography content</dl-typography>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}

const UppercaseTemplate = (args) => ({
    components: { DlTypography },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
        <dl-typography 
            uppercase
            v-bind="args"
        >
            Typography content
        </dl-typography>
    </div>
   `
})

export const Uppercase = UppercaseTemplate.bind({})
Uppercase.args = {
    uppercase: true
}

const BoldTemplate = (args) => ({
    components: { DlTypography },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
        <dl-typography 
            bold
            v-bind="args"
        >
            Typography content
        </dl-typography>
    </div>
   `
})

export const Bold = BoldTemplate.bind({})
Bold.args = {
    bold: true
}
