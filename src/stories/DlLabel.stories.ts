import { DlLabel, DlIcon } from '..'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlLabel>

const meta: Meta<typeof DlLabel> = {
    title: 'Library/Components/DlLabel',
    component: DlLabel
}

export default meta

export const Primary: Story = {
    args: {
        text: 'dl-label',
        labelColor: 'blue'
    }
}

export const WithActions: Story = {
    args: {
        text: 'dl-label',
        labelColor: 'blue',
        actions: 'Actions'
    }
}

export const WithHint: Story = {
    args: {
        text: 'dl-label',
        labelColor: 'blue',
        hint: 'Hi there!'
    }
}

export const WithHintAndActions: Story = {
    args: {
        text: 'dl-label',
        labelColor: 'blue',
        hint: 'Hi there!',
        actions: 'Actions'
    }
}
