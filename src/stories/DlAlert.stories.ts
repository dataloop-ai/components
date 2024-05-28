import { DlAlert } from '../'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlAlert>

const meta: Meta<typeof DlAlert> = {
    title: 'Library/Components/DlAlert',
    component: DlAlert
}

export default meta

export const Info: Story = {
    args: { text: 'Alert text', type: 'info' }
}

export const Success: Story = {
    args: { text: 'Alert text', type: 'success' }
}

export const Warning: Story = {
    args: { text: 'Alert text', type: 'warning' }
}

export const Error: Story = {
    args: { text: 'Alert text', type: 'error' }
}

export const Fluid: Story = {
    args: { text: 'Alert text', type: 'info', fluid: true }
}

export const Closable: Story = {
    args: { text: 'Alert text', type: 'info', closable: true }
}
