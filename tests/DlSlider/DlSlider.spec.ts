import { mount } from '@vue/test-utils'
import { DlSlider } from '../../src'

describe('DlSlider', () => {
    it('should behave accordingly', async () => {
        const wrapper = mount(DlSlider, {
            props: {
                width: '500px',
                color: 'red',
                textColor: 'orange',
                min: -10,
                max: 10,
                step: 2,
                text: 'test slider'
            }
        })

        expect(wrapper.vm.initialValue).toBe(-10)

        const _editableSlider = '[data-test="editable-slider"]'
        const _editableSliderInput = '[data-test="editable-slider-input"]'
        const _nonEditableSlider = '[data-test="non-editable-slider"]'
        const _nonEditableSliderInput =
            '[data-test="non-editable-slider-input"]'
        const _nonEditableSliderBtn = '[data-test="non-editable-slider-btn"]'

        expect(wrapper.text()).toContain('test slider')

        expect(wrapper.find(_nonEditableSlider).exists()).toBe(true)
        expect(wrapper.find(_nonEditableSliderInput).exists()).toBe(true)
        expect(wrapper.find(_nonEditableSliderBtn).exists()).toBe(true)

        const nonEditableSliderBtn = wrapper
            .get(_nonEditableSliderBtn)
            .find('.dl-button')
        await nonEditableSliderBtn.trigger('click')

        expect(wrapper.emitted()['update:model-value']).not.toBeDefined()

        await wrapper.setProps({
            modelValue: 0
        })

        await nonEditableSliderBtn.trigger('click')
        expect(wrapper.emitted()['update:model-value'][0]).toEqual([-10])

        const nonEditableSliderInput = wrapper.get(_nonEditableSliderInput)

        await nonEditableSliderInput.trigger('focus')
        await nonEditableSliderInput.trigger('blur')

        await wrapper.setProps({
            disabled: true
        })
        expect(
            wrapper.find(_nonEditableSliderInput).attributes().disabled
        ).toBeDefined()

        await wrapper.setProps({
            percentage: true,
            disabled: false
        })

        await wrapper.setProps({ modelValue: null })
        expect(wrapper.vm.value).toBe(-10)

        await wrapper.setProps({ modelValue: 1 })
        expect(wrapper.vm.value).toBe(1)

        await wrapper.setProps({ editable: true })

        expect(wrapper.find(_nonEditableSlider).exists()).toBe(false)
        expect(wrapper.find(_editableSlider).exists()).toBe(true)
        expect(wrapper.find(_editableSliderInput).exists()).toBe(true)

        const editableSliderInput = wrapper.get(_editableSliderInput)

        await editableSliderInput.setValue(1)
        expect(wrapper.emitted()['update:model-value'][1]).toEqual([1])
        expect(wrapper.vm.value).toEqual(1)
    })

    it('should set the correct initial value', () => {
        const wrapper = mount(DlSlider, {
            props: {
                text: 'test slider',
                modelValue: 5
            }
        })

        expect(wrapper.vm.initialValue).toBe(5)
    })
})
