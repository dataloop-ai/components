import { DlDropdownButton, DlListItem, DlItemSection, DlList, DlIcon } from '..'

export default {
    title: 'Library/Components/DlDropdownButton',
    component: DlDropdownButton,
    argTypes: {
        split: {
            name: 'split',
            defaultValue: false,
            control: 'boolean',
            description:
                'White space will split the button itself from the menu icon button',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        dropdownIcon: {
            name: 'dropdownIcon',
            defaultValue: '',
            control: 'text',
            description: 'The icon in the menu button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        maxHeight: {
            name: 'maxHeight',
            defaultValue: '',
            control: 'text',
            description: 'The max height of the buttons',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        maxWidth: {
            name: 'maxWidth',
            defaultValue: '',
            control: 'text',
            description: 'The max height of the buttons',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        cover: {
            name: 'cover',
            defaultValue: false,
            control: 'boolean',
            description: "Then menu will cover the button when it's open",
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        persistent: {
            name: 'persistent',
            defaultValue: false,
            control: 'boolean',
            description:
                'Allows the menu to not be dismissed by a click/tap outside of the menu or by hitting the ESC key',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        stretch: {
            name: 'stretch',
            defaultValue: false,
            control: 'boolean',
            description:
                'Stretches the width of the button to the width of the parent element',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        autoClose: {
            name: 'autoClose',
            defaultValue: false,
            control: 'boolean',
            description: 'Allows any click/tap in the menu to close it',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        menuSelf: {
            name: 'menuSelf',
            defaultValue: '',
            control: 'text',
            description: 'The position of the menu in relation to the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        menuAnchor: {
            name: 'menuAnchor',
            defaultValue: '',
            control: 'text',
            description: 'The position of the menu independent of the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        menuOffset: {
            name: 'menuOffset',
            defaultValue: '',
            control: 'text',
            description: 'Offset position of the menu',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        color: {
            name: 'color',
            defaultValue: '',
            control: 'text',
            description: 'The color of the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        textColor: {
            name: 'textColor',
            defaultValue: '',
            control: 'text',
            description: 'The color of text inside the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        size: {
            name: 'size',
            defaultValue: '',
            control: 'text',
            description: 'The size of the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        icon: {
            name: 'icon',
            defaultValue: '',
            control: 'text',
            description: 'The name of the icon appearing on the menu button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        label: {
            name: 'label',
            defaultValue: '',
            control: 'text',
            description: 'The text inside the button',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        disableMainButton: {
            name: 'disableMainButton',
            defaultValue: false,
            control: 'boolean',
            description:
                'The user will not be able to click on the main button. This prop works only when the button is split',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            name: 'disabled',
            defaultValue: false,
            control: 'boolean',
            description: 'Both buttons will be inactive',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        outlined: {
            name: 'outlined',
            defaultValue: false,
            control: 'boolean',
            description:
                'The button will be transparent with a colored outline',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        flat: {
            name: 'flat',
            defaultValue: false,
            control: 'boolean',
            description: 'The button will be transparent and have no outline',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disableDropdown: {
            name: 'disableDropdown',
            defaultValue: false,
            control: 'boolean',
            description:
                'The user will not be able to click on the menu button. This prop works only when the button is split',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        noIconAnimation: {
            name: 'noIconAnimation',
            defaultValue: false,
            control: 'boolean',
            description: 'The icon will not move when the menu expands',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        fluid: {
            name: 'fluid',
            defaultValue: false,
            control: 'boolean',
            description: 'Takes the width of the parent element',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        }
    },
    slots: {
        'suffix-icon': {
            description:
                'Custom icon slot to replace the default dropdown icon. If not provided, the default icon (controlled by dropdownIcon prop) will be displayed.',
            table: {
                type: { summary: 'Slot' },
                category: 'Slots'
            }
        },
        label: {
            description: 'Custom label content slot',
            table: {
                type: { summary: 'Slot' },
                category: 'Slots'
            }
        },
        default: {
            description: 'Menu content slot',
            table: {
                type: { summary: 'Slot' },
                category: 'Slots'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Dropdown Button Controlled',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        v-bind="args"
        :model-value="showing"
        :label="label"
        @show="onOpen"
        @click="onClick"
    >
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Videos')">
            <dl-item-section> Videos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Videos')">
            <dl-item-section> Videos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    split: false,
    dropdownIcon: 'icon-dl-down-chevron',
    maxHeight: '210px',
    maxWidth: '100%',
    mainButtonStyle: 'width: 150px;',
    contentClass: '',
    contentStyle: '',
    cover: false,
    persistent: false,
    stretch: false,
    autoClose: false,
    menuSelf: 'top end',
    menuAnchor: 'bottom end',
    menuOffset: [0, 0],
    disableMainButton: false,
    noIconAnimation: false,
    disabled: false,
    color: '',
    textColor: '',
    size: 'm',
    contained: true,
    fluid: false,
    icon: '',
    flat: false,
    uppercase: false,
    outlined: false,
    disableDropdown: false
}

const SplitTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Split',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        split
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        size="m"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
    >
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Split = SplitTemplate.bind({})
Split.args = {
    split: true,
    label: 'Split',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;',
    size: 'm'
}

const CoverTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Covered',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        cover
        label="Covered"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Cover = CoverTemplate.bind({})
Cover.args = {
    cover: true,
    label: 'Covered',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const PersistentTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Persistent',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        persistent
        label="Persistent"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Persistent = PersistentTemplate.bind({})
Persistent.args = {
    persistent: true,
    label: 'Persistent',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const StretchTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Stretch',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        stretch
        label="Stretch"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Stretch = StretchTemplate.bind({})
Stretch.args = {
    stretch: true,
    label: 'Stretch',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const AutocloseTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Autoclose',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        auto-close
        label="Autoclose"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Autoclose = AutocloseTemplate.bind({})
Autoclose.args = {
    autoClose: true,
    label: 'Autoclose',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const DisableMainButtonTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Disable Main Button',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        disable-main-button
        label="Disable Main Button"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const DisableMainButton = DisableMainButtonTemplate.bind({})
DisableMainButton.args = {
    disableMainButton: true,
    label: 'Disable Main Button',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const NoIconAnimationTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'No Icon Animation',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        no-icon-animation
        label="No Icon Animation"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const NoIconAnimation = NoIconAnimationTemplate.bind({})
NoIconAnimation.args = {
    noIconAnimation: true,
    label: 'No Icon Animation',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const DisabledTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'No Icon Animation',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        disabled
        label="Disabled"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    disabled: true,
    label: 'Disabled',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const FluidTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Fluid',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        fluid
        label="Fluid"
        dropdownIcon="icon-dl-down-chevron"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Fluid = FluidTemplate.bind({})
Fluid.args = {
    fluid: true,
    label: 'Fluid',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0]
    // mainButtonStyle: 'width: 150px;'
}

const FlatTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Flat',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        flat
        label="Flat"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Flat = FlatTemplate.bind({})
Flat.args = {
    flat: true,
    label: 'Flat',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const OutlinedTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Outlined',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        outlined
        label="Outlined"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const Outlined = OutlinedTemplate.bind({})
Outlined.args = {
    outlined: true,
    label: 'Outlined',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}

const DisableDropdownTemplate = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            label: 'Disable Dropdown',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.label = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.label)
            }
        }
    },
    template: `
    <dl-dropdown-button
        disable-dropdown
        label="Disable Dropdown"
        dropdownIcon="icon-dl-down-chevron"
        mainButtonStyle="width: 150px;"
        :menuOffset="[0, 0]"
        :model-value="showing"
        v-bind="args"
        @show="onOpen"
        @click="onClick"
>
    <dl-list>
        <dl-list-item clickable @click="() => onClose('Photos')">
            <dl-item-section> Photos </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable  @click="() => onClose('Videos and long text text')">
            <dl-item-section> Videos and long text text </dl-item-section>
        </dl-list-item>

        <dl-list-item clickable @click="() => onClose('Articles')">
            <dl-item-section> Articles </dl-item-section>
        </dl-list-item>
    </dl-list>
</dl-dropdown-button>
    `
})

export const DisableDropdown = DisableDropdownTemplate.bind({})
DisableDropdown.args = {
    disableDropdown: true,
    label: 'Disable Dropdown',
    dropdownIcon: 'icon-dl-down-chevron',
    menuOffset: [0, 0],
    mainButtonStyle: 'width: 150px;'
}
