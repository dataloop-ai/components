import { DlList, DlListItem, DlItemSection } from '..'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlListItem',
    component: DlListItem,
    argTypes: {
        bordered: {
            name: 'bordered',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'List item container border',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'Disable list item',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        clickable: {
            name: 'clickable',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'Actionable list item',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        startIconColor: {
            name: 'startIconColor',
            defaultValue: '',
            description: 'startIconColor color',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        },
        endIconColor: {
            name: 'endIconColor',
            defaultValue: '',
            description: 'endIconColor color',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        },
        startIcon: {
            name: 'startIcon',
            defaultValue: 'icon-dl-master',
            description: 'startIcon name',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        as: {
            name: 'as',
            defaultValue: 'div',
            description:
                'The tag name of the HTML element the item will be created as',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        endIcon: {
            name: 'endIcon',
            defaultValue: 'icon-dl-vehicles',
            description: 'endIcon name',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlList, DlListItem, DlItemSection },
    setup() {
        return { args }
    },
    methods: {
        click: action('click')
    },
    template: `
    <div style="padding: 50px;">
        <dl-list style="width: 300px;">
            <dl-list-item @click="click" v-bind="args">
                <dl-item-section no-wrap>
                    <p style="margin: 0;">with left and right side icons</p>
                </dl-item-section>
            </dl-list-item>
        </dl-list>
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    startIcon: 'icon-dl-master',
    endIcon: 'icon-dl-vehicles'
}

const DefaultTemplate = (args) => ({
    components: { DlListItem },
    setup() {
        return { args }
    },
    methods: {
        click: action('click')
    },
    template: `
    <div style="padding: 50px;">
        <dl-list-item 
            @click="click" 
            v-bind="args"
        >
            Default list item
        </dl-list-item>
    </div>
    `
})

export const Default = DefaultTemplate.bind({})
Default.args = {
    endIcon: ''
}

const DisabledTemplate = (args) => ({
    components: { DlListItem },
    setup() {
        return { args }
    },
    methods: {
        click: action('click')
    },
    template: `
    <div style="padding: 50px;">
        <dl-list-item
            disabled
            v-bind="args"
            @click="click"
        >
            Disabled list item
        </dl-list-item>
    </div>
    `
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    disabled: true,
    endIcon: ''
}

const ClickableTemplate = (args) => ({
    components: { DlListItem },
    setup() {
        return { args }
    },
    methods: {
        click: action('click')
    },
    template: `
    <div style="padding: 50px;">
        <dl-list-item
            clickable
            v-bind="args"
            @click="click"
        >
            Clickable list item
        </dl-list-item>
    </div>
    `
})

export const Clickable = ClickableTemplate.bind({})
Clickable.args = {
    clickable: true,
    endIcon: ''
}

const BorderedTemplate = (args) => ({
    components: { DlListItem },
    setup() {
        return { args }
    },
    methods: {
        click: action('click')
    },
    template: `
    <div style="padding: 50px;">
        <dl-list-item
            bordered
            v-bind="args"
            @click="click"
        >
            Bordered list item
        </dl-list-item>
    </div>
    `
})

export const Bordered = BorderedTemplate.bind({})
Bordered.args = {
    bordered: true,
    endIcon: ''
}
