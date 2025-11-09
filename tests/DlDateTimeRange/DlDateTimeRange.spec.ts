import { mount } from '@vue/test-utils'
import { CustomDate } from '../../src/components/compound/DlDateTime/DlDatePicker/models/CustomDate'
import { DlDateTimeRange } from '../../src/components'
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest'
import {
    DayTypeOption,
    MonthTypeOption
} from '../../src/components/compound/DlDateTime/DlDateTimeRange/types'
import {
    DAY_SIDEBAR_OPTION,
    MONTH_SIDEBAR_OPTION,
    DATETIME_RANGE_VIEW_MODE
} from '../../src/components/compound/DlDateTime/DlDateTimeRange/types'

const date1 = new Date(1990, 12, 1)
const date2 = new Date(1990, 12, 2)

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(date1))

describe('Date Time Range', () => {
    describe('When change selected date', () => {
        let wrapper: any

        beforeEach(async () => {
            wrapper = mount(DlDateTimeRange, {
                props: {
                    modelValue: {
                        from: date1,
                        to: date2
                    }
                }
            })
        })

        it('should select the current day', () => {
            const today = wrapper.vm.sidebarDayOptions[0] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(today)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: today.value?.from, to: today.value?.to }
            ])
        })
        it('should update the type to month', () => {
            const customByMonth = wrapper.vm.sidebarDayOptions[
                wrapper.vm.sidebarDayOptions.length - 1
            ] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(customByMonth)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: customByMonth.value?.from, to: customByMonth.value?.to }
            ])
            expect(wrapper.emitted()['set-type']).toEqual([['month']])
        })
        it('should select the previous day', () => {
            const yesterday = wrapper.vm.sidebarDayOptions[1] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(yesterday)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: yesterday.value?.from, to: yesterday.value?.to }
            ])
        })
        it('should select the previous day', () => {
            const yesterday = wrapper.vm.sidebarDayOptions[1] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(yesterday)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: yesterday.value?.from, to: yesterday.value?.to }
            ])
        })
        it('should select the last 7 days', () => {
            const oneWeekAgo = wrapper.vm.sidebarDayOptions[2] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(oneWeekAgo)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: oneWeekAgo.value?.from, to: oneWeekAgo.value?.to }
            ])
        })
        it('should select the last 14 days', () => {
            const twoWeeksAgo = wrapper.vm.sidebarDayOptions[3] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(twoWeeksAgo)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: twoWeeksAgo.value?.from, to: twoWeeksAgo.value?.to }
            ])
        })
        it('should select the last 30 days', () => {
            const oneMonthAgo = wrapper.vm.sidebarDayOptions[4] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(oneMonthAgo)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: oneMonthAgo.value?.from, to: oneMonthAgo.value?.to }
            ])
        })
        it('should select the current month', () => {
            const thisMonth = wrapper.vm
                .sidebarMonthOptions[0] as MonthTypeOption
            wrapper.vm.handleMonthTypeOptionClick(thisMonth)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: thisMonth.value?.from, to: thisMonth.value?.to }
            ])
        })

        it('should select the last month', () => {
            const lastMonth = wrapper.vm
                .sidebarMonthOptions[1] as MonthTypeOption
            wrapper.vm.handleMonthTypeOptionClick(lastMonth)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: lastMonth.value?.from, to: lastMonth.value?.to }
            ])
        })

        it('should select the last 3  months', () => {
            const last3Months = wrapper.vm
                .sidebarMonthOptions[2] as MonthTypeOption
            wrapper.vm.handleMonthTypeOptionClick(last3Months)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: last3Months.value?.from, to: last3Months.value?.to }
            ])
        })

        it('should select the last 6 months', () => {
            const last6Months = wrapper.vm
                .sidebarMonthOptions[3] as MonthTypeOption
            wrapper.vm.handleMonthTypeOptionClick(last6Months)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: last6Months.value?.from, to: last6Months.value?.to }
            ])
        })

        it('should select the last 12 months', () => {
            const lastYear = wrapper.vm
                .sidebarMonthOptions[4] as MonthTypeOption
            wrapper.vm.handleMonthTypeOptionClick(lastYear)
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                { from: lastYear.value?.from, to: lastYear.value?.to }
            ])
        })
    })
    describe('When emit the selected dates upon changing the type, day to month', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlDateTimeRange, {
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
        })

        it('should have the right date', () => {
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                {
                    from: new CustomDate(date1).startOf('month').toDate(),
                    to: new CustomDate(date1).startOf('month').toDate()
                }
            ])
        })
    })
    describe('When emit the selected dates upon changing the type, month to day', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlDateTimeRange, {
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
        })

        it('should have the right date', () => {
            expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                {
                    from: new CustomDate(date1).startOf('day').toDate(),
                    to: new CustomDate(date1).startOf('day').toDate()
                }
            ])
        })
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

        await wrapper.setProps({
            type: 'day'
        })

        wrapper.vm.handleClearAction()
        expect(wrapper.vm.dateInterval).toEqual(null)
        expect(wrapper.vm.isInputDisabled).toEqual(false)
        expect(wrapper.vm.currentSidebarOption).toEqual(
            DAY_SIDEBAR_OPTION.custom
        )
    })

    describe('View Mode', () => {
        it('should default to input mode', () => {
            const wrapper = mount(DlDateTimeRange)
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.input)
            expect(wrapper.props('viewMode')).toBe(
                DATETIME_RANGE_VIEW_MODE.input
            )
        })

        it('should render in input mode when viewMode is "input"', () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.input
                }
            })
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.input)
            const html = wrapper.html()
            expect(html).toContain('dl-date-time-range')
        })

        it('should render in inline mode when viewMode is "inline"', () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.inline
                }
            })
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.inline)
            const html = wrapper.html()
            expect(html).toContain('dl-date-time-range')
        })

        it('should switch between input and inline modes', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.input
                }
            })
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.input)

            await wrapper.setProps({
                viewMode: DATETIME_RANGE_VIEW_MODE.inline
            })
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.inline)

            await wrapper.setProps({
                viewMode: DATETIME_RANGE_VIEW_MODE.input
            })
            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.input)
        })

        it('should work with all props in inline mode', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.inline,
                    modelValue: {
                        from: date1,
                        to: date2
                    },
                    type: 'day',
                    mode: 'multi',
                    showTime: true
                }
            })

            expect(wrapper.vm.viewMode).toBe(DATETIME_RANGE_VIEW_MODE.inline)
            expect(wrapper.vm.dateInterval).toEqual({
                from: date1,
                to: date2
            })
        })

        it('should emit events correctly in inline mode', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.inline,
                    modelValue: {
                        from: date1,
                        to: date2
                    }
                }
            })

            const today = wrapper.vm.sidebarDayOptions[0] as DayTypeOption
            wrapper.vm.handleDayTypeOptionClick(today)
            expect(wrapper.emitted()['update:model-value']).toBeDefined()
        })
    })

    describe('Auto Close', () => {
        it('should update date interval in input mode with autoClose', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.input,
                    autoClose: true
                }
            })

            wrapper.vm.updateDateIntervalWithAutoClose({
                from: date1,
                to: date2
            })

            // Should update the date interval
            expect(wrapper.vm.dateInterval).toEqual({
                from: date1,
                to: date2
            })
            // Should emit the update event
            expect(wrapper.emitted()['update:model-value']).toBeDefined()
        })

        it('should not auto-close in inline mode even when autoClose is true', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.inline,
                    autoClose: true
                }
            })

            wrapper.vm.updateDateIntervalWithAutoClose({
                from: date1,
                to: date2
            })

            // In inline mode, there's no menu to close, so it should just update
            expect(wrapper.vm.dateInterval).toEqual({
                from: date1,
                to: date2
            })
        })

        it('should update date interval when autoClose is false', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.input,
                    autoClose: false
                }
            })

            wrapper.vm.updateDateIntervalWithAutoClose({
                from: date1,
                to: date2
            })

            // Should still update the date interval
            expect(wrapper.vm.dateInterval).toEqual({
                from: date1,
                to: date2
            })
        })
    })

    describe('Hide Clear Button', () => {
        it('should show clear button by default', () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    modelValue: {
                        from: date1,
                        to: date2
                    }
                }
            })
            expect(wrapper.vm.hideClearButton).toBe(false)
        })

        it('should hide clear button when hideClearButton is true', () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    hideClearButton: true,
                    modelValue: {
                        from: date1,
                        to: date2
                    }
                }
            })
            expect(wrapper.vm.hideClearButton).toBe(true)
        })

        it('should work with hideClearButton in both input and inline modes', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    viewMode: DATETIME_RANGE_VIEW_MODE.input,
                    hideClearButton: true,
                    modelValue: {
                        from: date1,
                        to: date2
                    }
                }
            })
            expect(wrapper.vm.hideClearButton).toBe(true)

            await wrapper.setProps({
                viewMode: DATETIME_RANGE_VIEW_MODE.inline
            })
            expect(wrapper.vm.hideClearButton).toBe(true)
        })
    })

    describe('Multi mode with manual date selection', () => {
        it('should update sidebar option to custom when manually selecting date in multi mode', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    mode: 'multi',
                    type: 'day'
                }
            })

            wrapper.vm.updateDateInterval({
                from: date1,
                to: date2
            })

            expect(wrapper.vm.currentSidebarOption).toBe(
                DAY_SIDEBAR_OPTION.custom
            )
            expect(wrapper.vm.isInputDisabled).toBe(false)
        })

        it('should update sidebar option to custom for month type in multi mode', async () => {
            const wrapper = mount(DlDateTimeRange, {
                props: {
                    mode: 'multi',
                    type: 'month'
                }
            })

            wrapper.vm.updateDateInterval({
                from: date1,
                to: date2
            })

            expect(wrapper.vm.currentSidebarOption).toBe(
                MONTH_SIDEBAR_OPTION.custom
            )
            expect(wrapper.vm.isInputDisabled).toBe(false)
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
