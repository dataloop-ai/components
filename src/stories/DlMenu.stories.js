import { DlIcon, DlButton, DlListItem, DlItemSection, DlList, DlMenu } from '..'
import { action } from '@storybook/addon-actions'

export const positions = [
    'top left',
    'top middle',
    'top right',
    'top start',
    'top end',
    'center left',
    'center middle',
    'center right',
    'center start',
    'center end',
    'bottom left',
    'bottom middle',
    'bottom right',
    'bottom start',
    'bottom end'
]

export default {
    title: 'Library/Components/DlMenu',
    component: DlMenu,
    argTypes: {
        contextMenu: {
            name: 'context-menu',
            type: { name: 'boolean', required: false },
            description: 'The menu will open on right click',
            defaultValue: false,
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
            description: 'The menu will not open',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        persistent: {
            name: 'persistent',
            type: { name: 'boolean', required: false },
            description: 'The menu will not close when clicking outside it',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        autoClose: {
            name: 'auto close',
            type: { name: 'boolean', required: false },
            description:
                'The menu will automatically close after clicking an item inside it',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        noRefocus: {
            name: 'noRefocus',
            type: { name: 'boolean', required: false },
            description:
                'When the menu gets hidden, do not refocus on the DOM element that previously had focus',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        fitContainer: {
            name: 'fitContainer',
            type: { name: 'boolean', required: false },
            description:
                'Allows the menu to match at least the full width of its target',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        fitContent: {
            name: 'fitContent',
            type: { name: 'boolean', required: false },
            description:
                'Allows the menu to match at least the full width of its content',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        cover: {
            name: 'cover',
            type: { name: 'boolean', required: false },
            description:
                "Allows the menu to cover its target. When used, the 'self' and 'fit' props are no longer effective",
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        square: {
            name: 'square',
            type: { name: 'boolean', required: false },
            description: 'Forces content to have squared borders',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        anchor: {
            name: 'anchor',
            defaultValue: 'bottom left',
            description:
                'Two values setting the starting position or anchor point of the menu relative to its target',
            control: { type: 'select' },
            options: positions
        },
        self: {
            name: 'self',
            defaultValue: 'top left',
            description:
                "Two values setting the menu's own position relative to its target",
            control: { type: 'select' },
            options: positions
        },
        offset: {
            name: 'offset',
            defaultValue: '',
            description:
                'Offsets the menu horizontally and vertically in pixels',
            control: {
                type: 'text'
            }
        },
        scrollTarget: {
            name: 'scrollTarget',
            defaultValue: 'body',
            description:
                'CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one',
            control: {
                type: 'text'
            }
        },
        touchPosition: {
            name: 'touchPosition',
            type: { name: 'boolean', required: false },
            description:
                'Allows for the target position to be set by the mouse position, when the target of the menu is either clicked or touched',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        maxHeight: {
            name: 'maxHeight',
            description: 'The maximum height of the menu',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        maxWidth: {
            name: 'maxWidth',
            defaultValue: '',
            description: 'The maximum width of the menu',
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlIcon, DlButton, DlListItem, DlItemSection, DlList, DlMenu },
    setup() {
        return { args }
    },
    methods: {
        toggle: action('toggle'),
        escapeKey: action('escapeKey')
    },
    template: `
    <dl-button label="Basic Menu">
            <dl-menu v-bind="args" @toggle="toggle" @escape-key="escapeKey">
                <dl-list padding>
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled> Disabled list item </dl-list-item>
                    <dl-list-item clickable> Clickable list item </dl-list-item>
                    <dl-list-item
                        clickable
                        disabled
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section side> Left text </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        start-icon-color="dl-color-positive"
                        end-icon-color="dl-color-secondary"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item clickable bordered>
                        <dl-item-section side>
                            <dl-icon size="16px" icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon size="16px" icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu anchor="top end" self="top start">
                            <dl-list bordered separator>
                                <dl-list-item
                                    v-for="n in 3"
                                    :key="n"
                                    dense
                                    clickable
                                >
                                    <dl-item-section>
                                        Submenu Label
                                    </dl-item-section>
                                    <dl-item-section side>
                                        <dl-icon icon="icon-dl-id" />
                                    </dl-item-section>
                                    <dl-menu
                                        auto-close
                                        anchor="top end"
                                        self="top start"
                                    >
                                        <dl-list bordered>
                                            <dl-list-item
                                                v-for="n in 3"
                                                :key="n"
                                                dense
                                                clickable
                                            >
                                                <dl-item-section>
                                                    3rd auto-close menu
                                                </dl-item-section>
                                            </dl-list-item>
                                        </dl-list>
                                    </dl-menu>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </dl-list-item>
                    <dl-list-item bordered>
                    <dl-item-section no-wrap>
                       <dl-button size="m" fluid flat label="Clear Button" icon="icon-dl-search"/>
                    </dl-item-section>
                </dl-list-item>
                </dl-list>
            </dl-menu>
        </dl-button>
        `
})

export const Preview = Template.bind({})
Preview.args = {}
