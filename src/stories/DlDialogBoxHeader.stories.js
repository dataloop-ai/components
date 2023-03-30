import { DlDialogBoxHeader } from '../components'

export default {
    title: 'Library/Components/DlDialogBoxHeader',
    component: DlDialogBoxHeader,
    argTypes: {
        title: {
            name: 'title',
            defaultValue: 'Title',
            control: {
                type: 'text'
            },
            description: 'dialog header title'
        },
        subtitle: {
            name: 'subtitle',
            defaultValue: 'Subtitle',
            control: {
                type: 'text'
            },
            description: 'dialog header subtitle'
        },
        closeButton: {
            name: 'closeButton',
            defaultValue: true,
            control: 'boolean',
            description: 'has the dialog header close button'
        },
        hasBackButton: {
            name: 'hasBackButton',
            defaultValue: false,
            control: 'boolean',
            description: 'if the dialog has back button or not'
        }
    }
}

const Template = (args) => ({
    components: {
        DlDialogBoxHeader
    },
    setup() {
        return { args }
    },
    data() {
        return {}
    },
    template: `
         <dl-dialog-box-header v-bind="args">
         </dl-dialog-box-header>

    `
})

export const Preview = Template.bind({})
Preview.args = {}
