import { DlColorPicker } from '../components'
import { ref } from 'vue-demi'
import { action } from '@storybook/addon-actions'
import { defaultColors } from '../components/DlColorPicker/constants'

export default {
    title: 'Library/Components/DlColorPicker',
    component: DlColorPicker,
    argTypes: {
        defaultColors: {
            name: 'defaultColors',
            defaultValue: defaultColors,
            control: 'object',
            description: 'Default colors to show in the color picker',
            table: {
                type: { summary: Array },
                defaultValue: { summary: defaultColors }
            }
        },
        color: {
            name: 'color',
            defaultValue: '#000000',
            control: 'text',
            description: 'The color selected by default',
            table: {
                type: { summary: String },
                defaultValue: { summary: '#000000' }
            }
        }
    }
}

const Template = (args) => {
    return {
        components: { DlColorPicker },
        setup() {
            const colorsHistory = ref([])

            const updateColor = (e) => {
                colorsHistory.value = [
                    `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`,
                    ...colorsHistory.value
                ].slice(0, 7)
            }

            return { args, colorsHistory, updateColor }
        },
        template: `
    <div style="padding: 50px;">
        <DlColorPicker v-bind="args" @changeColor="changeColor" @updateColor="updateColor" :colorsHistory="colorsHistory" />
    </div>
  `,
        methods: {
            changeColor: action('changeColor'),
            updateColor: action('updateColor')
        }
    }
}

export const Preview = Template.bind({})
Preview.args = {
    color: '#000000'
}
