import { mount } from '@vue/test-utils'
import DlTimeCounter from '../../src/components/DlTimePicker/DlTimeCounter.vue'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date(1990, 12, 1))

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
        jest.useRealTimers()
    })
})
