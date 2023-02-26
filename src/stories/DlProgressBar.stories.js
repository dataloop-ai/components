import { DlProgressBar } from '..'

export default {
    title: 'Library/Components/DlProgressBar',
    component: DlProgressBar,
    argTypes: {
        color: {
            description: 'The color of the progress bar',
            type: {
                name: 'string',
                required: false
            }
        },
        showPercentage: {
            description:
                'The percentage sign will be displayed next to the value',
            type: {
                name: 'boolean',
                required: false
            }
        },
        showValue: {
            description:
                'The current value will be shown next to the progress bar',
            type: {
                name: 'boolean',
                required: false
            }
        },
        width: {
            name: 'width',
            description: 'The width of the popup',
            defaultValue: '',
            control: {
                type: 'text'
            }
        },
        value: {
            description: 'The value shown in the progress bar',
            control: {
                type: 'number',
                min: 0,
                max: 1,
                step: 0.01
            }
        }
    }
}

const Template = (args) => ({
    components: { DlProgressBar },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <DlProgressBar label="Progress bar" v-bind="args" />
            <DlProgressBar indeterminate label="Indeterminate progress bar" v-bind="args" />
        </div>
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    width: '200px',
    value: 0.5,
    showValue: true,
    showPercentage: true
}
