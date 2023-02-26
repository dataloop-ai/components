import { DlList, DlListItem, DlIcon, DlItemSection } from '..'

export default {
    title: 'Library/Components/DlItemSection',
    component: DlItemSection,
    argTypes: {
        side: {
            name: 'side',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'The side the content will be displayed on',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        label: {
            name: 'label',
            defaultValue: 'content lorem ipsum dolor ipsum dolot',
            description: 'The text to go inside the item section',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'with left and right icons' }
            }
        },
        color: {
            name: 'color',
            defaultValue: '',
            description: 'The color of the icon',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'with left and right icons' }
            }
        },
        noWrap: {
            name: 'noWrap',
            type: { name: 'boolean', required: false },
            defaultValue: false,
            description: 'noWrap content, add ellipsis',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        }
    }
}

const Template = (args) => ({
    components: { DlList, DlListItem, DlIcon, DlItemSection },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px;">
        <dl-list style="width: 200px;">
            <dl-list-item>
                <dl-item-section v-bind="args" side>
                    <dl-icon icon="icon-dl-search" style='width: 16px' size="16px" />
                </dl-item-section>
                <dl-item-section v-bind="args">
                    <p style="color: var(--dl-color-secondary); margin: 0;">{{ args.label }}</p>
                </dl-item-section>
            </dl-list-item>
        </dl-list>
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {}
