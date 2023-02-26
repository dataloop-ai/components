import { DlIcon, DlButton, DlPopup, DlTextArea } from '..'
import { action } from '@storybook/addon-actions'
import { ref } from 'vue'

const positions = [
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
    title: 'Library/Components/DlPopup',
    component: DlPopup,
    argTypes: {
        contextMenu: {
            name: 'context-menu',
            type: { name: 'boolean', required: false },
            description: 'The popup will open on right click',
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
            description: 'The popup will be disabled',
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
                'The previously focused element will not regain focus upon closing the popup',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        noFocus: {
            name: 'noFocus',
            type: { name: 'boolean', required: false },
            description: 'When the popup gets shown, do not switch focus on it',
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
            description: 'Two positions the popup will be anchored on',
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
            description: 'Offsets the popup by a specific distance',
            control: {
                type: 'text'
            }
        },
        scrollTarget: {
            name: 'scrollTarget',
            description:
                'CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one',
            defaultValue: 'body',
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
        preventHide: {
            name: 'preventHide',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        disableCloseByEsc: {
            name: 'disableCloseByEsc',
            type: { name: 'boolean', required: false },
            description: 'The popup will not close when ESC is pressed',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        hideOnClickOutside: {
            name: 'hideOnClickOutside',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The popup will disappear when clicking outside it',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        autoClose: {
            name: 'autoClose',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description:
                'The popup will close automatically when clicking something inside it',
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
            defaultValue: false,
            description:
                'The popup will not be closed when clicking outside it',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        withCloseButton: {
            name: 'withCloseButton',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The popup will contain a close button',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        title: {
            name: 'title',
            description: 'The title of the popup',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        subtitle: {
            name: 'subtitle',
            description: 'The subtitle of the popup',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        additionalInfo: {
            name: 'additionalInfo',
            description:
                'Additional information to be displayed inside the popup',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        maxHeight: {
            name: 'maxHeight',
            description: 'The max height of the popup',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        maxWidth: {
            name: 'maxWidth',
            defaultValue: '',
            description: 'The max width of the popup',
            control: {
                type: 'text'
            }
        },
        height: {
            name: 'height',
            defaultValue: '',
            description: 'The height of the popup',
            control: {
                type: 'text'
            }
        },
        width: {
            name: 'width',
            defaultValue: '',
            description: 'The width of the popup',
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlIcon, DlButton, DlTextArea, DlPopup },
    setup() {
        const textAreaValue = ref('')
        return { args, textAreaValue }
    },
    methods: {
        toggle: action('toggle'),
        escapeKey: action('escapeKey')
    },
    template: `<div>
    <dl-button label="Trigger Popup">
            <dl-popup v-bind="args" @toggle="toggle" @escape-key="escapeKey">
                <dl-text-area
                    v-model="textAreaValue"
                    :max-length="100"
                    show-counter
                    placeholder="Type your text"
                    width="203px"
                />
                <template #footer>
                    <dl-button fluid>
                        Save
                    </dl-button>
                </template>
            </dl-popup>
        </dl-button>
    </div>
        `
})

export const Preview = Template.bind({})
Preview.args = {
    additionalInfo: 'Some additional textual information',
    subtitle: 'Some text for better explanation',
    title: 'Edit Item Description',
    withCloseButton: true
}
