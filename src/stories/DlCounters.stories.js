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
            description: 'The counters will be smaller',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
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
