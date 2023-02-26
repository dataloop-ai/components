import { DlTextArea } from '../components'
import { action } from '@storybook/addon-actions'
import { ref } from 'vue-demi'

export default {
    title: 'Library/Components/DlTextArea',
    component: DlTextArea,
    argTypes: {
        maxLength: {
            name: 'maxLength',
            type: { name: 'number', required: false },
            description:
                'The maximum amount of characters the user can type in the textarea',
            control: 'number',
            defaultValue: 200,
            table: {
                type: { summary: Number },
                defaultValue: { summary: 200 }
            }
        },
        placeholder: {
            name: 'placeholder',
            type: { name: 'string', required: false },
            description: 'The placeholder shown in the textarea',
            control: 'text',
            defaultValue: 'Type something...',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        width: {
            name: 'width',
            type: { name: 'string', required: false },
            description: 'The width of the the textarea',
            control: 'text',
            defaultValue: '',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            description: 'The textarea will be disabled',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        showCounter: {
            name: 'showCounter',
            type: { name: 'boolean', required: false },
            description:
                'Show how many characters have been typed out of the maximum amount',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        enableResize: {
            name: 'enableResize',
            type: { name: 'boolean', required: false },
            description: 'Allow the user to resize the textarea',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTextArea },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref('Sample Text')
        }
    },
    template: `
    <div style="padding: 50px;">
        <DlTextArea v-model="model" v-bind="args" @focus="focus" @blur="blur" @input="input" />
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input')
    }
})

export const Preview = Template.bind({})
Preview.args = {
    maxLength: null,
    disabled: false,
    placeholder: 'Placeholder',
    showCounter: false,
    enableResize: false
}
