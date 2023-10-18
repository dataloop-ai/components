import { DlLabelPicker } from '..'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlLabelPicker>

const meta: Meta<typeof DlLabelPicker> = {
    title: 'Library/Components/DlLabelPicker',
    component: DlLabelPicker
}

export default meta

export const Primary: Story = {
    args: {
        items: [
            {
                identifier: 'a',
                displayLabel: 'Frozen Yogurt',
                color: '#ff0000',
                children: [
                    {
                        identifier: 'b',
                        displayLabel: 'hello',
                        color: '#ffff00'
                    }
                ]
            },
            {
                identifier: 'c',
                displayLabel: 'test 2',
                color: '#00ff00',
                children: []
            },
            {
                identifier: 'd',
                displayLabel: 'test 3',
                color: '#ff00ff',
                children: []
            }
        ]
    }
}
