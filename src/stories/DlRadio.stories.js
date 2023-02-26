import { ref } from 'vue-demi'
import { DlRadio } from '../'

export default {
    title: 'Library/Components/DlRadio',
    component: DlRadio,
    argTypes: {
        id: {
            name: 'id',
            type: { name: 'string', required: false },
            description: 'Id of the input element',
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
            defaultValue: '',
            description: 'The color of the radio buttons',
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'color'
            }
        },
        label: {
            name: 'label',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'Label to display along the radio control ',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        padding: {
            name: 'padding',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The padding of the radio button',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        value: {
            name: 'value',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The value contained by the radio button',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        tabindex: {
            name: 'tabindex',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'Tabindex HTML attribute value',
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
            defaultValue: '',
            description: 'Some text shown below the label',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        subLabelSize: {
            name: 'subLabelSize',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The size of the subLabel',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The radio buttons will be disabled',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            },
            control: 'boolean'
        }
    }
}

const Template = (args) => ({
    components: { DlRadio },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref(1)
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-radio v-bind="args" :value="1" v-model="model" label="Option 1" />
        <dl-radio v-bind="args" :value="2" v-model="model" label="Option 2" />
        <dl-radio v-bind="args" :value="3" v-model="model" label="Option 3" />
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
