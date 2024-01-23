import { ref } from 'vue-demi'
import { DlTabs, DlThemeProvider } from '../'

const defaultTabItems = [
    {
        label: 'One',
        name: 'one',
        showTooltip: true,
        tooltip: 'Example of a tab with tooltip'
    },
    { label: 'Two', name: 'two' },
    { label: 'Three', name: 'three' },
    { label: 'Four', name: 'four', disabled: true },
    {
        label: 'Five',
        name: 'five'
    },
    {
        label: 'Six',
        name: 'six',
        showTooltip: true,
        tooltip: 'Last element'
    }
]

export default {
    title: 'Library/Components/DlTabs',
    component: DlTabs,
    argTypes: {
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            description: 'All tabs will be disabled',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        vertical: {
            name: 'vertical',
            type: { name: 'boolean', required: false },
            description:
                'Use vertical design (tabs one on top of each other rather than one next to the other horizontally)',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        fullWidth: {
            name: 'fullWidth',
            type: { name: 'boolean', required: false },
            description: 'The tabs will take the full width of the container',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        width: {
            name: 'width',
            defaultValue: '280px',
            description: 'The width of the tabs component',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '280px' }
            }
        },
        fontSize: {
            name: 'fontSize',
            defaultValue: '14px',
            description: 'The fnot size of the text inside',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '14px' }
            }
        },
        items: {
            name: 'items',
            defaultValue: defaultTabItems,
            description:
                'An array of TabDetails objects containing all the items for the tabs',
            control: 'array',
            table: {
                type: { summary: 'array' },
                defaultValue: { summary: defaultTabItems }
            }
        },
        bordered: {
            name: 'bordered',
            defaultValue: true,
            description:
                "Boolean value used to show the bottom side border of the inactive tab's border",
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTabs, DlThemeProvider },
    setup() {
        const activeTab = ref('one')
        const tabItems = ref(defaultTabItems)
        return {
            args,
            activeTab,
            tabItems
        }
    },
    template: `
    <div :style="{ padding: '50px', width: args.width }">
      <DlThemeProvider :isDark="false">
          <dl-tabs v-bind="args" v-model="activeTab" :items="tabItems" />
      </DlThemeProvider>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
