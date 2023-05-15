import { DlEllipsis } from '..'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlEllipsis>

const meta: Meta<typeof DlEllipsis> = {
    title: 'Library/Components/DlEllipsis',
    component: DlEllipsis
}

export default meta

export const Primary: Story = {
    args: {
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,'
    }
}
