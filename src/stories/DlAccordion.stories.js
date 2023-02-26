import { DlAccordion } from '..'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlAccordion',
    component: DlAccordion,
    argTypes: {
        additionalInfo: {
            name: 'additionalInfo',
            description:
                'Sets additional inforomation which is displayed in a tooltip over the info icon',
            type: { name: 'string', required: false, default: null },
            control: {
                type: 'text'
            }
        },
        defaultOpened: {
            name: 'defaultOpened',
            description:
                'If set to true, the accordion will be open by default',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        rightSide: {
            name: 'rightSide',
            description:
                'If set to true, the expand button will be on the right side of the component',
            type: { name: 'boolean', required: false, default: false },
            control: {
                type: 'boolean'
            }
        },
        title: {
            name: 'title',
            default: 'Dl-accordion',
            description: 'The title of the accordion',
            type: {
                name: 'string',
                required: false,
                default: ''
            },
            control: {
                type: 'text'
            }
        },
        titleColor: {
            name: 'titleColor',
            default: '',
            description: "The color of the component's title",
            type: {
                name: 'string',
                required: false,
                default: ''
            },
            control: {
                type: 'text'
            }
        },
        fontSize: {
            name: 'fontSize',
            default: '12px',
            description: 'The font size of the title',
            type: {
                name: 'string',
                required: false,
                default: ''
            },
            control: {
                type: 'text'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlAccordion },
    setup() {
        return { args }
    },
    methods: {
        hide: action('hide'),
        show: action('show')
    },
    template: `
    <div>
      <dl-accordion @hide="hide" @show="show" v-bind="args">
        Content of accordion.
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </dl-accordion>
    </div>
        `
})

export const Preview = Template.bind({})
Preview.args = {
    title: 'Title of accordion',
    titleColor: 'dl-color-medium',
    fontSize: '12px'
}
