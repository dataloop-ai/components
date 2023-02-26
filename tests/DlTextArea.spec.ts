import { mount } from '@vue/test-utils'
import { DlTextArea } from '../src/components'

describe('DlTextArea component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlTextArea)

        expect(wrapper.exists()).toBe(true)
    })

    it('should emit the events', async () => {
        const wrapper = mount(DlTextArea)

        await wrapper.find('textarea').trigger('input')

        const inputEvent: any = wrapper.emitted('input')
        expect(inputEvent).toHaveLength(1)

        const updateModelEvent: any = wrapper.emitted('update:model-value')
        expect(updateModelEvent).toHaveLength(1)

        await wrapper.find('textarea').trigger('blur')

        const blurEvent: any = wrapper.emitted('blur')
        expect(blurEvent).toHaveLength(1)

        await wrapper.find('textarea').trigger('focus')

        const focusEvent: any = wrapper.emitted('focus')
        expect(focusEvent).toHaveLength(1)
    })

    it('should set the passed textarea width', async () => {
        const wrapper = mount(DlTextArea, {
            props: { width: '400px' }
        })
        expect(wrapper.vm.cssVars['--dl-textarea-width']).toEqual('400px')
        await wrapper.setProps({ width: null })
        expect(wrapper.vm.cssVars['--dl-textarea-width']).toEqual('auto')
    })
})
