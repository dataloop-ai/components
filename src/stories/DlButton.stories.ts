// Button.stories.js|jsx|ts|tsx

import { DlButton, DlBadge, DlMenu } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue-demi'

type Story = StoryObj<typeof DlButton>

const meta: Meta<typeof DlButton> = {
    title: 'Library/Components/DlButton',
    component: DlButton
}

export default meta

export const Filled: Story = {
    args: {
        filled: true,
        label: 'Filled'
    }
}

export const Outlined: Story = {
    args: {
        outlined: true,
        label: 'Outlined'
    }
}

export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'Disabled'
    }
}

export const Flat: Story = {
    args: {
        flat: true,
        label: 'Flat'
    }
}

export const WithIcon: Story = {
    args: {
        filled: true,
        label: 'With Icon',
        icon: 'icon-dl-add'
    }
}

export const Round: Story = {
    args: {
        round: true,
        filled: true,
        label: 'Round'
    }
}

export const Fluid: Story = {
    args: {
        fluid: true,
        filled: true,
        label: 'Fluid'
    }
}

export const Dense: Story = {
    args: {
        filled: true,
        dense: true,
        label: 'Dense'
    }
}

export const WithBadge: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlButton, DlBadge },
            props: args,
            template: ` 
            <div style="padding: 50px">
                     <DlButton
                         label="Badge"
                         v-bind="args"
                     >
                         <dl-badge
                             with-border
                             floating
                             align="top"
                             color="red"
                         />
                     </DlButton>
                 </div>`
        }
    }
}

export const WithIconAndSlot: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlButton, DlBadge },
            props: args,
            template: ` 
            <div style="padding: 50px">
                     <DlButton
                         icon="icon-dl-search"
                         v-bind="args"
                     >
                         <dl-icon
                             size="16px"
                             icon="icon-dl-cart"
                         />
                         <dl-badge
                             with-border
                             floating
                             align="top"
                             color="red"
                         />
                     </DlButton>
                 </div>`
        }
    }
}

export const WithLabelAndSlot: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlButton, DlBadge },
            props: args,
            template: ` 
            <div style="padding: 50px">
                     <DlButton
                         label="Hello"
                         v-bind="args"
                     >
                         World
                     </DlButton>
                 </div>`
        }
    }
}

export const KeepingActiveState: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlButton, DlMenu },
            props: args,
            setup() {
                const activeButtonState = ref(false)

                return { args, activeButtonState }
            },
            template: ` 
            <div
            style="
                display: flex;
                justify-content: center;
                flex-direction: column;
            "
            >
            <h3>Button keeping its active state with menu</h3>
            <dl-button
                :active="activeButtonState"
                @click="activeButtonState = !activeButtonState"
                >{{ activeButtonState ? 'Close' : 'Open' }}
                <dl-menu
                    :offset="[0, 5]"
                    anchor="bottom middle"
                    self="top middle"
                >
                    <div
                        style="width: 100px; height: 100px; text-align: center"
                    >
                        Menu
                    </div>
                </dl-menu>
            </dl-button>
           </div>`
        }
    }
}
