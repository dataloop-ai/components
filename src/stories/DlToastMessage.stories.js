import { DlToast } from '../components/DlToastMessage'
import { DlButton } from '..'

export default {
    title: 'Library/Components/DlToastMessage',
    component: DlButton,
    argTypes: {
        type: {
            options: ['success', 'warning', 'error', 'info'],
            control: 'select',
            defaultValue: 'success'
        },
        message: {
            control: 'text',
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
            control: 'select',
            defaultValue: 'bottom'
        },
        duration: {
            control: 'number',
            defaultValue: 10
        },
        classItem: {
            control: 'text',
            defaultValue: 'demo-toast'
        },
        closable: {
            control: 'boolean',
            defaultValue: true
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
            const { type, message, position, duration, closable, classItem } =
                this.args

            DlToast.open({
                type,
                message,
                position,
                duration,
                closable,
                classItem
            })
        }
    }
})

export const ToastMessage = Template.bind({})
ToastMessage.args = {
    filled: true,
    label: 'Toast message'
}
