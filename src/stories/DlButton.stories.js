// Button.stories.js|jsx|ts|tsx

import { DlButton } from '..'
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

const Template = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `<div style="padding: 50px"><DlButton @click="click" v-bind="args" /></div>`,
    methods: {
        click: action('click')
    }
})

export const Filled = Template.bind({})
Filled.args = {
    filled: true,
    label: 'Filled'
}

export const Outlined = Template.bind({})
Outlined.args = {
    outlined: true,
    label: 'Outlined'
}

export const FlatPrimary = Template.bind({})
FlatPrimary.args = {
    flat: true,
    color: 'primary',
    label: 'Flat Primary'
}

export const FlatSecondary = Template.bind({})
FlatSecondary.args = {
    flat: true,
    color: 'secondary',
    label: 'Flat Secondary'
}

export const ButtonWithIcon = Template.bind({})
ButtonWithIcon.args = {
    filled: true,
    label: 'Label',
    icon: 'icon-dl-add'
}

export const IconButton = Template.bind({})
IconButton.args = {
    filled: true,
    round: false,
    icon: 'icon-dl-dark-theme'
}

export const Fluid = Template.bind({})
Fluid.args = {
    filled: true,
    fluid: true,
    label: 'Fluid Button'
}

export const FluidWithIcon = Template.bind({})
FluidWithIcon.args = {
    outlined: true,
    fluid: true,
    label: 'Fluid Button with icon',
    icon: 'icon-dl-id'
}

export const DenseIcon = Template.bind({})
DenseIcon.args = {
    dense: true,
    icon: 'icon-dl-id',
    textColor: 'dl-color-secondary',
    color: 'white'
}
