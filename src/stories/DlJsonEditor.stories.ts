import { DlJsonEditor, DlDialogBox, DlDialogBoxHeader, DlButton } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue-demi'

type Story = StoryObj<typeof DlJsonEditor>

const meta: Meta<typeof DlJsonEditor> = {
    title: 'Library/Components/DlJsonEditor',
    component: DlJsonEditor
}

export default meta

export const JsonEditor: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlJsonEditor },
            setup() {
                const jsonModel = ref('')
                return {
                    jsonModel
                }
            },
            props: args,
            template: ` 
                 <div style="display: flex; flex-direction: column; justify-content: space-between; height: 50vh">
                    <div style="height: 200px">
                     <dl-json-editor v-bind="args" v-model="jsonModel" />
                    </div>
                     <span>JSON: {{ jsonModel }}</span>
                 </div>`
        }
    }
}

export const JsonEditorInDialogBox: Story = {
    render: (args, { argTypes }) => {
        return {
            components: {
                DlJsonEditor,
                DlDialogBox,
                DlDialogBoxHeader,
                DlButton
            },
            setup() {
                const dialogJsonModel = ref('')
                const dialogState = ref(false)
                return {
                    dialogJsonModel,
                    dialogState
                }
            },
            props: args,
            template: `
            <div style="display: flex; flex-direction: column; width: 200px">
               <dl-button @click="dialogState = !dialogState" style="margin-bottom: 20px"> JsonEditor </dl-button>
               <dl-dialog-box v-model="dialogState" volatile :width="700">
               <template #header>
                               <dl-dialog-box-header
                                   title="JsonEditor"
                                   @onClose="dialogState = false"
                               />
                           </template>
                           <template #body>
                           <div style="height: 200px;">
                           <dl-json-editor v-model="dialogJsonModel" />
                           </div>
                           </template>
                           </dl-dialog-box>
                           <span>Dialog JSON: {{ dialogJsonModel }}</span> 
            </div>
               `
        }
    }
}
