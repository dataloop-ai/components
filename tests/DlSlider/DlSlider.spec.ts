import { mount, shallowMount } from '@vue/test-utils'
import { DlSlider } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSlider', () => {
    describe('When mounting', () => {
        const _editableSlider = '[data-test="editable-slider"]'
        const _editableSliderInput = '[data-test="editable-slider-input"]'
        const _nonEditableSlider = '[data-test="non-editable-slider"]'
        const _nonEditableSliderInput =
            '[data-test="non-editable-slider-input"]'
        const _nonEditableSliderBtn = '[data-test="non-editable-slider-btn"]'
        let wrapper: any

        beforeAll(() => {
            wrapper = shallowMount(DlSlider, {
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
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should set the correct initial value', function () {
            expect(wrapper.vm.initialValue).toBe(-10)
        })
        it('should mount the elements', function () {
            expect(wrapper.find(_nonEditableSlider).exists()).toBe(true)
            expect(wrapper.find(_nonEditableSliderInput).exists()).toBe(true)
            expect(wrapper.find(_nonEditableSliderBtn).exists()).toBe(true)
        })
        describe('When emit click event on nonEditableSliderBtn', () => {
            let nonEditableSliderBtn: any
            beforeAll(async () => {
                nonEditableSliderBtn = wrapper.find(_nonEditableSliderBtn)
                await nonEditableSliderBtn.trigger('click')
            })

            it('should not update model value ', function () {
                expect(
                    wrapper.emitted()['update:model-value']
                ).not.toBeDefined()
            })
            it('should update the model value', async function () {
                await wrapper.setProps({
                    modelValue: 0
                })

                await nonEditableSliderBtn.trigger('click')
                expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                    -10
                ])
            })
        })
        describe('When emit events nonEditableSliderInput', () => {
            let nonEditableSliderInput: any
            beforeAll(async () => {
                nonEditableSliderInput = wrapper.get(_nonEditableSliderInput)
                await nonEditableSliderInput.trigger('focus')
                await nonEditableSliderInput.trigger('blur')

                await wrapper.setProps({
                    disabled: true
                })
            })

            it('should _nonEditableSliderInput disabled', function () {
                expect(
                    wrapper.find(_nonEditableSliderInput).attributes().disabled
                ).toBeDefined()
            })
            it('should have the right value', async function () {
                await wrapper.setProps({
                    percentage: true,
                    disabled: false
                })

                await wrapper.setProps({ modelValue: null })
                expect(wrapper.vm.value).toBe(-10)
            })
            it('should have the right value', async function () {
                await wrapper.setProps({ modelValue: 1 })
                expect(wrapper.vm.value).toBe(1)
            })
            it('should mount editableSlider and editableSliderInput', async function () {
                await wrapper.setProps({ editable: true })

                expect(wrapper.find(_editableSlider).exists()).toBe(true)
                expect(wrapper.find(_editableSliderInput).exists()).toBe(true)
            })
            it('should not mount nonEditableSlider', function () {
                expect(wrapper.find(_nonEditableSlider).exists()).toBe(false)
            })
        })
        describe('When set value of editableSliderInput', () => {
            let editableSliderInput: any

            beforeAll(async () => {
                editableSliderInput =
                    wrapper.findComponent(_editableSliderInput)
                await editableSliderInput.setValue(1)
            })
            it('should have the right model value', function () {
                expect(wrapper.emitted()['update:model-value'][1]).toEqual([1])
            })
            it('should have the right value', function () {
                expect(wrapper.vm.value).toEqual(1)
            })
        })
    })
})
