import { DlSmartSearchInput } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue-demi'

import {
    aliases,
    schema,
    colorSchema,
    status
} from './mocks/DlSmartSearch/schema'

type Story = StoryObj<typeof DlSmartSearchInput>

const meta: Meta<typeof DlSmartSearchInput> = {
    title: 'Library/Components/DlSmartSearchInput',
    component: DlSmartSearchInput
}

export default meta

export const SmartSearchInput: Story = {
    args: {
        aliases,
        schema,
        colorSchema,
        status
    }
}
