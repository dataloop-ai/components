import { DlTrend } from '../'

export default {
    title: 'Library/Components/DlTrend',
    component: DlTrend,
    argTypes: {
        value: {
            name: 'value',
            defaultValue: 0,
            description: 'The value shown in the trend',
            control: {
                type: 'number',
                min: 0
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        direction: {
            name: 'direction',
            defaultValue: 'up',
            description: 'The direction the arrow points toward',
            control: { type: 'select' },
            options: ['up', 'down']
        },
        color: {
            name: 'color',
            defaultValue: null,
            description: 'The color of the arrow icon',
            control: { type: 'select' },
            options: ['positive', 'negative', null]
        }
    }
}

const Template = (args) => ({
    components: { DlTrend },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
        <dl-trend v-bind="args"/>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    value: 25,
    direction: 'up'
}
