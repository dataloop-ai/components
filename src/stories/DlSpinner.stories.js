import { DlSpinner } from '../'

export default {
    title: 'Library/Components/DlSpinner',
    component: DlSpinner,
    argTypes: {
        text: {
            name: 'text',
            defaultValue: 'Loading data, please wait...',
            description: 'The text that goes below the spinner',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        textStyles: {
            name: 'textStyles',
            defaultValue: { marginLeft: '-40px', marginTop: '20px' },
            description: 'An object containing the styles for the text wrapper',
            control: 'object',
            table: {
                type: { summary: Object }
            }
        },
        size: {
            name: 'size',
            defaultValue: '140px',
            description: 'The size of the spinner itself',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        iconSize: {
            name: 'iconSize',
            defaultValue: '50px',
            description: 'The size of the dataloop icon',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        borderColor: {
            name: 'borderColor',
            defaultValue: 'var(--dl-color-separator)',
            description: "The color of the spinner's circle",
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        color: {
            name: 'color',
            defaultValue: 'var(--dl-color-secondary)',
            description: 'The color of the spinning border',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        iconColor: {
            name: 'iconColor',
            defaultValue: 'var(--dl-color-tooltip-background)',
            description: 'The color of the dataloop icon',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        rotationSpeed: {
            name: 'rotationSpeed',
            defaultValue: '2s',
            description: 'The speed the spinner rotates at',
            control: 'text',
            table: {
                type: { summary: String }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSpinner },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="margin-left: 30vw;">
     <dl-spinner v-bind="args"/>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
