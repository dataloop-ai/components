import { mount } from '@vue/test-utils'
import {
    CalendarDate,
    CustomDate
} from '../../src/components/compound/DlDateTime/DlDatePicker/models'
import DlCalendar from '../../src/components/compound/DlDateTime/DlDatePicker/components/DlCalendar.vue'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

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
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    title: 'Calendar',
                    dates: calendarDates,
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should compute right weekNames', () => {
            expect(wrapper.vm.weekNames).toEqual([
                'Su',
                'Mo',
                'Tu',
                'We',
                'Th',
                'Fr',
                'Sa'
            ])
        })
        it('should compute right chevronStyle', () => {
            expect(wrapper.vm.chevronStyle).toEqual({
                color: 'var(--dl-color-darker)',
                cursor: 'pointer'
            })
        })
        describe('When emit dates upon clicking the dates', () => {
            beforeAll(() => {
                wrapper.vm.handleClick(customDate)
            })
            it('should the right model value data', function () {
                expect(wrapper.emitted()['update:model-value']).toEqual([
                    [
                        {
                            from: date,
                            to: date
                        }
                    ]
                ])
            })
            describe('When move mouse down', () => {
                beforeAll(() => {
                    wrapper.vm.handleMouseDown(customDate)
                })
                it('should ', function () {
                    expect(wrapper.emitted().mousedown).toEqual([[date]])
                })
            })
            describe('When mouse enter', () => {
                beforeAll(() => {
                    wrapper.vm.handleMouseEnter(customDate)
                })
                it('should ', function () {
                    expect(wrapper.emitted().mouseenter).toEqual([[date]])
                })
            })
        })
    })
    describe('When get styles according to the specific date, first date in the month', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    title: 'Calendar',
                    dates: calendarDates,
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })

        it('should compute right getDayStyle', () => {
            expect(wrapper.vm.getDayStyle(calendarDates[0])).toMatchObject({
                borderBottomLeftRadius: '11px',
                borderTopLeftRadius: '11px'
            })
        })
        it('should compute right getInnerDayStyle', () => {
            expect(wrapper.vm.getInnerDayStyle(calendarDates[0])).toEqual({
                color: 'var(--dell-gray-800)'
            })
        })
    })
    describe('When get styles according to the specific date, last date in the month', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    dates: calendarDates,
                    title: 'Calendar',
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })
        it('should compute right getDayStyle', () => {
            expect(
                wrapper.vm.getDayStyle(calendarDates[calendarDates.length - 1])
            ).toMatchObject({})
        })
        it('should compute right getInnerDayStyle', () => {
            expect(
                wrapper.vm.getInnerDayStyle(
                    calendarDates[calendarDates.length - 1]
                )
            ).toEqual({
                color: 'var(--dell-gray-800)'
            })
        })
    })
    describe('When get styles according to the specific date, selected date boundry', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    title: 'Calendar',
                    dates: calendarDates,
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })
        it('should compute right getDayStyle', () => {
            expect(wrapper.vm.getDayStyle(new CalendarDate(date))).toEqual({
                background:
                    'linear-gradient(to right, transparent 50%, var(--dell-blue-100) 50%)'
            })
        })
        it('should compute right getInnerDayStyle', () => {
            expect(wrapper.vm.getInnerDayStyle(new CalendarDate(date))).toEqual(
                {
                    backgroundColor: 'var(--dell-blue-500)',
                    color: 'var(--dell-white)',
                    borderRadius: '11px'
                }
            )
        })
    })
    describe('When get styles according to the specific date, start of the week', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    title: 'Calendar',
                    dates: calendarDates,
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })

        it('should compute right getDayStyle', () => {
            expect(wrapper.vm.getDayStyle(startOfTheWeek)).toEqual({
                borderBottomLeftRadius: '11px',
                borderTopLeftRadius: '11px'
            })
        })
        it('should compute right getInnerDayStyle', () => {
            expect(wrapper.vm.getInnerDayStyle(startOfTheWeek)).toEqual({
                color: 'var(--dell-gray-800)'
            })
        })
    })
    describe('When get styles according to the specific date, interval date + end of the week', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCalendar, {
                props: {
                    title: 'Calendar',
                    dates: calendarDates,
                    modelValue: {
                        from: date,
                        to: date2
                    }
                }
            })
        })

        it('should compute right getDayStyle', () => {
            expect(wrapper.vm.getDayStyle(endOfWeek)).toEqual({
                background:
                    'linear-gradient(to right, var(--dell-blue-100) 50%, transparent 50%)',
                borderBottomRightRadius: '11px',
                borderTopRightRadius: '11px'
            })
        })
        it('should compute right getInnerDayStyle', () => {
            expect(wrapper.vm.getInnerDayStyle(endOfWeek)).toEqual({
                backgroundColor: 'var(--dell-blue-500)',
                borderRadius: '11px',
                color: 'var(--dell-white)'
            })
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
