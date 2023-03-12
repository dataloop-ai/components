import { mount } from '@vue/test-utils'
import DlMonthCalendar from '../../src/components/DlDatePicker/DlMonthCalendar.vue'
import { CalendarDate } from '../../src/components/DlDatePicker/classes/CalendarDate'
import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'
import { describe, it, expect, afterAll, vi } from 'vitest'

const date = new Date(1990, 12, 1)

vi.useFakeTimers('modern')
vi.setSystemTime(new Date(date))

describe('DlMonthCalendar', () => {
    it('should emit date on mousedown', () => {
        const wrapper = mount(DlMonthCalendar, {
            props: {
                modelValue: date
            }
        })
        wrapper.vm.handleMousedown(0)
        expect(wrapper.emitted().mousedown).toEqual([[date]])
    })

    it('should emit date mouseenter', () => {
        const wrapper = mount(DlMonthCalendar, {
            props: {
                modelValue: date
            }
        })
        wrapper.vm.handleMouseenter(0)
        expect(wrapper.emitted().mouseenter).toEqual([[date]])
    })

    it('should emit date on click', () => {
        const wrapper = mount(DlMonthCalendar, {
            props: {
                modelValue: date
            }
        })
        wrapper.vm.handleClick(0)
        expect(wrapper.emitted()['update:modelValue']).toEqual([
            [
                {
                    from: date,
                    to: date
                }
            ]
        ])
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
