import { mount } from '@vue/test-utils'
import DlTimeCounter from '../../src/components/compound/DlDateTime/DlTimePicker/components/DlTimeCounter.vue'
import { describe, it, expect, afterAll, vi, beforeAll } from 'vitest'

vi.useFakeTimers('modern')
vi.setSystemTime(new Date(1990, 12, 1))

describe('Time Counter', () => {
    describe('When set time', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTimeCounter)
        })

        it('should set the hour', () => {
            wrapper.vm.handleHourClick('14')
            expect(wrapper.emitted()['set-hour']).toEqual([['14']])
        })
        it('should set the miunte', () => {
            wrapper.vm.handleMinuteClick('14')
            expect(wrapper.emitted()['set-minute']).toEqual([['14']])
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
