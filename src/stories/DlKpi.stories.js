import { DlKpi } from '..'

const itemsData = [
    {
        title: {
            value: 200000000,
            isAbbreviated: true
        },
        subtitle:
            'Complete Complete Complete Complete Complete Complete Complete Complete'
    },
    {
        title: {
            value: 200000000,
            isAbbreviated: false
        },
        subtitle: 'Complete',
        progress: {
            value: 30
        }
    },
    {
        title: {
            value: '154h:35m:20s',
            isAbbreviated: false
        },
        subtitle: 'Complete',
        progress: {
            value: 40,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: '154h:35m:20s',
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 50,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 60,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 70,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 80,
            text: '75/100 Items'
        }
    }
]

export default {
    title: 'Library/Components/DlKpi',
    component: DlKpi,
    argTypes: {
        items: {
            name: 'items',
            defaultValue: itemsData,
            control: 'array',
            description: 'The items data array',
            table: {
                type: { summary: Array },
                defaultValue: { summary: itemsData }
            }
        },
        titleFontSize: {
            name: 'titleFontSize',
            type: { name: 'number', required: false },
            defaultValue: 30,
            description: 'Title Font Size',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 30 }
            },
            control: {
                type: 'number'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlKpi },
    setup() {
        return { args }
    },
    template: `
    <div>
        <dl-kpi v-bind="args" />
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    items: itemsData
}
