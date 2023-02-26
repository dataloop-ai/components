import { DlPanelContainer, DlPanel } from '..'
import { ref } from 'vue'

export default {
    title: 'Library/Components/DlPanelContainer',
    component: DlPanelContainer,
    argTypes: {
        width: {
            name: 'width',
            defaultValue: '400px',
            description: 'The width of the container',
            control: {
                type: 'text'
            }
        },
        height: {
            name: 'height',
            defaultValue: '500px',
            description: 'The height of the container',
            control: {
                type: 'text'
            }
        },
        minWidth: {
            name: 'minWidth',
            description: 'The min width of the container',
            defaultValue: 36,
            control: {
                type: 'number'
            }
        },
        direction: {
            name: 'direction',
            defaultValue: 'right',
            description: 'The direction the container is oriented towards',
            control: { type: 'select' },
            options: ['right', 'left']
        },
        collapsable: {
            name: 'collapsable',
            type: { name: 'boolean', required: false },
            description: 'Shows a button that collapses the container',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        resizable: {
            name: 'resizable',
            type: { name: 'boolean', required: false },
            description: 'Allows the panels to be resized',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        headerHeight: {
            name: 'headerHeight',
            description: 'The height of the container',
            defaultValue: '80px'
        },
        footerHeight: {
            name: 'footerHeight',
            description: 'The width of the container',
            defaultValue: '70px'
        }
    }
}

const Template = (args) => ({
    components: { DlPanelContainer, DlPanel },
    setup() {
        const collapsed = ref(false)

        return { args, collapsed }
    },
    template: `<div>
    <dl-panel-container
        v-bind="args"
        v-model="collapsed"
    >
        <template #header>
          <h2>Header</h2>
        </template>
        <dl-panel
            resizable
            collapsable
        >
            <div>
                <h3>RESIZABLE & COLLAPSABLE</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Excepturi, rerum harum aut sunt recusandae
                    obcaecati necessitatibus. Alias nulla aliquid,
                    dolorem qui, nesciunt hic iste ratione voluptates
                    magni optio quae. Vero!
                </p>
            </div>
        </dl-panel>
        <dl-panel resizable>
            <h3>RESIZABLE</h3>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Nam ut odit quae minus in enim, recusandae
                repellendus a. Tenetur voluptas autem nostrum ullam
                nesciunt exercitationem perferendis quibusdam aliquam
                expedita quos!
            </p>
        </dl-panel>
        <dl-panel>
            <h3>SIMPLE PANEL</h3>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Natus excepturi aliquam asperiores dignissimos quo
                molestiae repellat officiis perferendis eius nihil
                possimus cumque similique, ea tempora earum sint
                reprehenderit in deleniti.
            </p>
        </dl-panel>
        <template #footer>
          <h2>Footer</h2>
      </template>
    </dl-panel-container>
    </div>
        `
})

export const Preview = Template.bind({})
Preview.args = {}
