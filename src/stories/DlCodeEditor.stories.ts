import { DlCodeEditor } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { DlCodeEditorTheme } from '../types'

type Story = StoryObj<typeof DlCodeEditor>

const meta: Meta<typeof DlCodeEditor> = {
    title: 'Library/Components/DlCodeEditor',
    component: DlCodeEditor
}

export default meta

export const JSCodeEditor: Story = {
    args: {
        language: 'javascript',
        modelValue: `// this is a javascript example
function helloWorld() {
    console.log('Hello, World!')
}
helloWorld()`,
        theme: DlCodeEditorTheme.Light
    }
}
export const PythonCodeEditor: Story = {
    args: {
        language: 'python',
        modelValue: ` #this is a python example
def helloWorld():
    print('Hello, World!')

helloWorld()`,
        theme: DlCodeEditorTheme.Dark
    }
}
