import { DlSwitch } from '../'
import { colors } from '../assets/globalsKeys'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlSwitch',
    component: DlSwitch,
    argTypes: {
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            description: 'The color of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'dl-color-secondary' }
            },
            control: {
                type: 'select',
                options: colors
            }
        },
        size: {
            name: 'size',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The size of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        id: {
            name: 'id',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The Id of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        margin: {
            name: 'margin',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'Sets the CSS margin property of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        leftLabel: {
            name: 'leftLabel',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'A label shown on the left side of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        rightLabel: {
            name: 'rightLabel',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'A label shown on the right side of the switch',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' }
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
                type: { summary: 'text' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        value: {
            name: 'value',
            type: { name: 'object', required: false },
            defaultValue: '',
            description: 'The value contained inside the switch',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'object'
            }
        },
        trueValue: {
            name: 'trueValue',
            type: { name: 'object', required: false },
            defaultValue: '',
            description:
                'The value contained inside the switch, emitted when it is on',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'object'
            }
        },
        falseValue: {
            name: 'falseValue',
            type: { name: 'object', required: false },
            defaultValue: '',
            description:
                'The value contained inside the switch, emitted when it is off',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'object'
            }
        },
        labelProps: {
            name: 'labelProps',
            type: { name: 'object', required: false },
            defaultValue: {},
            description:
                'An object containing the CSS props for the switch label',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: {} }
            },
            control: {
                type: 'object'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The switch will be disabled',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'boolean'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSwitch },
    data() {
        return {
            value: false
        }
    },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <dl-switch v-model="value" @update:model-value="change" right-label="active switch" v-bind="args" />
            <dl-switch right-label="inactive switch" v-bind="args" disabled />
        </div>
    </div>
    `,
    methods: {
        change: action('toggled')
    }
})

export const Preview = Template.bind({})
Preview.args = {
    size: 12
}
