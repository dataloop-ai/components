import { action } from '@storybook/addon-actions'
import { DlChip } from '../components'

const transformOptions = [
    'none',
    'capitalize',
    'uppercase',
    'lowercase',
    'first-letter-capitalized'
]

export default {
    title: 'Library/Components/DlChip',
    component: DlChip,
    argTypes: {
        label: {
            name: 'label',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The label for the chip'
        },
        overflow: {
            name: 'overflow',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            control: 'boolean',
            description:
                'Flag to showcase a tooltip on hover when the string is overflowing from the max width'
        },
        filled: {
            name: 'filled',
            description: 'The entire chip will be colored',
            type: { name: 'Boolean', required: false },
            defaultValue: true,
            control: 'boolean'
        },
        disabled: {
            name: 'disabled',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            control: 'boolean',
            description: 'Flag for putting the component in a disabled state'
        },
        outlined: {
            name: 'outlined',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            control: 'boolean',
            description: 'Flag for setting the outline for the component'
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            control: {
                type: 'text'
            },
            description: 'The background color of the chip'
        },
        textColor: {
            name: 'textColor',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The text color of the chip'
        },
        icon: {
            name: 'icon',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The icon inside the chip'
        },
        iconColor: {
            name: 'iconColor',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The color of the icon inside the chip'
        },
        maxWidth: {
            name: 'maxWidth',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The maximum width of the chip'
        },
        removable: {
            name: 'removable',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            control: 'boolean',
            description: 'Flag for enabling the chip to be removed'
        },
        tabIndex: {
            name: 'tabIndex',
            type: { name: 'string', required: false },
            defaultValue: '',
            control: {
                type: 'text'
            },
            description: 'The tab index of the chip'
        },
        transform: {
            name: 'transform',
            defaultValue: 'lowercase',
            description: 'The text transform options for the chip',
            control: { type: 'radio', options: transformOptions },
            table: {
                type: { summary: transformOptions },
                defaultValue: { summary: 'lowercase' }
            }
        },
        fit: {
            name: 'fit',
            defaultValue: false,
            description:
                'Allows the chip to match at least the full width of its content',
            control: 'boolean'
        }
    }
}

const Template = (args) => ({
    components: { DlChip },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <DlChip @remove="click" v-bind="args" > 
            <template v-if="${'prefix' in args}" v-slot:prefix>
                ${args.prefix}
            </template>
        </DlChip>
     </div>
    `,
    methods: {
        click: action('remove'),
        onLableChange: (e) => {
            args = { ...args, label: e.target.value }
        }
    }
})

export const Preview = Template.bind({})
Preview.args = {
    filled: true,
    label: 'Lorem ipsum dolor imun ls',
    icon: 'icon-dl-alert',
    removable: true,
    iconColor: 'yellow',
    maxWidth: '100px'
}

export const PreviewWithPreText = Template.bind({})
PreviewWithPreText.args = {
    filled: true,
    label: 'Lorem ipsum dolor imun ls',
    icon: 'icon-dl-alert',
    removable: true,
    iconColor: 'yellow',
    maxWidth: '100px',
    prefix: '<div style="text-align: center; background: yellow; padding: 0px 0.2rem; display: inline-block; border-radis: 3px;">12</div>'
}

export const PreviewWithUppercaseText = Template.bind({})
PreviewWithUppercaseText.args = {
    filled: true,
    transform: 'none',
    label: 'TEST UPPERCASE',
    icon: 'icon-dl-alert',
    removable: true,
    iconColor: 'yellow',
    maxWidth: '100px'
}

export const PreviewWithTooltip = Template.bind({})
PreviewWithTooltip.args = {
    filled: true,
    label: 'Lorem ipsum dolor imun ls',
    icon: 'icon-dl-alert',
    removable: true,
    iconColor: 'yellow',
    maxWidth: '100px',
    overflow: true
}

export const PreviewWithFit = Template.bind({})
PreviewWithFit.args = {
    label: 'Lorem ipsum dolor imun ls',
    fit: true
}
