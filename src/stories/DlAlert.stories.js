import { DlAlert, DlThemeProvider } from '../'

export default {
    title: 'Library/Components/DlAlert',
    component: DlAlert,
    argTypes: {
        type: {
            name: 'type',
            description: 'Alert type',
            options: ['success', 'info', 'warning', 'error'],
            control: {
                type: 'radio'
            },
            table: {
                type: { summary: ['success', 'info', 'warning', 'error'] }
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
        },
        confirmClose: {
            name: 'confirmClose',
            defaultValue: false,
            control: 'boolean',
            description: 'Show confirmation dialog before closing',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        confirmCloseHeader: {
            name: 'confirmCloseHeader',
            defaultValue: 'Are you sure?',
            control: 'text',
            description: 'Header text for confirmation dialog',
            table: {
                type: { summary: String },
                defaultValue: {
                    summary: 'Are you sure?'
                }
            }
        },
        confirmCloseMessage: {
            name: 'confirmCloseMessage',
            defaultValue: '',
            control: 'text',
            description: 'Message text for confirmation dialog',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
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
    text: 'Alert text',
    type: 'info'
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
    fluid: true,
    type: 'info'
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
    closable: true,
    type: 'info'
}

const ConfirmCloseTemplate = (args) => ({
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
              :confirm-close="true"
              text="Click the X button to see the confirmation dialog before closing."
              v-bind="args"
          />
      </DlThemeProvider>
    </div>
   `
})

export const WithConfirmation = ConfirmCloseTemplate.bind({})
WithConfirmation.args = {
    text: 'Click the X button to see the confirmation dialog before closing.',
    closable: true,
    confirmClose: true,
    type: 'warning',
    fluid: true
}

const CustomConfirmTemplate = (args) => ({
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
              :confirm-close="true"
              v-bind="args"
          />
      </DlThemeProvider>
    </div>
   `
})

export const CustomConfirmation = CustomConfirmTemplate.bind({})
CustomConfirmation.args = {
    text: 'Custom confirmation dialog with custom header and message.',
    closable: true,
    confirmClose: true,
    confirmCloseHeader: 'Custom Dismiss Alert',
    confirmCloseMessage: 'This is a custom confirmation message.',
    type: 'error',
    fluid: true
}
