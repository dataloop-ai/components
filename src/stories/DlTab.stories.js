import { DlTab } from '../'

export default {
    title: 'Library/Components/DlTab',
    component: DlTab,
    argTypes: {
        label: {
            name: 'label',
            defaultValue: 'Tab example',
            description: 'The text inside the tab label',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Tab example' }
            }
        },
        name: {
            name: 'name',
            defaultValue: 'tab',
            description: 'The name of the tab',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'tab' }
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            description: 'The tab will be disabled',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        vertical: {
            name: 'vertical',
            type: { name: 'boolean', required: false },
            description: 'The tab will have no underline',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        isActive: {
            name: 'isActive',
            type: { name: 'boolean', required: false },
            description: 'Sets the tab as active, coloring its text in blue',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        noCaps: {
            name: 'noCaps',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        showTooltip: {
            name: 'showTooltip',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            description: 'Show an info icon with a tooltip on hover',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        tooltip: {
            name: 'tooltip',
            defaultValue: 'tooltip content',
            description: 'The text shown inside tooltip on hover',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'tooltip content' }
            }
        },
        tabindex: {
            name: 'tabindex',
            defaultValue: '0',
            control: 'text',
            description: 'Tabindex HTML attribute value',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '0' }
            }
        },
        fontSize: {
            name: 'fontSize',
            defaultValue: '12px',
            control: 'text',
            description: 'The font size of the text inside the tab',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '12px' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTab },
    setup() {
        return {
            args
        }
    },
    template: `
    <div :style="{ padding: '50px', minWidth: '120px', width: 'fit-content' }">
          <dl-tab v-bind="args"   />
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
