import { DlTextHolder } from '../components'
import { ref } from 'vue-demi'

export default {
    title: 'Library/Components/DlTextHolder',
    component: DlTextHolder,
    argTypes: {
        prefix: {
            name: 'prefix',
            defaultValue: null,
            description:
                'The text shown before the main content of the text holder',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        suffix: {
            name: 'suffix',
            defaultValue: null,
            description:
                'The text shown after the main content of the text holder',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        text: {
            name: 'text',
            defaultValue: null,
            control: 'text',
            description:
                'The text shown as the main content of the text holder',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlTextHolder },
    setup() {
        return { args }
    },
    template: `
    <div style="display:flex; flex-wrap: wrap; resize: horizontal; overflow: auto; width: 200px; padding: 5px; border: 1px solid #999999;">
        <DlTextHolder v-bind="args" />
    </div>
  `
})

export const Preview = Template.bind({})
Preview.args = {
    prefix: '/home/Desktop/',
    suffix: '.txt',
    text: 'somefilename'
}
