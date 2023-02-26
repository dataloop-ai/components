import { DlTooltip, DlLink } from '../'
import { colors } from '../assets/globalsKeys'
import { positions } from './DlMenu.stories'

export default {
    title: 'Library/Components/DlTooltip',
    component: DlTooltip,
    argTypes: {
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-tooltip-text',
            description: 'The tooltip text color',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'dl-color-tooltip-text' }
            },
            control: {
                type: 'select',
                options: colors
            }
        },
        backgroundColor: {
            name: 'background-color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-tooltip-background',
            description: 'The tooltip background color',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'dl-color-tooltip-background' }
            },
            control: {
                type: 'select',
                options: colors
            }
        },
        maxWidth: {
            name: 'max-width',
            type: { name: 'string', required: false },
            defaultValue: '240px',
            description: 'The tooltip max width',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '240px' }
            }
        },
        maxHeight: {
            name: 'max-height',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The tooltip max height',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        anchor: {
            name: 'anchor',
            type: { name: 'string', required: false },
            defaultValue: 'bottom middle',
            description:
                'Two values setting the starting position or anchor point of the Tooltip relative to its target',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'bottom middle' }
            },
            control: {
                type: 'select',
                options: positions
            }
        },
        self: {
            name: 'self',
            type: { name: 'string', required: false },
            defaultValue: 'top middle',
            description:
                "Two values setting the Tooltip's own position relative to its target",
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'top middle' }
            },
            control: {
                type: 'select',
                options: positions
            }
        },
        offset: {
            name: 'offset',
            control: 'array',
            defaultValue: [9, 9],
            description:
                'An array of two numbers to offset the Tooltip horizontally and vertically in pixels'
        },
        scrollTarget: {
            name: 'scroll-target',
            type: String,
            defaultValue: void 0,
            description:
                'CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one'
        },
        delay: {
            name: 'delay',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 500,
            description: 'Configure Tooltip to appear with delay',
            table: {
                type: { summary: Number },
                defaultValue: { summary: 500 }
            }
        },
        hideDelay: {
            name: 'hide-delay',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 0,
            description: 'Configure Tooltip to disappear with delay',
            table: {
                type: { summary: Number },
                defaultValue: { summary: 0 }
            }
        },
        transitionDuration: {
            name: 'transition-duration',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 300,
            description: 'Transition duration (in milliseconds, without unit)',
            table: {
                type: { summary: Number },
                defaultValue: { summary: 300 }
            }
        },
        textAlignment: {
            name: 'text-alignment',
            type: { name: 'string', required: false },
            defaultValue: 'left',
            description: 'Tooltip text alignment',
            control: {
                type: 'select',
                options: ['left', 'right', 'center', 'justify']
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'left' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTooltip, DlLink },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <div
            style="
            display: flex;
            flex-direction: column;
            gap: 1em;
            justify-content: center;
            "
        >
            <div style="border: 1px solid black">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut incidunt totam placeat maxime numquam ullam, voluptatum enim perferendis nostrum aliquid sapiente non, sit ad cumque quia debitis eligendi. Eligendi, facere!
                <dl-tooltip v-bind="args">Pneumonoultramicroscopicsilicovolcanoconiosis ipsum dolor, sit amet consectetur adipisicing elit. Ut incidunt totam placeat maxime numquam ullam, voluptatum enim perferendis nostrum aliquid sapiente non, sit ad cumque quia debitis eligendi. Eligendi, facere!</dl-tooltip>
            </div>
            <dl-link href="https://console.dataloop.ai" open-in-new-tab>
                dl-link as parent
                <dl-tooltip v-bind="args"> dl-link </dl-tooltip>
            </dl-link>
            <div>
                <button>
                    button as parent
                    <dl-tooltip v-bind="args"> button </dl-tooltip>
                </button>
            </div>
        </div>
    </div>
   `
})
export const Preview = Template.bind({})
Preview.args = {}
