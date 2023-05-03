import { DlInput, DlIcon } from '../components'
import { action } from '@storybook/addon-actions'
import { ref } from 'vue-demi'

const defaultSuggestions = ['foo', 'bar', 'foobar', 'foo bar']

export default {
    title: 'Library/Components/DlInput',
    component: DlInput,
    argTypes: {
        autoSuggestItems: {
            name: 'autoSuggestItems',
            defaultValue: defaultSuggestions,
            description: 'An array of strings to be suggested when typing',
            control: 'object',
            table: {
                type: { summary: Array },
                defaultValue: {
                    summary: defaultSuggestions
                }
            }
        },
        highlightMatches: {
            name: 'highlightMatches',
            type: { name: 'boolean', required: false },
            defaultValue: '',
            description:
                'The parts of the suggested strings that match the text inside the input will be highlighted',
            table: {
                type: { summary: 'boolean' }
            },
            control: {
                type: 'boolean'
            }
        },
        size: {
            name: 'size',
            defaultValue: null,
            description: 'The size of the textinput',
            control: 'select',
            options: ['s', 'm', 'l', 'xl'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        placeholder: {
            name: 'placeholder',
            defaultValue: null,
            description: 'The placeholder shown in the textinput',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        maxLength: {
            name: 'maxLength',
            defaultValue: 100,
            description:
                'The maximum amount of character the user will be able to type in the text input',
            control: 'number',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 100 }
            }
        },
        title: {
            name: 'title',
            defaultValue: null,
            description: 'The title shown above the textinput',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        tooltip: {
            name: 'tooltip',
            defaultValue: null,
            description:
                'The text shown in the tooltip when hovering over the info icon',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        clearButtonTooltip: {
            name: 'clearButtonTooltip',
            defaultValue: null,
            description:
                'The text shown in the tooltip when hovering over the clear text icon',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        topMessage: {
            name: 'topMessage',
            defaultValue: null,
            description: 'The message shown above the text input',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        infoMessage: {
            name: 'infoMessage',
            defaultValue: null,
            description: 'The message shown below the text input',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        errorMessage: {
            name: 'errorMessage',
            defaultValue: '',
            description:
                'The message shown below the text input when the error prop is active',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        warningMessage: {
            name: 'warningMessage',
            defaultValue: '',
            description:
                'The message shown below the text input when the warning prop is active',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        type: {
            name: 'type',
            defaultValue: null,
            description: 'The type of the text input',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        required: {
            name: 'required',
            type: { name: 'boolean', required: false },
            description: 'Mark the text input field as required',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        dense: {
            name: 'dense',
            type: { name: 'boolean', required: false },
            description: 'Remove container padding',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        error: {
            name: 'error',
            type: { name: 'boolean', required: false },
            description: 'Surround the text input field with a red outline',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        warning: {
            name: 'warning',
            type: { name: 'boolean', required: false },
            description: 'Surround the text input field with a yellow outline',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            description: 'The text input will be disabled',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        optional: {
            name: 'optional',
            defaultValue: false,
            description: 'Shows the "(Optional)" string near the title',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        redAsterisk: {
            name: 'redAsterisk',
            type: { name: 'boolean', required: false },
            description: 'It will show a red asterisk next to the input title',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disableClearBtn: {
            name: 'disableClearBtn',
            type: { name: 'boolean', required: false },
            description: 'The clear button will be disabled',
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
        counterReverse: {
            name: 'counterReverse',
            type: { name: 'boolean', required: false },
            description:
                'Make the counter show how many characters are left instead of how many have been typed',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        suggestMenuWidth: {
            name: 'suggestMenuWidth',
            defaultValue: null,
            description: 'The CSS styles for the suggestion menu',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlInput },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref('')
        }
    },
    template: `
    <div style="padding: 50px;">
        <DlInput
            v-model="model"
            v-bind="args"
            @focus="focus"
            @blur="blur"
            @input="input"
            @clear="clear"
            @enter="enter"
        />
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input'),
        clear: action('clear'),
        enter: action('enter')
    }
})

export const Preview = Template.bind({})
Preview.args = {
    size: 'l',
    placeholder: 'Type here...',
    title: 'Username',
    required: true,
    tooltip: 'Your login username',
    type: 'text',
    topMessage: 'This will be the username that you will use to log in.',
    redAsterisk: true,
    infoMessage: 'Use only alphanumeric characters.',
    errorMessage: 'This username already exists.',
    error: false,
    disabled: false,
    maxLength: 16,
    showCounter: true,
    disableClearBtn: false,
    counterReverse: false,
    suggestMenuWidth: 'auto'
}

const ErrorTemplate = (args) => ({
    components: { DlInput },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref('')
        }
    },
    template: `
    <div style="padding: 50px;">
        <DlInput
            error
            title="Username"
            topMessage="This will be the username that you will use to log in."
            placeholder="Type here..."
            errorMessage="This username already exists."
            v-model="model"
            v-bind="args"
            @focus="focus"
            @blur="blur"
            @input="input"
            @clear="clear"
            @enter="enter"
        />
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input'),
        clear: action('clear'),
        enter: action('enter')
    }
})

export const ErrorPreview = ErrorTemplate.bind({})
ErrorPreview.args = {
    error: true,
    maxLength: 16,
    type: 'text',
    size: 'l',
    title: 'Username',
    placeholder: 'Type here...',
    tooltip: 'Your login username',
    topMessage: 'This will be the username that you will use to log in.',
    infoMessage: 'Use only alphanumeric characters.',
    errorMessage: 'This username already exists.',
    suggestMenuWidth: 'auto'
}

const WarningTemplate = (args) => ({
    components: { DlInput },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref('')
        }
    },
    template: `
    <div style="padding: 50px;">
        <DlInput
            warning
            redAsterisk
            showCounter
            required
            title="Username"
            topMessage="This will be the username that you will use to log in."
            placeholder="Type here..."
            warningMessage="This username already exists."
            v-model="model"
            v-bind="args"
            @focus="focus"
            @blur="blur"
            @input="input"
            @clear="clear"
            @enter="enter"
        />
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input'),
        clear: action('clear'),
        enter: action('enter')
    }
})

export const WarningPreview = WarningTemplate.bind({})
WarningPreview.args = {
    size: 'l',
    placeholder: 'Type here...',
    title: 'Username',
    required: true,
    tooltip: 'Your login username',
    type: 'text',
    topMessage: 'This will be the username that you will use to log in.',
    redAsterisk: true,
    infoMessage: 'Use only alphanumeric characters.',
    warningMessage: 'This username already exists.',
    warning: true,
    disabled: false,
    maxLength: 16,
    showCounter: true,
    disableClearBtn: false,
    counterReverse: false,
    suggestMenuWidth: 'auto'
}

const TemplateWithIcon = (args) => ({
    components: { DlInput, DlIcon },
    setup() {
        return { args }
    },
    data() {
        return {
            model: ref('')
        }
    },
    template: `
    <div style="padding: 50px;">
        <DlInput
            v-model="model"
            v-bind="args"
            style="width: 300px; padding: 0px 5px"
            @focus="focus"
            @blur="blur"
            @input="input"
            @clear="clear"
            @enter="enter"
        >
          <template #append>
           <dl-icon
            style="margin-bottom: 5px"
            icon="icon-dl-save"
            size="12px"
           />
          </template>
          </dl-input>
        </DlInput>
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input'),
        clear: action('clear'),
        enter: action('enter')
    }
})

export const IconPreview = TemplateWithIcon.bind({})
Preview.args = {
    size: 'l',
    placeholder: 'Type here...',
    title: 'Username',
    required: true,
    tooltip: 'Your login username',
    type: 'text',
    topMessage: 'This will be the username that you will use to log in.',
    redAsterisk: true,
    infoMessage: 'Use only alphanumeric characters.',
    errorMessage: 'This username already exists.',
    error: false,
    disabled: false,
    maxLength: 16,
    showCounter: true,
    disableClearBtn: false,
    counterReverse: false,
    suggestMenuWidth: 'auto'
}
