import { ref } from 'vue-demi'
import { DlRange, DlThemeProvider } from '../'

export default {
    title: 'Library/Components/DlRange',
    component: DlRange,
    argTypes: {
        text: {
            name: 'text',
            type: { name: 'string', required: true },
            defaultValue: '',
            description: 'The range text',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        width: {
            name: 'width',
            type: { name: 'string', required: false },
            defaultValue: '100%',
            description: 'The range width',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            }
        },
        textColor: {
            name: 'textColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-darker',
            description: 'The color of the text',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-darker' }
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            description: 'The color of the range "fill" state',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Specifies if the range should be disabled or not',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        readonly: {
            name: 'readonly',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Specifies if the range should be readonly or not',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        min: {
            name: 'min',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 0,
            description: 'The range min value',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 0 }
            }
        },
        max: {
            name: 'max',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 10,
            description: 'The range max value',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 100 }
            }
        },
        step: {
            name: 'step',
            type: { name: 'number', required: false },
            control: 'number',
            defaultValue: 1,
            description: 'The range step value',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 1 }
            }
        },
        name: {
            name: 'name',
            type: { name: 'string', required: false },
            defaultValue: 'range',
            control: 'text',
            description:
                'The name of the input (used on direct form submission)',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlRange, DlThemeProvider },
    setup() {
        const range = ref({ min: 0, max: 100 })

        return {
            args,
            range
        }
    },
    template: `
    <div style="padding: 50px">
      <DlThemeProvider :isDark="false">
          <dl-range v-model="range" v-bind="args"/>
      </DlThemeProvider>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    text: 'range'
}
