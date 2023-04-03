import { DlCheckbox } from '../'

export default {
    title: 'Library/Components/DlCheckbox',
    component: DlCheckbox,
    argTypes: {
        id: {
            name: 'id',
            type: { name: 'string', required: false },
            description: 'Id of the input element',
            defaultValue: '',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            description: 'Color of the checkbox',
            defaultValue: '',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        label: {
            name: 'subLabel',
            type: { name: 'string', required: false },
            description: 'The text displayed next to the checkbox',
            defaultValue: '',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        subLabel: {
            name: 'subLabel',
            type: { name: 'string', required: false },
            description: 'The text displayed below the checkbox',
            defaultValue: '',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'disabled', required: false },
            description:
                'The user will not be able to check or uncheck the checkbox',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: Boolean }
            },
            control: {
                type: 'boolean'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlCheckbox },
    setup() {
        return { args }
    },
    data() {
        return {
            model1: [1],
            model2: 'maybe'
        }
    },
    template: `
    <div>
        <dl-checkbox :value="1" v-model="model1" label="Option 1" v-bind="args"  />
        <dl-checkbox v-bind="args" indeterminate-value="maybe" toggle-indeterminate v-model="model2" label="Intermediate"  />
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {}
