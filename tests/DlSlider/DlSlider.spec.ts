import { mount, shallowMount } from '@vue/test-utils'
import { DlSlider } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSlider', () => {
    describe('When mounting', () => {
        const _slimSlider = '[data-test="slim-slider"]'
        const _slimSliderInput = '[data-test="slim-slider-input"]'
        const _nonSlimSlider = '[data-test="non-slim-slider"]'
        const _nonSlimSliderInput = '[data-test="non-slim-slider-input"]'
        const _nonSlimSliderBtn = '[data-test="non-slim-slider-button"]'
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
            expect(wrapper.find(_nonSlimSlider).exists()).toBe(true)
            expect(wrapper.find(_nonSlimSliderInput).exists()).toBe(true)
            expect(wrapper.find(_nonSlimSliderBtn).exists()).toBe(true)
        })
        describe('When emit click event on nonSlimSliderBtn', () => {
            let nonSlimSliderBtn: any
            beforeAll(async () => {
                nonSlimSliderBtn = wrapper.find(_nonSlimSliderBtn)
                await nonSlimSliderBtn.trigger('click')
            })

            it('should update the model value', async function () {
                wrapper._emitted = {}
                await wrapper.setProps({
                    modelValue: 0
                })

                await nonSlimSliderBtn.trigger('click')

                await wrapper.vm.$nextTick()
                expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                    -10
                ])
                expect(wrapper.emitted()['change'][0]).toEqual([-10])
            })
        })
        describe('When emit events nonSlimSliderInput', () => {
            let nonSlimSliderInput: any
            beforeAll(async () => {
                nonSlimSliderInput = wrapper.get(_nonSlimSliderInput)
                await nonSlimSliderInput.trigger('focus')
                await nonSlimSliderInput.trigger('blur')

                await wrapper.setProps({
                    disabled: true
                })
            })

            it('should _nonSlimSliderInput disabled', function () {
                expect(
                    wrapper.find(_nonSlimSliderInput).attributes().disabled
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
            it('should mount slimSlider and slimSliderInput', async function () {
                await wrapper.setProps({ slim: true })

                expect(wrapper.find(_slimSlider).exists()).toBe(true)
                expect(wrapper.find(_slimSliderInput).exists()).toBe(true)
            })
            it('should not mount nonSlimSlider', function () {
                expect(wrapper.find(_nonSlimSlider).exists()).toBe(false)
            })
        })
    })
})
