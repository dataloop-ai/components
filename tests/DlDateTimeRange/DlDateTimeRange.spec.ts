import { mount } from '@vue/test-utils'
import { CustomDate } from '../../src/components/compound/DlDateTime/DlDatePicker/models/CustomDate'
import { DlDateTimeRange } from '../../src/components'
import { describe, it, expect, afterAll, vi } from 'vitest'
import {
    DayTypeOption,
    MonthTypeOption
} from '../../src/components/compound/DlDateTime/DlDateTimeRange/types'

const date1 = new Date(1990, 12, 1)
const date2 = new Date(1990, 12, 2)

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(date1))

describe('Date Time Range', () => {
    it('should select the current day', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const today = wrapper.vm.sidebarDayOptions[0] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(today)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: today.value?.from, to: today.value?.to }
        ])
    })

    it('should update the type to month', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const customByMonth = wrapper.vm.sidebarDayOptions[
            wrapper.vm.sidebarDayOptions.length - 1
        ] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(customByMonth)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: customByMonth.value?.from, to: customByMonth.value?.to }
        ])
        expect(wrapper.emitted()['set-type']).toEqual([['month']])
    })

    it('should select the previous day', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const yesterday = wrapper.vm.sidebarDayOptions[1] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(yesterday)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: yesterday.value?.from, to: yesterday.value?.to }
        ])
    })

    it('should select the last 7 days', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const oneWeekAgo = wrapper.vm.sidebarDayOptions[2] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(oneWeekAgo)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: oneWeekAgo.value?.from, to: oneWeekAgo.value?.to }
        ])
    })

    it('should select the last 14 days', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const twoWeeksAgo = wrapper.vm.sidebarDayOptions[3] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(twoWeeksAgo)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: twoWeeksAgo.value?.from, to: twoWeeksAgo.value?.to }
        ])
    })

    it('should select the last 30 days', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const oneMonthAgo = wrapper.vm.sidebarDayOptions[4] as DayTypeOption
        wrapper.vm.handleDayTypeOptionClick(oneMonthAgo)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: oneMonthAgo.value?.from, to: oneMonthAgo.value?.to }
        ])
    })

    it('should select the current month', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const thisMonth = wrapper.vm.sidebarMonthOptions[0] as MonthTypeOption
        wrapper.vm.handleMonthTypeOptionClick(thisMonth)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: thisMonth.value?.from, to: thisMonth.value?.to }
        ])
    })

    it('should select the last month', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const lastMonth = wrapper.vm.sidebarMonthOptions[1] as MonthTypeOption
        wrapper.vm.handleMonthTypeOptionClick(lastMonth)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: lastMonth.value?.from, to: lastMonth.value?.to }
        ])
    })

    it('should select the last 3  months', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const last3Months = wrapper.vm.sidebarMonthOptions[2] as MonthTypeOption
        wrapper.vm.handleMonthTypeOptionClick(last3Months)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: last3Months.value?.from, to: last3Months.value?.to }
        ])
    })

    it('should select the last 6 months', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const last6Months = wrapper.vm.sidebarMonthOptions[3] as MonthTypeOption
        wrapper.vm.handleMonthTypeOptionClick(last6Months)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: last6Months.value?.from, to: last6Months.value?.to }
        ])
    })

    it('should select the last 12 months', () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })
        const lastYear = wrapper.vm.sidebarMonthOptions[4] as MonthTypeOption
        wrapper.vm.handleMonthTypeOptionClick(lastYear)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: lastYear.value?.from, to: lastYear.value?.to }
        ])
    })

    it('should emit the selected dates upon changing the type, day to month', async () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                }
            }
        })

        await wrapper.setProps({
            type: 'month'
        })

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            {
                from: new CustomDate(date1).startOf('month').toDate(),
                to: new CustomDate(date1).startOf('month').toDate()
            }
        ])
    })

    it('should emit the selected dates upon changing the type, month to day', async () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                },
                type: 'month'
            }
        })

        await wrapper.setProps({
            type: 'day'
        })

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            {
                from: new CustomDate(date1).startOf('day').toDate(),
                to: new CustomDate(date1).startOf('day').toDate()
            }
        ])
    })

    it('should render the different selection types depending on the props set', async () => {
        const wrapper = mount(DlDateTimeRange)
        await wrapper.setProps({
            type: 'month',
            modelValue: {
                from: date1,
                to: date2
            },
            showTime: true,
            mode: 'multi'
        })

        await wrapper.setProps({
            modelValue: {
                from: date1,
                to: date1
            }
        })
        await wrapper.setProps({
            showTime: true
        })

        await wrapper.setProps({
            mode: 'multi',
            type: 'day'
        })

        await wrapper.setProps({
            mode: 'single'
        })
    })

    it('should clear the selection on click Clear button', async () => {
        const wrapper = mount(DlDateTimeRange, {
            props: {
                modelValue: {
                    from: date1,
                    to: date2
                },
                type: 'month'
            }
        })

        wrapper.vm.clearDateInterval()
        expect(wrapper.vm.dateInterval).toEqual(null)
        expect(wrapper.vm.isInputDisabled).toEqual(false)
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
