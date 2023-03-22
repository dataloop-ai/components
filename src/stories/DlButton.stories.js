// Button.stories.js|jsx|ts|tsx

import { DlButton, DlBadge, DlIcon } from '..'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlButton',
    component: DlButton,
    argTypes: {
        filled: {
            name: 'filled',
            defaultValue: false,
            control: 'boolean',
            description:
                'The assigned color will fill the entirety of the button',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        fluid: {
            name: 'fluid',
            defaultValue: false,
            control: 'boolean',
            description:
                'The width of the button will take that of its container',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        uppercase: {
            name: 'uppercase',
            defaultValue: false,
            control: 'boolean',
            description:
                'All the characters inside the button will be uppercase',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        outlined: {
            name: 'outlined',
            control: 'boolean',
            defaultValue: false,
            description:
                'The button will be transparent with a colored outline',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        flat: {
            name: 'flat',
            control: 'boolean',
            defaultValue: false,
            description: 'The button will not have an outline',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            name: 'disabled',
            control: 'boolean',
            defaultValue: false,
            description: 'The user will not be able to press on the button',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        label: {
            name: 'label',
            control: 'text',
            defaultValue: '',
            description: 'The text content of the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        tooltip: {
            name: 'tooltip',
            control: 'text',
            defaultValue: '',
            description: 'The tooltip displayed when hovering over the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        textColor: {
            name: 'textColor',
            defaultValue: '',
            description: `The color of the button's text`,
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        },
        iconColor: {
            name: 'iconColor',
            defaultValue: '',
            description: 'The color of the icon inside the button',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        },
        color: {
            name: 'color',
            defaultValue: '',
            description: 'The color of the button',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        },
        size: {
            name: 'size',
            defaultValue: 'm',
            description: 'The size of the button, it can be s,m,l or xl',
            control: { type: 'radio', options: ['s', 'm', 'l', 'xl'] },
            table: {
                type: { summary: ['s', 'm', 'l', 'xl'] },
                defaultValue: { summary: 'm' }
            }
        },
        icon: {
            name: 'icon',
            defaultValue: '',
            description: 'The name of the icon to go inside the button',
            control: { type: 'string' },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        dense: {
            name: 'dense',
            defaultValue: false,
            description: `The button's padding is lowered and the white space shrinks`,
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        }
    }
}

const FilledTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            filled
            label="Filled"
            v-bind="args"
        />
    </div>
    `
})

export const Filled = FilledTemplate.bind({})
Filled.args = {
    filled: true,
    label: 'Filled'
}

const OutlinedTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            outlined
            label="Outlined"
            v-bind="args"
        />
    </div>
    `
})

export const Outlined = OutlinedTemplate.bind({})
Outlined.args = {
    outlined: true,
    label: 'Outlined'
}

const DisabledTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            disabled
            label="Disabled"
            v-bind="args"
        />
    </div>
    `
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    disabled: true,
    label: 'Disabled'
}

const FlatTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            flat
            label="Flat"
            v-bind="args"
        />
    </div>
    `
})

export const Flat = FlatTemplate.bind({})
Flat.args = {
    flat: true,
    label: 'Flat'
}

const WithIconTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            icon="icon-dl-add"
            v-bind="args"
        />
    </div>
    `
})
export const WithIcon = WithIconTemplate.bind({})
WithIcon.args = {
    filled: true,
    icon: 'icon-dl-add',
    label: 'With icon'
}

const RoundTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            round
            label="Round button"
            v-bind="args"
        />
    </div>
    `
})
export const Round = RoundTemplate.bind({})
Round.args = {
    filled: true,
    round: true,
    label: 'Round button'
}

const FluidTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            fluid
            label="Fluid button"
            v-bind="args"
        />
    </div>
    `
})
export const Fluid = FluidTemplate.bind({})
Fluid.args = {
    filled: true,
    fluid: true,
    label: 'Fluid button'
}

const DenseTemplate = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            dense
            label="Dense button"
            v-bind="args"
        />
    </div>
    `
})
export const Dense = DenseTemplate.bind({})
Dense.args = {
    filled: true,
    dense: true,
    label: 'Dense button'
}

const WithBadgeTemplate = (args) => ({
    components: { DlButton, DlBadge },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            label="With badge"
            v-bind="args"
        >
            <dl-badge
                with-border
                floating
                align="top"
                color="red"
            />
        </DlButton>
    </div>
    `
})
export const WithBadge = WithBadgeTemplate.bind({})
WithBadge.args = {
    label: 'With badge'
}

const WithIconAndSlotTemplate = (args) => ({
    components: { DlButton, DlBadge, DlIcon },
    setup() {
        return { args }
    },
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
    </div>
    `
})
export const WithIconAndSlot = WithIconAndSlotTemplate.bind({})
WithIconAndSlot.args = {
    icon: 'icon-dl-search'
}

const WithLabelAndSlotTemplate = (args) => ({
    components: { DlButton, DlBadge, DlIcon },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlButton
            label="Hello"
            v-bind="args"
        >
            World
        </DlButton>
    </div>
    `
})
export const WithLabelAndSlot = WithLabelAndSlotTemplate.bind({})
WithLabelAndSlot.args = {
    label: 'Hello'
}
