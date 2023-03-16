import { DlDropdownButton, DlListItem, DlItemSection, DlList } from '..'

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
        disableMainBtn: {
            name: 'disableMainBtn',
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
            name: 'falt',
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
    }
}

const Template = (args) => ({
    components: { DlDropdownButton, DlListItem, DlItemSection, DlList },
    setup() {
        return { args }
    },
    data() {
        return {
            name: 'Dropdown Button Controlled',
            showing: false
        }
    },
    methods: {
        onClose(name) {
            this.name = name
            this.showing = false
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            if (args.split) {
                alert(this.name)
            }
        }
    },
    template: `
    <dl-dropdown-button
    v-bind="args"
    :model-value="showing"
    :label="name"
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
    mainBtnStyle: 'width: 150px;',
    contentClass: '',
    contentStyle: '',
    cover: false,
    persistent: false,
    stretch: false,
    autoClose: false,
    menuSelf: 'top end',
    menuAnchor: 'bottom end',
    menuOffset: [0, 0],
    disableMainBtn: false,
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
