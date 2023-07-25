import { mount } from '@vue/test-utils'
import { DlSliderInput } from '../../src/components/compound/DlSlider/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSliderInput', () => {
    describe('When mounting', () => {
        let wrapper: any
        const _sliderInput = 'input[type="number"]'

        beforeAll(async () => {
            wrapper = mount(DlSliderInput, {
                props: {
                    min: -10,
                    max: 10,
                    modelValue: 0
                }
            })
            // @ts-ignore
            await window.delay(300)
        })

        it('should mount sliderInput', function () {
            expect(wrapper.find(_sliderInput).exists()).toBe(true)
        })

        describe('When change input value', () => {
            let sliderInput: any

            beforeAll(async () => {
                sliderInput = wrapper.find(_sliderInput)

                await sliderInput.setValue('')

                // @ts-ignore
                await window.delay(300)
            })
            it('should not defined model value', function () {
                expect(
                    wrapper.emitted()['update:model-value']
                ).not.toBeDefined()
            })
            describe('When emitting a value', () => {
                beforeAll(async () => {
                    await sliderInput.setValue('1')

                    // @ts-ignore
                    await window.delay(300)
                    // todo: this became flaky... need to investigate
                    await wrapper.vm.$nextTick()
                })

                it('should have the right model value', function () {
                    expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                        1
                    ])
                })
            })
        })
    })
})
