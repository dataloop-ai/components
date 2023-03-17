import { useDlToast } from '../components/DlToastMessage'
import { DlButton } from '..'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlToastMessage',
    component: DlButton,
    argTypes: {
        toastMessage: {
            name: 'Trigger toast message',
            defaultValue: false,
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
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
        click () {
            console.log(this.args)
            useDlToast.open({
                message: 'sdfgfdgdf',
                type: this.type
            })
        }
    }
})

export const ToastMessage = Template.bind({})
ToastMessage.args = {
    filled: true,
    label: 'Toast message'
}
