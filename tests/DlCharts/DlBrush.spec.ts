import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DlBrush from '../../src/components/compound/DlCharts/components/DlBrush.vue'

describe('DlBrush', () => {
    it('return computed props', () => {
        const wrapper = mount(DlBrush, {
            props: {
                thumbSize: 12
            }
        })
        // const events = wrapper.vm.getEvents('min')
        // expect(
        //     events.onFocus &&
        //         events.onBlur &&
        //         events.onKeyup
        // ).toBeTruthy()
    })

    it('should update its value on keydown', () => {
        const wrapper = mount(DlBrush)
        // wrapper.vm.updateValue()
    })
})
