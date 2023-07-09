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
        labelColor: 'blue',
        hint: 'info'
    }
}

export const WithSlot: Story = {
    args: {
        text: 'dl-label',
        labelColor: 'blue',
        hint: 'info'
    },
    render: (args) => {
        return {
            components: { DlLabel, DlIcon },
            setup() {
                return { args }
            },
            template: ` 
               <div>
                <dl-label v-bind="args">
                 <template #suffix>
                  <dl-icon icon="icon-dl-info"/>
                  <dl-icon icon="icon-dl-info"/>
                 </template>
                </dl-label>
               </div>
            `
        }
    }
}
