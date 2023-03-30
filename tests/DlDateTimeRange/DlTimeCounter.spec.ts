import { mount } from '@vue/test-utils'
import DlTimeCounter from '../../src/components/compound/DlDateTime/DlTimePicker/components/DlTimeCounter.vue'
import { describe, it, expect, afterAll, vi } from 'vitest'

vi.useFakeTimers('modern')
vi.setSystemTime(new Date(1990, 12, 1))

describe('Time Counter', () => {
    it('should set the hour', () => {
        const wrapper = mount(DlTimeCounter)
        wrapper.vm.handleHourClick('14')
        expect(wrapper.emitted()['set-hour']).toEqual([['14']])
    })
    it('should set the miunte', () => {
        const wrapper = mount(DlTimeCounter)
        wrapper.vm.handleMinuteClick('14')
        expect(wrapper.emitted()['set-minute']).toEqual([['14']])
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
