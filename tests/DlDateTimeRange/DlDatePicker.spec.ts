import { mount } from '@vue/test-utils'
import { DlDatePicker } from '../../src/components'
import { CustomDate } from '../../src/components/compound/DlDateTime/DlDatePicker/models/CustomDate'
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest'

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(1990, 12, 1))

const date = new Date(1990, 12, 1)
const date2 = new Date(1990, 12, 2)
const date3 = new Date(2000, 12, 2)

describe('DlDatePicker', () => {
    describe('When update dates', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDatePicker)
        })
        it('should update the model value', () => {
            const dateInterval = { from: date, to: date2 }
            wrapper.vm.updateModelValue(dateInterval)
            expect(wrapper.emitted('update:model-value')).toEqual([
                [dateInterval]
            ])
        })
        it('should switch between dates back and forth', () => {
            wrapper.vm.handleDatePrev()
            expect(wrapper.vm.calendarFrom.dates[0].date()).toBe(28)

            wrapper.vm.handleDateNext()
            expect(wrapper.vm.calendarFrom.dates[0].date()).toBe(25)
        })
        it('should switch between months back and forth', () => {
            wrapper.vm.handleMonthNext()
            expect(wrapper.vm.calendarFrom.dates[7].month()).toBe(0)
        })
        it('should update the date interval on mousedown', () => {
            wrapper.vm.handleMousedown(date2)
            expect(wrapper.vm.dateInterval).toEqual({
                from: date2,
                to: date2
            })
        })
    })
    describe('When update the calendar state', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDatePicker, {
                data() {
                    return {
                        dateInterval: {
                            from: date,
                            to: date3
                        },
                        isSelectionMode: true,
                        type: 'day'
                    }
                }
            })
        })

        it('should emit the currently selected state on mouseup', () => {
            wrapper.vm.handleMouseup()
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [
                    {
                        from: date,
                        to: date3
                    }
                ]
            ])
        })
        it('should set the target date of the selection state to the given date on mouseenter', () => {
            wrapper.vm.handleMouseenter(date3)
            expect(wrapper.vm.dateInterval).toEqual({
                from: date,
                to: date3
            })
        })
        it('should update the calendar state on modelValue change', async () => {
            await wrapper.setProps({
                modelValue: {
                    from: date,
                    to: date2
                }
            })

            expect(wrapper.vm.calendarTo.currentDate.toString()).toEqual(
                date2.toISOString()
            )
        })
        it('should update the calendar state on modelValue change, made by sidebar day selection', async () => {
            await wrapper.setProps({
                modelValue: {
                    from: date,
                    to: date2
                },
                normalizeCalendars: true
            })

            expect(wrapper.vm.calendarTo.currentDate.toString()).toEqual(
                date2.toISOString()
            )

            expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                date2.toISOString()
            )
        })

        it('should update the calendar state on modelValue change, made by sidebar month selection', async () => {
            await wrapper.setProps({
                modelValue: {
                    from: date,
                    to: date2
                },
                normalizeCalendars: true
            })

            expect(wrapper.vm.calendarTo.currentDate.toString()).toEqual(
                date2.toISOString()
            )

            expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                date2.toISOString()
            )
        })
    })
    describe('When update calendar with disabled prop', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDatePicker, {
                props: {
                    modelValue: {
                        from: date,
                        to: date2
                    },
                    disabled: true
                }
            })
        })
        describe('When disabled prop', () => {
            it('should not update the date interval when disabled', async () => {
                wrapper.vm.updateDateInterval({
                    from: date,
                    to: date
                })

                expect(wrapper.vm.dateInterval.to).toEqual(date2)
            })
            it('should not change calendar state when disabled', () => {
                const initialState = wrapper.vm.calendarTo.activeDate.toString()

                wrapper.vm.handleMonthNext()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    initialState
                )

                wrapper.vm.handleMonthPrev()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    initialState
                )

                wrapper.vm.handleDateNext()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    initialState
                )

                wrapper.vm.handleDatePrev()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    initialState
                )
            })
        })
        describe('When not disabled prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    disabled: false
                })
            })
            it('should update the date interval when not disabled', () => {
                wrapper.vm.updateDateInterval({
                    from: date,
                    to: date
                })

                expect(wrapper.vm.dateInterval.to).toEqual(date)
            })
            it('should change calendar state when not disabled', () => {
                wrapper.vm.handleMonthNext()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    new CustomDate(date2)
                        .add(1, 'year')
                        .startOf('year')
                        .toString()
                )

                wrapper.vm.handleMonthPrev()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    new CustomDate(date2).startOf('year').toString()
                )

                wrapper.vm.handleDateNext()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    new CustomDate(date2)
                        .add(1, 'month')
                        .startOf('month')
                        .toString()
                )

                wrapper.vm.handleDatePrev()
                expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
                    new CustomDate(date2).startOf('month').toString()
                )
            })
        })
    })
    describe('handle mouseenter', () => {
        let clearTimeoutSpy: vi.SpyInstance
        let setTimeoutSpy: vi.SpyInstance

        beforeEach(() => {
            clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
            setTimeoutSpy = vi.spyOn(global, 'setTimeout')
        })

        afterEach(() => {
            vi.clearAllMocks()
        })

        describe('when mousedown is not triggered', () => {
            it('should not update the date interval', () => {
                const wrapper = mount(DlDatePicker, {
                    props: {
                        modelValue: {
                            from: date,
                            to: date2
                        }
                    },
                    data() {
                        return {
                            isSelectionMode: false
                        }
                    }
                })

                expect(wrapper.vm.dateInterval).toEqual({
                    from: date,
                    to: date2
                })
            })
        })
        describe('when type is day and is the last day in calendar', () => {
            it('shoud set a new timeout for handleDateNext and clear the timeout if exists', () => {
                const wrapper = mount(DlDatePicker, {
                    props: {
                        modelValue: {
                            from: date,
                            to: date2
                        },
                        type: 'day'
                    },
                    data() {
                        return {
                            timeout: setTimeout(() => {}, 100),
                            isSelectionMode: true
                        }
                    }
                })

                wrapper.vm.handleMouseenter(
                    wrapper.vm.calendarTo.activeDate.endOf('month')
                )

                expect(clearTimeoutSpy).toHaveBeenCalled()

                expect(setTimeoutSpy).toHaveBeenCalledWith(
                    wrapper.vm.handleDateNext,
                    700
                )
            })
        })

        describe('when type is month and is the last month in calendar', () => {
            it('should set a new timeout for handleMonthNext and clear the timeout if exists', () => {
                const wrapper = mount(DlDatePicker, {
                    props: {
                        modelValue: {
                            from: date,
                            to: date2
                        },
                        type: 'month'
                    },
                    data() {
                        return {
                            timeout: setTimeout(() => {}, 100),
                            isSelectionMode: true
                        }
                    }
                })

                wrapper.vm.handleMouseenter(
                    new CustomDate(wrapper.vm.activeDate).month(11)
                )

                expect(clearTimeoutSpy).toHaveBeenCalled()

                expect(setTimeoutSpy).toHaveBeenCalledWith(
                    wrapper.vm.handleMonthNext,
                    700
                )
            })
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
