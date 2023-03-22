import { DlBadge } from '../'

export default {
    title: 'Library/Components/DlBadge',
    component: DlBadge,
    argTypes: {
        color: {
            name: 'color',
            description: 'The color of the badge',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        textColor: {
            name: 'textColor',
            description: 'The color of the text',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        floating: {
            name: 'floating',
            description:
                'If set to true, the badge floats to the top right side of the relative positioned parent element',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        transparent: {
            name: 'transparent',
            description: 'Applies a low opacity',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        withBorder: {
            name: 'withBorder',
            description: 'Applies a border to the badge',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        borderColor: {
            name: 'borderColor',
            description: "The color of the badge's border",
            type: { name: 'string', required: false, default: '' },
            control: {
                type: 'text'
            }
        },
        align: {
            name: 'align',
            description: `Sets the vertical alignment of the badge, accepted values are: 'top', 'middle' and 'bottom'`,
            type: { name: 'string', required: false, default: '' },
            control: {
                type: 'text'
            }
        },
        multiLine: {
            name: 'multiLine',
            description: 'Content can wrap to multiple lines',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        label: {
            name: 'label',
            description: 'The text label of the badge',
            type: { name: 'string', required: false, default: '' },
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    />`
})

export const Preview = Template.bind({})
Preview.args = {
    color: 'red',
    textColor: 'red',
    borderColor: 'panel-background',
    align: 'top'
}

const FloatingTemplate = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        floating
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    />`
})

export const Floating = FloatingTemplate.bind({})
Floating.args = {
    floating: true,
    color: 'red',
    textColor: 'red',
    borderColor: 'panel-background',
    align: 'top'
}

const TransparentTemplate = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        transparent
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    />`
})

export const Transparent = TransparentTemplate.bind({})
Transparent.args = {
    color: 'red',
    textColor: 'red',
    transparent: true,
    borderColor: 'panel-background',
    align: 'top'
}

const OutlineTemplate = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        outline
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    />`
})

export const Outline = OutlineTemplate.bind({})
Outline.args = {
    outline: true,
    color: 'red',
    textColor: 'red',
    borderColor: 'panel-background',
    align: 'top'
}

const WithNameTemplate = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        outline
        label="name"
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    />`
})

export const WithName = WithNameTemplate.bind({})
WithName.args = {
    outline: true,
    label: 'name',
    color: 'red',
    textColor: 'red',
    align: 'top',
    borderColor: 'panel-background'
}

const MultilineTemplate = (args) => ({
    components: { DlBadge },
    setup() {
        return { args }
    },
    template: `
    <dl-badge
        multiline
        outline
        color="red"
        textColor="red"
        align="top"
        borderColor="panel-background"
        v-bind="args"
    >
        <div style="width: 30px">
            Multi line
        </div>
    </dl-badge>`
})

export const Multiline = MultilineTemplate.bind({})
Multiline.args = {
    multiline: true,
    color: 'red',
    textColor: 'red',
    borderColor: 'panel-background',
    align: 'top'
}
