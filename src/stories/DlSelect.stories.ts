// DlSelect.stories.js|jsx|ts|tsx

import { DlSelect, DlChip } from '../'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue-demi'

type Story = StoryObj<typeof DlSelect>

const meta: Meta<typeof DlSelect> = {
    title: 'Library/Components/DlSelect',
    component: DlSelect
}
export default meta

export const SimpleSelect: Story = {
    args: {
        placeholder: 'Select An Option',
        width: '300px',
        options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 }
        ]
    }
}

export const DisabledSelect: Story = {
    args: {
        placeholder: 'Select An Option',
        width: '300px',
        disabled: true,
        options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 }
        ]
    }
}

export const Multiselect: Story = {
    args: {
        placeholder: 'Select An Option',
        width: '300px',
        multiselect: true,
        options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 }
        ]
    }
}

export const ErrorSelect: Story = {
    args: {
        placeholder: 'Select An Option',
        width: '300px',
        error: true,
        options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 }
        ]
    }
}

export const SelectWithoutBorders: Story = {
    args: {
        withoutBorders: true,
        width: '84px',
        alignRight: true
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlSelect, DlChip },
            props: args,
            setup() {
                const options = ref([
                    {
                        label: 'High',
                        value: 'high',
                        bgColor: 'dl-color-negative'
                    },
                    {
                        label: 'Medium',
                        value: 'medium',
                        bgColor: 'dl-color-warning',
                        textColor: 'dl-color-darker'
                    },
                    {
                        label: 'Low',
                        value: 'low',
                        bgColor: 'dl-color-positive',
                        textColor: 'dl-color-darker'
                    }
                ])
                const selectedOption = ref({
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                })

                return { options, selectedOption }
            },
            template: `<div style='padding: 50px'>
        <dl-select
          v-model="selectedOption"
          :options="[
              { label: 'High', value: 'high', bgColor: 'dl-color-negative' },
              { label: 'Medium', value: 'medium', bgColor: 'dl-color-warning', textColor: 'dl-color-darker' },
              { label: 'Low', value: 'low', bgColor: 'dl-color-positive', textColor: 'dl-color-darker' },
          ]"
          v-bind="args"
          @show="show"
          @before-show="beforeShow"
          @hide="hide"
          @before-hide="beforeHide"
          @update:model-value="updateModelValue"
        >
          <template #selected="scope">
              <dl-chip
                  :text-color="scope.opt.textColor"
                  :color="scope.opt.bgColor"
              >
                  {{ scope.opt.label }}
              </dl-chip>
          </template>
          <template #option="scope">
              <dl-chip
                  :text-color="scope.opt.textColor"
                  :color="scope.opt.bgColor"
              >
                  {{ scope.opt.label }}
              </dl-chip>
          </template>
        </dl-select>
      </div>`
        }
    }
}

export const SelectWithSearch: Story = {
    args: {
        size: 'm',
        searchable: true,
        emitValue: true,
        width: '300px',
        options: [
            { label: 'Contributor 1', value: 'c1' },
            { label: 'Contributor 2', value: 'c2' },
            { label: 'Contributor 3', value: 'c3' }
        ]
    }
}

export const SelectWithChildren: Story = {
    args: {
        size: 'm',
        multiselect: true,
        options: [
            {
                label: 'root',
                value: 'root',
                children: [
                    { label: 'child 1', value: 'c6' },
                    { label: 'child 2', value: 'c7' },
                    {
                        label: 'child 3',
                        value: 'c8',
                        children: [
                            { label: 'child 4', value: 'c9' },
                            { label: 'child 5', value: 'c10' }
                        ]
                    }
                ]
            }
        ]
    }
}

export const SelectWithFitContent: Story = {
    args: {
        size: 'm',
        multiselect: true,
        fitContent: true,
        options: [
            {
                label: 'root',
                value: 'root',
                children: [
                    { label: 'child 1', value: 'c6' },
                    { label: 'child 2', value: 'c7' },
                    {
                        label: 'child 3',
                        value: 'c8',
                        children: [
                            { label: 'child 4', value: 'c9' },
                            { label: 'child 5', value: 'c10' }
                        ]
                    }
                ]
            }
        ]
    }
}
