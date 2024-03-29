import { DlToast } from '../components'
import { DlButton } from '..'

export default {
    title: 'Library/Components/DlToast',
    argTypes: {
        type: {
            options: ['success', 'warning', 'error', 'info'],
            control: 'select',
            description: 'toast type',
            defaultValue: 'success'
        },
        message: {
            control: 'text',
            description: 'message text for toast',
            defaultValue:
                'This is a sample message with a <a href="https://google.com/">link</a>'
        },
        position: {
            options: [
                'bottom',
                'bottom-left',
                'bottom-right',
                'top',
                'top-left',
                'top-right'
            ],
            description: 'toast position, bottom, top, top-left etc.',
            control: 'select',
            defaultValue: 'bottom'
        },
        duration: {
            control: 'number',
            description: 'number of seconds the component is displayed',
            defaultValue: 10
        },
        width: {
            control: 'text',
            description: 'toast width size',
            defaultValue: 'auto'
        },
        closable: {
            control: 'boolean',
            description: 'specifies if the close icon should be displayed',
            defaultValue: true
        },
        collapseCount: {
            control: 'number',
            description:
                'N toasts to collapse and delete the old one and keep new ones'
        }
    }
}

const Template = (args) => ({
    components: { DlButton },
    setup() {
        return { args }
    },
    template: `<div style="padding: 50px"><DlButton @click="click" v-bind="args" /></div>`,
    methods: {
        click() {
            const { type, message, position, duration, closable, width } =
                this.args

            DlToast.open({
                type,
                message,
                position,
                duration,
                closable,
                width
            })
        }
    }
})

export const ToastMessage = Template.bind({})
ToastMessage.args = {
    label: 'Toast message'
}
