// DlInput.stories.js|jsx|ts|tsx

import { DlInput } from '../'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue-demi'

type Story = StoryObj<typeof DlInput>

const meta: Meta<typeof DlInput> = {
    title: 'Library/Components/DlInput',
    component: DlInput
}
export default meta

export const SimpleInput: Story = {
    args: {
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
        hideClearButton: false,
        counterReverse: false,
        suggestMenuWidth: 'auto'
    }
}

export const ErrorInput: Story = {
    args: {
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
}

export const SuggestionInput: Story = {
    args: {
        suggestMenuWidth: 'auto'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlInput },
            props: args,
            setup() {
                const model = ref('')
                const autoSuggestItems = [
                    {
                        suggestion: 'suggestion1',
                        image: 'https://picsum.photos/100/100'
                    },
                    {
                        suggestion: '@suggestion',
                        image: 'https://picsum.photos/100/100'
                    },
                    {
                        suggestion: '@john-doe',
                        image: 'https://picsum.photos/100/100'
                    },
                    {
                        suggestion: '4suggestion',
                        image: 'https://picsum.photos/100/100'
                    }
                ]
                const suggestionStrings = computed(() =>
                    autoSuggestItems.map((item) => item.suggestion).join(', ')
                )
                return { args, autoSuggestItems, suggestionStrings, model }
            },
            template: `
            <div style="padding: 50px;">
            <span>Suggestions: <span style="color: gray; font-size: 12px">{{suggestionStrings}}</span></span>
                <DlInput
                    v-model="model"
                    v-bind="args"
                    style="width: 200px; padding: 0px 5px; margin-top: 10px"
                    :autoSuggestItems="autoSuggestItems"
                    @focus="focus"
                    @blur="blur"
                    @input="input"
                    @clear="clear"
                    @enter="enter"
                />
            </div>
            `
        }
    }
}
