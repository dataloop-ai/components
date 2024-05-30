import { VueWrapper, mount } from '@vue/test-utils'
import { DlSliderBase } from '../../src/components/compound/DlSlider/components'
import touchPanDirective from '../../src/directives/TouchPan'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSliderBase', () => {
    const _slider = '[data-test="slider"]'
    const _trackContainer = '[data-test="track-container"]'

    describe('When mounting', () => {
        let wrapper: VueWrapper<any>

        beforeAll(() => {
            wrapper = mount(DlSliderBase, {
                props: {
                    min: -10,
                    max: 10,
                    step: 1,
                    modelValue: 0
                },
                attachTo: document.body,
                global: {
                    directives: {
                        touchPan: touchPanDirective as any
                    }
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        describe('When emitted slider events', () => {
            it('should the right model value length', async function () {
                const elem = await wrapper.find(_trackContainer)
                await elem.trigger('mousedown')
                expect(wrapper.emitted()['update:model-value'].length).toBe(1)
            })
            it('should the right model value length', async function () {
                await wrapper.setProps({
                    disabled: true
                })
                await wrapper.find(_trackContainer).trigger('mousedown')
                expect(wrapper.emitted()['update:model-value'].length).toBe(1)
            })
        })
        describe('When change prop', () => {
            it('should the right compute step prop', function () {
                wrapper.setProps({
                    step: 0
                })

                // @ts-ignore
                expect(wrapper.vm.computedStep).toBe(1)
            })
            it('should aria-disabled to be true', async function () {
                await wrapper.setProps({
                    disabled: true
                })

                expect(
                    wrapper.find(_slider).attributes()['aria-disabled']
                ).toBe('true')
            })
            it('should aria-readonly to be true', async function () {
                await wrapper.setProps({
                    disabled: false,
                    readonly: true
                })
                expect(
                    wrapper.find(_slider).attributes()['aria-readonly']
                ).toBe('true')
            })
        })
    })
})
