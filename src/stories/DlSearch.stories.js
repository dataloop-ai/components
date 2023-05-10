import { DlSearch } from '../components'
import { action } from '@storybook/addon-actions'
import { ref } from 'vue-demi'

const defaultSuggestions = ['foo', 'bar', 'foobar', 'foo bar']

export default {
    title: 'Library/Components/DlSearch',
    component: DlSearch,
    argTypes: {
        autoSuggestItems: {
            name: 'autoSuggestItems',
            defaultValue: defaultSuggestions,
            description:
                'An array of strings to appear as suggestions when searching',
            control: 'object',
            table: {
                type: { summary: Array },
                defaultValue: {
                    summary: defaultSuggestions
                }
            }
        },
        size: {
            name: 'size',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The size of the search bar',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        placeholder: {
            name: 'placeholder',
            type: { name: 'string', required: false },
            defaultValue: '',
            description:
                'The text to be shown as a placeholder in the search bar',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'text'
            }
        },
        withSearchButton: {
            name: 'withSearchButton',
            type: { name: 'boolean', required: false },
            defaultValue: '',
            description: 'Show a search button next to the search bar',
            table: {
                type: { summary: 'boolean' }
            },
            control: {
                type: 'boolean'
            }
        },
        highlightMatches: {
            name: 'highlightMatches',
            type: { name: 'boolean', required: false },
            defaultValue: '',
            description:
                'The parts of the suggested strings that match the text inside the search bar will be highlighted',
            table: {
                type: { summary: 'boolean' }
            },
            control: {
                type: 'boolean'
            }
        },
        suggestMenuWidth: {
            name: 'suggestMenuWidth',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The width of the suggestion menu',
            table: {
                type: { summary: 'string' }
            },
            control: {
                type: 'string'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSearch },
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
        <DlSearch
            v-model="model"
            v-bind="args"
            @focus="focus"
            @blur="blur"
            @input="input"
            @clear="clear"
            @enter="enter"
            @search-button="searchButton"
        />
    </div>
  `,
    methods: {
        focus: action('focus'),
        blur: action('blur'),
        input: action('input'),
        clear: action('clear'),
        enter: action('enter'),
        searchButton: action('searchButton')
    }
})

export const Preview = Template.bind({})
Preview.args = {
    size: 'l',
    placeholder: 'Type here...',
    withSearchButton: false,
    autoSuggestItems: defaultSuggestions,
    suggestMenuWidth: 'auto'
}
