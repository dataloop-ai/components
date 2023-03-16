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

const FiledSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Filled'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            color="dl-color-secondary"
            @click="click" 
            v-bind="args"
        />
    </div>`,
    methods: {
        click: action('click')
    }
})

export const FilledSmall = FiledSmallTemplate.bind({})
FilledSmall.args = {
    filled: true,
    label: 'Filled',
    size: 's'
}

const FiledMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Filled medium'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            color="dl-color-secondary"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})

export const FilledMedium = FiledMediumTemplate.bind({})
FilledMedium.args = {
    filled: true,
    label: 'Filled medium',
    size: 'm'
}

const FiledLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Filled large'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            color="dl-color-secondary"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})

export const FilledLarge = FiledLargeTemplate.bind({})
FilledLarge.args = {
    filled: true,
    label: 'Filled large',
    size: 'l'
}

const FiledXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Filled XL'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            color="dl-color-secondary"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})

export const FilledXL = FiledXlTemplate.bind({})
FilledXL.args = {
    filled: true,
    label: 'Filled XL',
    size: 'xl'
}

const OutlinedSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Outlined small'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const OutlinedSmall = OutlinedSmallTemplate.bind({})
OutlinedSmall.args = {
    outlined: true,
    label: 'Outlined small',
    size: 's'
}

const OutlinedMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Outlined medium'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const OutlinedMedium = OutlinedMediumTemplate.bind({})
OutlinedMedium.args = {
    outlined: true,
    label: 'Outlined medium',
    size: 'm'
}

const OutlinedLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Outlined large'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const OutlinedLarge = OutlinedLargeTemplate.bind({})
OutlinedLarge.args = {
    outlined: true,
    label: 'Outlined large',
    size: 'l'
}

const OutlinedXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Outlined xl'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const OutlinedXL = OutlinedXlTemplate.bind({})
OutlinedXL.args = {
    outlined: true,
    label: 'Outlined XL',
    size: 'xl'
}

const FlatPrimarySmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Flat primary small',
            color: 'primary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatPrimarySmall = FlatPrimarySmallTemplate.bind({})
FlatPrimarySmall.args = {
    flat: true,
    color: 'primary',
    label: 'Flat Primary Small'
}

const FlatPrimaryMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Flat primary medium',
            color: 'primary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatPrimaryMedium = FlatPrimaryMediumTemplate.bind({})
FlatPrimaryMedium.args = {
    flat: true,
    color: 'primary',
    size: 'm',
    label: 'Flat Primary medium'
}

const FlatPrimaryLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Flat primary large',
            color: 'primary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatPrimaryLarge = FlatPrimaryLargeTemplate.bind({})
FlatPrimaryLarge.args = {
    flat: true,
    color: 'primary',
    size: 'l',
    label: 'Flat Primary medium'
}

const FlatPrimaryXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Flat primary XL',
            color: 'primary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatPrimaryXl = FlatPrimaryXlTemplate.bind({})
FlatPrimaryXl.args = {
    flat: true,
    color: 'primary',
    size: 'xl',
    label: 'Flat Primary XL'
}

const FlatSecondarySmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Flat Secondary Small',
            color: 'secondary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatSecondarySmall = Template.bind({})
FlatSecondarySmall.args = {
    flat: true,
    size: 's',
    color: 'secondary',
    label: 'Flat Secondary Small'
}

const FlatSecondaryMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Flat Secondary Medium',
            color: 'secondary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatSecondaryMedium = FlatSecondaryMediumTemplate.bind({})
FlatSecondaryMedium.args = {
    flat: true,
    size: 'm',
    color: 'secondary',
    label: 'Flat Secondary Medium'
}

const FlatSecondaryLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Flat Secondary Large',
            color: 'secondary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatSecondaryLarge = FlatSecondaryLargeTemplate.bind({})
FlatSecondaryLarge.args = {
    flat: true,
    size: 'l',
    color: 'secondary',
    label: 'Flat Secondary Large'
}

const FlatSecondaryXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Flat Secondary XL',
            color: 'secondary'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            :color="button.color"
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatSecondaryXl = FlatSecondaryXlTemplate.bind({})
FlatSecondaryXl.args = {
    flat: true,
    size: 'xl',
    color: 'secondary',
    label: 'Flat Secondary XL'
}

const FlatDisabledSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Flat Disabled Small'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatDisabledSmall = FlatDisabledSmallTemplate.bind({})
FlatDisabledSmall.args = {
    flat: true,
    disabled: true,
    size: 's',
    label: 'Flat Disabled Small'
}

const FlatDisabledMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Flat Disabled Medium'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatDisabledMedium = FlatDisabledMediumTemplate.bind({})
FlatDisabledMedium.args = {
    flat: true,
    disabled: true,
    size: 'm',
    label: 'Flat Disabled Medium'
}

const FlatDisabledLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Flat Disabled Large'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatDisabledLarge = FlatDisabledLargeTemplate.bind({})
FlatDisabledLarge.args = {
    flat: true,
    disabled: true,
    size: 'l',
    label: 'Flat Disabled Large'
}

const FlatDisabledXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Flat Disabled XL'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            flat
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FlatDisabledXl = FlatDisabledXlTemplate.bind({})
FlatDisabledXl.args = {
    flat: true,
    disabled: true,
    size: 'xl',
    label: 'Flat Disabled XL'
}

const DisabledSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Disabled Small'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DisabledSmall = DisabledSmallTemplate.bind({})
DisabledSmall.args = {
    disabled: true,
    size: 's',
    label: 'Disabled Small'
}

const DisabledMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Disabled Medium'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DisabledMedium = DisabledMediumTemplate.bind({})
DisabledMedium.args = {
    disabled: true,
    size: 'm',
    label: 'Disabled Medium'
}

const DisabledLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Disabled Large'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DisabledLarge = DisabledLargeTemplate.bind({})
DisabledMedium.args = {
    disabled: true,
    size: 'l',
    label: 'Disabled Large'
}

const DisabledXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Disabled XL'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            disabled
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DisabledXl = DisabledXlTemplate.bind({})
DisabledXl.args = {
    disabled: true,
    size: 'xl',
    label: 'Disabled XL'
}

const WithIconSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'With icon small',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const WithIconSmall = WithIconSmallTemplate.bind({})
WithIconSmall.args = {
    size: 's',
    label: 'With icon small',
    icon: 'icon-dl-add'
}

const WithIconMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'With icon medium',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const WithIconMedium = WithIconMediumTemplate.bind({})
WithIconMedium.args = {
    size: 'm',
    label: 'With icon medium',
    icon: 'icon-dl-add'
}

const WithIconLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'With icon large',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const WithIconLarge = WithIconLargeTemplate.bind({})
WithIconLarge.args = {
    size: 'l',
    label: 'With icon large',
    icon: 'icon-dl-add'
}

const WithIconXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'With icon XL',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const WithIconXl = WithIconXlTemplate.bind({})
WithIconXl.args = {
    size: 'xl',
    label: 'With icon XL',
    icon: 'icon-dl-add'
}

const IconButtonSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            icon: 'icon-dl-dark-theme'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonSmall = IconButtonSmallTemplate.bind({})
IconButtonSmall.args = {
    filled: true,
    icon: 'icon-dl-dark-theme'
}

const IconButtonMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            icon: 'icon-dl-dark-theme'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonMedium = IconButtonMediumTemplate.bind({})
IconButtonMedium.args = {
    filled: true,
    size: 'm',
    icon: 'icon-dl-dark-theme'
}

const IconButtonLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            icon: 'icon-dl-dark-theme'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonLarge = IconButtonLargeTemplate.bind({})
IconButtonLarge.args = {
    filled: true,
    size: 'l',
    icon: 'icon-dl-dark-theme'
}

const IconButtonXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            icon: 'icon-dl-dark-theme'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonXl = IconButtonXlTemplate.bind({})
IconButtonXl.args = {
    filled: true,
    size: 'xl',
    icon: 'icon-dl-dark-theme'
}

const IconButtonRoundSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            round
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonRoundSmall = IconButtonRoundSmallTemplate.bind({})
IconButtonRoundSmall.args = {
    filled: true,
    round: true,
    size: 's',
    icon: 'icon-dl-add'
}

const IconButtonRoundMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            round
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonRoundMedium = IconButtonRoundMediumTemplate.bind({})
IconButtonRoundMedium.args = {
    filled: true,
    round: true,
    size: 'm',
    icon: 'icon-dl-add'
}

const IconButtonRoundLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            round
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonRoundLarge = IconButtonRoundLargeTemplate.bind({})
IconButtonRoundLarge.args = {
    filled: true,
    round: true,
    size: 'l',
    icon: 'icon-dl-add'
}

const IconButtonRoundXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            icon: 'icon-dl-add'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            round
            :size="button.size"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const IconButtonRoundXl = IconButtonRoundXlTemplate.bind({})
IconButtonRoundXl.args = {
    filled: true,
    round: true,
    size: 'xl',
    icon: 'icon-dl-add'
}

const FluidSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Fluid small'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            fluid
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidSmall = FluidSmallTemplate.bind({})
FluidSmall.args = {
    filled: true,
    fluid: true,
    size: 's',
    label: 'Fluid Button'
}

const FluidMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Fluid medium'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            fluid
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidMedium = FluidMediumTemplate.bind({})
FluidMedium.args = {
    filled: true,
    fluid: true,
    size: 'm',
    label: 'Fluid Button'
}

const FluidLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Fluid large'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            fluid
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidLarge = FluidLargeTemplate.bind({})

const FluidXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Fluid XL'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            filled
            fluid
            :size="button.size"
            :label="button.label"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidXl = FluidXlTemplate.bind({})

const FluidWithIconSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            label: 'Fluid with icon small',
            icon: 'icon-dl-id'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            fluid
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidWithIconSmall = FluidWithIconSmallTemplate.bind({})

const FluidWithIconMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            label: 'Fluid with icon medium',
            icon: 'icon-dl-id'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            fluid
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidWithIconMedium = FluidWithIconMediumTemplate.bind({})

const FluidWithIconLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            label: 'Fluid with icon large',
            icon: 'icon-dl-id'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            fluid
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidWithIconLarge = FluidWithIconLargeTemplate.bind({})

const FluidWithIconXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            label: 'Fluid with icon XL',
            icon: 'icon-dl-id'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            outlined
            fluid
            :size="button.size"
            :label="button.label"
            :icon="button.icon"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const FluidWithIconXl = FluidWithIconXlTemplate.bind({})

const DenseIconSmallTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 's',
            icon: 'icon-dl-id',
            textColor: 'dl-color-secondary',
            color: 'white'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            dense
            :size="button.size"
            :icon="button.icon"
            :textColor="button.textColor"
            :color="button.color"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DenseIconSmall = DenseIconSmallTemplate.bind({})

const DenseIconMediumTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'm',
            icon: 'icon-dl-id',
            textColor: 'dl-color-secondary',
            color: 'white'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            dense
            :size="button.size"
            :icon="button.icon"
            :textColor="button.textColor"
            :color="button.color"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DenseIconMedium = DenseIconMediumTemplate.bind({})

const DenseIconLargeTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'l',
            icon: 'icon-dl-id',
            textColor: 'dl-color-secondary',
            color: 'white'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            dense
            :size="button.size"
            :icon="button.icon"
            :textColor="button.textColor"
            :color="button.color"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DenseIconLarge = DenseIconLargeTemplate.bind({})

const DenseIconXlTemplate = (args) => ({
    components: { DlButton },
    setup() {
        const button = {
            size: 'xl',
            icon: 'icon-dl-id',
            textColor: 'dl-color-secondary',
            color: 'white'
        }

        return { args, button }
    },
    template: `<div style="padding: 50px">
        <DlButton
            dense
            :size="button.size"
            :icon="button.icon"
            :textColor="button.textColor"
            :color="button.color"
            @click="click" 
        />
    </div>`,
    methods: {
        click: action('click')
    }
})
export const DenseIconXl = DenseIconXlTemplate.bind({})
