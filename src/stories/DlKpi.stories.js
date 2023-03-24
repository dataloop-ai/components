import { DlKpi } from '..'
import { EFormat } from '../components/DlKpi/types/KpiItem'

const itemsData = [
    {
        counter: {
            value: '154h:35m:20s',
            format: EFormat.hms
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete'
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: EFormat.hm
        },
        title: 'Complete',
        progress: {
            value: 30
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: EFormat.h
        },
        title: 'Complete',
        progress: {
            value: 40,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: EFormat.ms
        },
        title: 'Complete',
        progress: {
            value: 50,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: 200000000,
            format: EFormat.long
        },
        title: 'Complete',
        progress: {
            value: 60,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: 200000000,
            format: EFormat.short
        },
        title: 'Complete',
        progress: {
            value: 70,
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
