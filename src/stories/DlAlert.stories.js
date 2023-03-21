import { DlAlert, DlThemeProvider } from '../'

export default {
    title: 'Library/Components/DlAlert',
    component: DlAlert,
    argTypes: {
        type: {
            name: 'type',
            defaultValue: 'success',
            description: 'Alert type',
            control: {
                type: 'radio',
                options: ['success', 'info', 'warning', 'error']
            },
            table: {
                type: { summary: ['success', 'info', 'warning', 'error'] },
                defaultValue: { summary: 'success' }
            }
        },
        textColor: {
            name: 'textColor',
            defaultValue: '',
            description: 'Text color',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: 'dl-color-text-darker-buttons' }
            }
        },
        iconColor: {
            name: 'iconColor',
            defaultValue: '',
            description: 'Alert icons color',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'color' },
                defaultValue: { summary: 'dl-color-text-darker-buttons' }
            }
        },
        fluid: {
            name: 'fluid',
            defaultValue: false,
            control: 'boolean',
            description: 'Alert full width prop',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        closable: {
            name: 'closable',
            defaultValue: false,
            control: 'boolean',
            description: 'Display the close button',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        text: {
            name: 'text',
            defaultValue: '',
            control: 'text',
            description: 'Alert text',
            table: {
                type: { summary: String },
                defaultValue: { summary: false }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlAlert, DlThemeProvider },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
      <DlThemeProvider :isDark="false">
          <dl-alert v-bind="args"/>
      </DlThemeProvider>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    text: 'Alert text'
}

const FluidTemplate = (args) => ({
    components: { DlAlert, DlThemeProvider },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
      <DlThemeProvider :isDark="false">
          <dl-alert
              fluid
              text="Alert text"
              v-bind="args"
          />
      </DlThemeProvider>
    </div>
   `
})

export const Fluid = FluidTemplate.bind({})
Fluid.args = {
    text: 'Alert text',
    fluid: true
}

const ClosableTemplate = (args) => ({
    components: { DlAlert, DlThemeProvider },
    setup() {
        return {
            args
        }
    },
    template: `
    <div style="padding: 20px">
      <DlThemeProvider :isDark="false">
          <dl-alert
              closable
              text="Alert text"
              v-bind="args"
          />
      </DlThemeProvider>
    </div>
   `
})

export const Closable = ClosableTemplate.bind({})
Closable.args = {
    text: 'Alert text',
    closable: true
}
