import { ref } from 'vue-demi'
import { DlSlider } from '../'

export default {
    title: 'Library/Components/DlSlider',
    component: DlSlider,
    argTypes: {
        text: {
            name: 'text',
            type: { name: 'string', required: true },
            defaultValue: '',
            description: 'The slider text',
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
            description: 'The slider width',
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
            description: 'The color of the slider "fill" state',
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
            description: 'Specifies if the slider should be disabled or not',
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
            description: 'Specifies if the slider should be readonly or not',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        editable: {
            name: 'editable',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Specifies the component variant',
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
            description: 'The slider min value',
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
            description: 'The slider max value',
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
            description: 'The slider step value',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 1 }
            }
        },
        name: {
            name: 'name',
            type: { name: 'string', required: false },
            defaultValue: 'slider',
            control: 'text',
            description:
                'The name of the input (used on direct form submission)',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: null }
            }
        },
        hint: {
            name: 'hint',
            type: { name: 'string', required: false },
            defaultValue: null,
            control: 'text',
            description: 'A tooltip that display information about the slider',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSlider },
    setup() {
        const slider = ref(0)

        return {
            args,
            slider
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-slider
            text="slider"
            v-model.number="slider" 
            v-bind="args"
        />
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    text: 'slider'
}

const HintTemplate = (args) => ({
    components: { DlSlider },
    setup() {
        const slider = ref(0)

        return {
            args,
            slider
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-slider
            text="slider"
            hint="This is a hint!"
            v-model.number="slider" 
            v-bind="args"
        />
    </div>
   `
})

export const PreviewWithHint = HintTemplate.bind({})
PreviewWithHint.args = {
    text: 'slider',
    hint: 'This is a hint!'
}

const DisabledTemplate = (args) => ({
    components: { DlSlider },
    setup() {
        const slider = ref(0)

        return {
            args,
            slider
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-slider
            disabled
            text="slider"
            v-model.number="slider" 
            v-bind="args"
        />
    </div>
   `
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    text: 'slider',
    disabled: true
}

const EditableTemplate = (args) => ({
    components: { DlSlider },
    setup() {
        const slider = ref(0)

        return {
            args,
            slider
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-slider
            editable
            text="slider"
            v-model.number="slider" 
            v-bind="args"
        />
    </div>
   `
})

export const Editable = EditableTemplate.bind({})
Editable.args = {
    text: 'slider',
    editable: true
}

const SnapTemplate = (args) => ({
    components: { DlSlider },
    setup() {
        const slider = ref(0)

        return {
            args,
            slider
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-slider
            snap
            text="slider"
            v-model.number="slider" 
            v-bind="args"
        />
    </div>
   `
})

export const Snap = SnapTemplate.bind({})
Snap.args = {
    text: 'slider',
    snap: true
}
