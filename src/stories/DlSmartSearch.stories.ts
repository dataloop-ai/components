import { DlSmartSearch, DlSmartSearchInput } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue-demi'

import {
    aliases,
    schema,
    colorSchema,
    status
} from './mocks/DlSmartSearch/schema'

type Story = StoryObj<typeof DlSmartSearch>

const meta: Meta<typeof DlSmartSearch> = {
    title: 'Library/Components/DlSmartSearch',
    component: DlSmartSearch
}

export default meta

export const SmartSearch: Story = {
    args: {
        aliases,
        schema,
        colorSchema,
        status
    }
}
