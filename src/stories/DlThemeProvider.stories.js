import { DlThemeProvider, DlButton } from '..'
import { colors } from '../assets/globalsKeys'

export default {
    title: 'Library/Components/DlThemeProvider',
    component: DlThemeProvider,
    argTypes: {
        isDark: {
            name: 'isDark',
            type: { name: 'boolean', required: false },
            description: 'Switch to dark theme',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlThemeProvider, DlButton },
    setup() {
        return { args, colors }
    },
    template: `
    <div style="padding: 50px;">
        <div v-for="item in colors">
            <p style="display: inline;">*</p> <DlButton flat :textColor="item" :label="item" />
        </div>
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {}
