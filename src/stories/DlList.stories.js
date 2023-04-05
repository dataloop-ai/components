import { DlList, DlListItem, DlItemSection } from '..'
import { getColor } from '../utils'

export default {
    title: 'Library/Components/DlList',
    component: DlList,
    argTypes: {
        bordered: {
            name: 'bordered',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The list will have a border around',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        padding: {
            name: 'padding',
            type: { name: 'string', required: false },
            defaultValue: false,
            description: 'The space between the list children',
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
            description: 'The list items will be clickable',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        separator: {
            name: 'separator',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The list items will have a border around',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        label: {
            name: 'label',
            type: { name: 'string', required: false },
            defaultValue: '',
            description: 'The text content of the items',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            },
            control: {
                type: 'text'
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'List items disabled',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        startIcon: {
            name: 'startIcon',
            defaultValue: 'icon-dl-search',
            description: 'startIcon name',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
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
        endIcon: {
            name: 'endIcon',
            defaultValue: 'icon-dl-id',
            description: 'endIcon name',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        color: {
            name: 'color',
            defaultValue: '',
            description: 'color name',
            control: 'color',
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: '' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlList, DlListItem, DlItemSection },
    setup() {
        const color = args.color.length > 0 ? getColor(args.color) : 'inherit'
        return { args, color }
    },
    template: `
    <div style="padding: 50px;">
            <dl-list v-bind="args" style="min-width: 300px; width: min-content;">
                <template v-slot="{clickable}">
                    <dl-list-item :disabled="args.disabled" :startIconColor="args.startIconColor" :endIconColor="args.endIconColor" :clickable="clickable" :start-icon="args.startIcon" :end-icon="args.endIcon">
                        <dl-item-section no-wrap>
                            <p :style="{ margin: 0, color }">{{ args.label }}</p>
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item :separator="args.separator" :disabled="args.disabled" :startIconColor="args.startIconColor" :endIconColor="args.endIconColor" :clickable="clickable" :start-icon="args.startIcon" :end-icon="args.endIcon">
                        <dl-item-section no-wrap>
                            <p :style="{ margin: 0, color }">{{ args.label }}</p>
                        </dl-item-section>
                    </dl-list-item>
                </template>
            </dl-list>
    </div>
`
})

export const Preview = Template.bind({})
Preview.args = {
    disabled: false,
    color: 'var(--dl-color-medium)',
    startIcon: 'icon-dl-save',
    endIcon: 'icon-dl-delete',
    label: 'List Item',
    bordered: true
}
