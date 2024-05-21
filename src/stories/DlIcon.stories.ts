import { DlIcon } from '..'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlIcon>

const meta: Meta<typeof DlIcon> = {
    title: 'Library/Components/DlIcon',
    component: DlIcon
}

export default meta

export const Primary: Story = {
    args: {
        color: 'dl-color-secondary',
        size: '50px',
        icon: 'icon-dl-search'
    }
}

export const PreviewSVG: Story = {
    args: {
        icon: 'mastercard',
        size: '50px',
        color: 'dl-color-secondary',
        svg: true
    }
}
