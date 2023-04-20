import { mount } from '@vue/test-utils'
import {
    CustomDate,
    CalendarDate
} from '../../src/components/compound/DlDateTime/DlDatePicker/models'
import DlCalendar from '../../src/components/compound/DlDateTime/DlDatePicker/components/DlCalendar.vue'
import { describe, it, expect, afterAll, vi } from 'vitest'

const month = 11
const year = 1990
const calendarDates: CalendarDate[] = []
const lastDayOfTheMonth = new CustomDate()
    .year(year)
    .month(month)
    .endOf('month')
    .date()
const startOfTheWeek = new CustomDate()
    .year(year)
    .month(month)
    .date(5)
    .startOf('week')
const endOfWeek = new CustomDate()
    .year(year)
    .month(month)
    .date(15)
    .endOf('week')

for (let i = 1; i <= lastDayOfTheMonth; i++) {
    calendarDates.push(new CalendarDate(new Date(year, month, i)))
}

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(year, month, 10))

const date = new Date(year, month, 5)
const date2 = new Date(year, month, 15)
const customDate = new CustomDate(date)

describe('DlCalendar', () => {
    it('should return computed properties', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                title: 'Calendar',
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
                title: 'Calendar',
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

    it('should get styles according to the specific date, first date in the month', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                title: 'Calendar',
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        expect(wrapper.vm.getDayStyle(calendarDates[0])).toMatchObject({
            borderBottomLeftRadius: '11px',
            borderTopLeftRadius: '11px'
        })

        expect(wrapper.vm.getInnerDayStyle(calendarDates[0])).toEqual({})
    })

    it('should get styles according to the specific date, last date in the month', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                dates: calendarDates,
                title: 'Calendar',
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })

        expect(
            wrapper.vm.getDayStyle(calendarDates[calendarDates.length - 1])
        ).toMatchObject({})

        expect(
            wrapper.vm.getInnerDayStyle(calendarDates[calendarDates.length - 1])
        ).toEqual({})
    })

    it('should get styles according to the specific date, selected date boundry', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                title: 'Calendar',
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        expect(wrapper.vm.getDayStyle(new CalendarDate(date))).toEqual({
            background:
                'linear-gradient(to right, transparent 50%, var(--dl-date-picker-selected-strip) 50%)'
        })

        expect(wrapper.vm.getInnerDayStyle(new CalendarDate(date))).toEqual({
            backgroundColor: 'var(--dl-color-secondary)',
            color: 'var(--dl-color-text-buttons)',
            borderRadius: '11px'
        })
    })

    it('should get styles according to the specific date, start of the week', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                title: 'Calendar',
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        expect(wrapper.vm.getDayStyle(startOfTheWeek)).toEqual({
            background: 'var(--dl-date-picker-selected-strip)',
            borderBottomLeftRadius: '11px',
            borderTopLeftRadius: '11px'
        })

        expect(wrapper.vm.getInnerDayStyle(startOfTheWeek)).toEqual({})
    })

    it('should get styles according to the specific date, interval date + end of the week', () => {
        const wrapper = mount(DlCalendar, {
            props: {
                title: 'Calendar',
                dates: calendarDates,
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })

        expect(wrapper.vm.getDayStyle(endOfWeek)).toEqual({
            background:
                'linear-gradient(to right, var(--dl-date-picker-selected-strip) 50%, transparent 50%)',
            borderBottomRightRadius: '11px',
            borderTopRightRadius: '11px'
        })

        expect(wrapper.vm.getInnerDayStyle(endOfWeek)).toEqual({
            backgroundColor: 'var(--dl-color-secondary)',
            borderRadius: '11px',
            color: 'var(--dl-color-text-buttons)'
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
