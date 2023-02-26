import { mount } from '@vue/test-utils'
import { CalendarDate } from '../../src/components/DlDatePicker/classes/CalendarDate'
import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'
import DlCalendar from '../../src/components/DlDatePicker/DlCalendar.vue'

const calendarDates: CalendarDate[] = []
for (let i = 1; i < 30; i++) {
    calendarDates.push(new CalendarDate(new Date(1990, 11, i).toString()))
}

jest.useFakeTimers('modern')
jest.setSystemTime(new Date(1990, 12, 1))

const date = new Date(1990, 12, 1)
const date2 = new Date(1990, 12, 2)
const customDate = new CustomDate(date.toString())
const calendarDate = new CalendarDate(customDate)

describe('DlCalendar', () => {
    it('should return computed properties', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                dates: calendarDates
            }
        })

        expect(wrapper.vm.weekNames).toEqual([
            'Su',
            'Mo',
            'Tu',
            'We',
            'Th',
            'Fr',
            'Sa'
        ])

        expect(wrapper.vm.chevronStyle).toEqual({
            color: 'var(--dl-color-darker)',
            cursor: 'pointer'
        })
    })

    it('should emit dates upon clicking the dates', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        wrapper.vm.handleClick(customDate)
        expect(wrapper.emitted()['update:modelValue']).toEqual([
            [
                {
                    from: date,
                    to: date
                }
            ]
        ])

        wrapper.vm.handleMouseDown(customDate)
        expect(wrapper.emitted().mousedown).toEqual([[date]])
        wrapper.vm.handleMouseEnter(customDate)
        expect(wrapper.emitted().mouseenter).toEqual([[date]])
    })

    it('should get styles according to the specific date', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        expect(wrapper.vm.getDayStyle(calendarDate)).toEqual({
            background:
                'linear-gradient(to right, transparent 50%, rgba(52, 82, 255, 0.1) 50%)'
        })

        expect(wrapper.vm.getInnerDayStyle(calendarDate)).toEqual({
            backgroundColor: 'var(--dl-color-secondary)',
            color: 'var(--dl-color-text-buttons)',
            borderRadius: '11px'
        })
    })

    afterAll(() => {
        jest.useRealTimers()
    })
})
