import { ref } from 'vue-demi'
import { DlOptionGroup } from '../'
import { colors } from '../assets/globalsKeys'

const deafultOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
]

export default {
    title: 'Library/Components/DlOptionGroup',
    component: DlOptionGroup,
    argTypes: {
        inline: {
            name: 'inline',
            defaultValue: false,
            type: { name: 'boolean', default: false, required: false },
            description: 'The option group will be displayed inline'
        },
        disabled: {
            name: 'disabled',
            defaultValue: false,
            description: 'The option group will be disabled',
            type: { name: 'boolean', default: false, required: false }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            description: 'Tooltip Text Color',
            control: {
                type: 'select',
                options: colors
            }
        },
        maxWidth: {
            name: 'maxWidth',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The max width of the option group',
            control: {
                type: 'text'
            }
        },
        type: {
            name: 'type',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The type of input component to be used',
            control: {
                type: 'select',
                options: ['radio', 'checkbox', 'toggle']
            }
        },
        leftLabel: {
            name: 'leftLabel',
            type: { name: 'string', required: false },
            defaultValue: '',
            description:
                'Label (if any specified) should be displayed on the left side of the input components',
            control: {
                type: 'text',
                options: colors
            }
        },
        options: {
            name: 'options',
            type: { name: 'array', required: false },
            defaultValue: deafultOptions,
            description:
                'Array of objects with value, label, and disable (optional) props.',
            control: {
                type: 'array'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlOptionGroup },
    setup() {
        return { args }
    },
    props: {
        type: {
            type: String,
            default: 'radio'
        }
    },
    data() {
        return {
            options: deafultOptions,
            model: this.args.type === 'radio' ? ref(1) : ref([1])
        }
    },
    template: `<div style="padding: 50px"><DlOptionGroup :options="options" v-model="model" v-bind="args" /></div>`
})

export const Preview = Template.bind({})
Preview.args = {
    maxWidth: '130px'
}

const InlineTemplate = (args) => ({
    components: { DlOptionGroup },
    setup() {
        return { args }
    },
    props: {
        type: {
            type: String,
            default: 'radio'
        }
    },
    data() {
        return {
            options: deafultOptions,
            model: this.args.type === 'radio' ? ref(1) : ref([1])
        }
    },
    template: `<div style="padding: 50px">
        <DlOptionGroup 
            inline
            :options="options" 
            v-model="model" 
            v-bind="args" />
    </div>`
})

export const Inline = InlineTemplate.bind({})
Inline.args = {
    inline: true,
    maxWidth: '130px'
}

const DisabledTemplate = (args) => ({
    components: { DlOptionGroup },
    setup() {
        return { args }
    },
    props: {
        type: {
            type: String,
            default: 'radio'
        }
    },
    data() {
        return {
            options: deafultOptions,
            model: this.args.type === 'radio' ? ref(1) : ref([1])
        }
    },
    template: `<div style="padding: 50px">
        <DlOptionGroup 
            disabled
            :options="options" 
            v-model="model" 
            v-bind="args" />
    </div>`
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    disabled: true,
    maxWidth: '130px'
}
