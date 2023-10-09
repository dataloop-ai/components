import { DlCounters } from '../components'

const defaultValue = [
    {
        value: 123,
        text: 'lorem ipsum'
    },
    {
        value: 45,
        text: 'ipsum lorem',
        subtext:
            'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.'
    },
    {
        value: 6789,
        text: 'lorem lorem ipsum',
        subtext: 'Minim exercitation ipsum elit cillum magna.'
    }
]

const formattedValuesItems = [
    {
        value: 100000000,
        text: 'lorem',
        format: 'short',
        infoMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
        value: '154h:35m:20s',
        text: 'ipsum lorem',
        subtext:
            'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.',
        format: 'hms',
        infoMessage: '154h:35m:20s'
    },
    {
        value: 6789,
        text: 'lorem lorem ipsum',
        subtext: 'Minim exercitation ipsum elit cillum magna.',
        format: 'short',
        infoMessage: '6789'
    }
]

export default {
    title: 'Library/Components/DlCounters',
    component: DlCounters,
    argTypes: {
        items: {
            name: 'items',
            defaultValue,
            control: 'object',
            description: 'Items to show counters for.',
            table: {
                type: { summary: Array },
                defaultValue: {
                    summary: defaultValue
                }
            }
        },
        small: {
            name: 'small',
            control: 'boolean',
            defaultValue: false,
            description: 'The counters will be smaller.',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        spacing: {
            name: 'spacing',
            type: { name: 'string', required: false },
            defaultValue: '30px',
            description: "The spacing between the kpi's.",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '30px' }
            },
            control: {
                type: 'text'
            }
        },
        titleFontSize: {
            name: 'titleFontSize',
            type: { name: 'string', required: false },
            defaultValue: '16px',
            description: 'The kpi title font size',
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
            defaultValue: '30px',
            description: 'The kpi counter font size',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '30px' }
            },
            control: {
                type: 'text'
            }
        },
        subtitleFontSize: {
            name: 'subtitleFontSize',
            type: { name: 'string', required: false },
            defaultValue: '12px',
            description: 'The kpi subtitle font size',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '12px' }
            },
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlCounters },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <DlCounters v-bind="args" />
    </div>
  `
})

export const Preview = Template.bind({})
Preview.args = {
    small: false,
    items: defaultValue
}

const SmallTemplate = (args) => ({
    components: { DlCounters },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <DlCounters
            small
            v-bind="args" 
        />
    </div>
  `
})

export const Small = SmallTemplate.bind({})
Small.args = {
    small: true,
    items: defaultValue
}

const FormattedValuesTemplate = (args) => ({
    components: { DlCounters },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <DlCounters
            small
            v-bind="args" 
        />
    </div>
  `
})

export const FormattedValues = FormattedValuesTemplate.bind({})
FormattedValues.args = {
    small: true,
    items: formattedValuesItems
}
