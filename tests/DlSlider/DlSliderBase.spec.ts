import { mount } from '@vue/test-utils'
import { DlSliderBase } from '../../src/components/DlSlider/components'
import touchPanDirective from '../../src/directives/TouchPan'
import { describe, it, expect } from 'vitest'

describe('DlSliderBase', () => {
    const _slider = '[data-test="slider"]'
    const _trackContainer = '[data-test="track-container"]'

    it('should behave accordingly', async () => {
        const wrapper = mount(DlSliderBase, {
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

        await wrapper.find(_trackContainer).trigger('mousedown')
        expect(wrapper.emitted()['update:model-value'].length).toBe(1)

        wrapper.setProps({
            step: 0
        })

        // @ts-ignore
        expect(wrapper.vm.computedStep).toBe(1)

        await wrapper.setProps({
            disabled: true
        })

        expect(wrapper.find(_slider).attributes()['aria-disabled']).toBe('true')

        await wrapper.setProps({
            disabled: false,
            readonly: true
        })
        expect(wrapper.find(_slider).attributes()['aria-readonly']).toBe('true')

        await wrapper.setProps({
            disabled: true
        })
        await wrapper.find(_trackContainer).trigger('mousedown')
        expect(wrapper.emitted()['update:model-value'].length).toBe(1)

        await wrapper.find(_trackContainer).trigger('mousedown')
        wrapper.unmount()
    })
})
