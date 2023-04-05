import { DlKpi } from '..'
import { DlKpiCounterFormat } from '../components/types'

const counterData = {
    value: 200000,
    format: DlKpiCounterFormat.long
}
const progressData = {
    value: 40,
    text: '75/100 Items'
}

export default {
    title: 'Library/Components/DlKpi',
    component: DlKpi,
    argTypes: {
        counter: {
            name: 'counter',
            defaultValue: counterData,
            control: 'object',
            description: 'The counter object',
            table: {
                type: { summary: Object },
                defaultValue: { summary: counterData }
            }
        },
        titleFontSize: {
            name: 'titleFontSize',
            type: { name: 'string', required: false },
            defaultValue: '16px',
            description: 'Title Font Size',
            table: {
                type: {
                    name: 'string',
                    required: false,
                    default: '16px'
                },
                defaultValue: { summary: '16px' }
            },
            control: {
                type: 'text'
            }
        },
        counterFontSize: {
            name: 'counterFontSize',
            type: { name: 'string', required: false },
            defaultValue: '1.88em',
            description: 'Title Font Size',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '1.88em' }
            },
            control: {
                type: 'text'
            }
        },
        title: {
            name: 'title',
            type: { name: 'string', required: false },
            defaultValue: 'Completed',
            description: 'Title',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Completed' }
            },
            control: {
                type: 'text'
            }
        },
        subtitle: {
            name: 'subtitle',
            type: { name: 'string', required: false },
            defaultValue: 'Sub title',
            description: 'Subtitle',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Sub title' }
            },
            control: {
                type: 'text'
            }
        },
        subtitleFontSize: {
            name: 'subtitleFontSize',
            type: { name: 'string', required: false },
            defaultValue: '12px',
            description: 'subtitle FontSize',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '12px' }
            },
            control: {
                type: 'text'
            }
        },
        infoMessage: {
            name: 'infoMessage',
            type: { name: 'string', required: false },
            defaultValue: 'No data',
            description: 'infoMessage',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '12px' }
            },
            control: {
                type: 'text'
            }
        },
        progress: {
            name: 'progress',
            defaultValue: progressData,
            control: 'object',
            description: 'The progress object',
            table: {
                type: { summary: Object },
                defaultValue: { summary: progressData }
            }
        },
        bordered: {
            name: 'bordered',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'bordered',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        small: {
            name: 'small',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'small',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
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
    counter: counterData,
    progress: progressData,
    title: 'Completed'
}
