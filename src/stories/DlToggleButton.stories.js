import { DlToggleButton } from '..'

export default {
    title: 'Library/Components/DlToggleButton',
    component: DlToggleButton
}
const Template = (args) => ({
    components: { DlToggleButton },
    setup() {
        return { args }
    },
    template: `
        <div style="padding: 50px">
        <DlToggleButton v-bind="args"/>
        </div>`
})

export const DlToggleButtonTemplate = Template.bind({})
DlToggleButtonTemplate.args = {
    options: [
        { label: 'Button 1', value: 1 },
        { label: 'Button 2', value: 2 },
        { label: 'Button 3', value: 3 }
    ]
}
