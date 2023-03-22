import { mount } from '@vue/test-utils'
import DlDatePicker from '../../src/components/DlDatePicker/DlDatePicker.vue'
import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'
import {
    describe,
    it,
    expect,
    afterAll,
    beforeEach,
    afterEach,
    vi
} from 'vitest'

vi.useFakeTimers('modern')
vi.setSystemTime(new Date(1990, 12, 1))

const date = new Date(1990, 12, 1)
const date2 = new Date(1990, 12, 2)
const date3 = new Date(2000, 12, 2)

describe('DlDatePicker', () => {
    it('should update the model value', () => {
        const wrapper = mount(DlDatePicker)
        const dateInterval = { from: date, to: date2 }
        wrapper.vm.updateModelValue(dateInterval)
        expect(wrapper.emitted('update:modelValue')).toEqual([[dateInterval]])
    })

    it('should switch between dates back and forth', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        //initial date is 25
        wrapper.vm.handleDatePrev()
        expect(wrapper.vm.calendarFrom.dates[0].date()).toBe(28)

        wrapper.vm.handleDateNext()
        expect(wrapper.vm.calendarFrom.dates[0].date()).toBe(25)
    })

    it('should switch between months back and forth', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        //initial month is 11
        wrapper.vm.handleMonthNext()
        expect(wrapper.vm.calendarFrom.dates[7].month()).toBe(0)
    })

    it('should emit the currently selected state on mouseup', () => {
        const wrapper = mount(DlDatePicker, {
            data() {
                return {
                    dateInterval: {
                        from: date,
                        to: date3
                    },
                    isSelectionMode: true
                }
            }
        })

        wrapper.vm.handleMouseup()
        expect(wrapper.emitted()['update:modelValue']).toEqual([
            [
                {
                    from: date,
                    to: date3
                }
            ]
        ])
    })

    it('should update the date interval on mousedown', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date
                }
            }
        })
        wrapper.vm.handleMousedown(date2)
        expect(wrapper.vm.dateInterval).toEqual({
            from: date2,
            to: date2
        })
    })

    it('should set the target date of the selection state to the given date on mouseenter', () => {
        const wrapper = mount(DlDatePicker, {
            data() {
                return {
                    isSelectionMode: true,
                    dateInterval: {
                        from: date,
                        to: date2
                    }
                }
            }
        })

        wrapper.vm.handleMouseenter(date3)
        expect(wrapper.vm.dateInterval).toEqual({
            from: date,
            to: date3
        })
    })

    it('should update the calendar state on modelValue change', async () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                type: 'day',
                disabled: false
            }
        })
        expect(wrapper.vm.calendarFrom.currentDate.toString()).toEqual(
            date.toISOString()
        )
        expect(wrapper.vm.calendarTo.currentDate.toString()).toEqual(
            date2.toISOString()
        )
    })

    it('should update the calendar state on type change', async () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                type: 'day'
            }
        })

        await wrapper.setProps({
            type: 'month'
        })

        expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
            date2.toISOString()
        )
    })

    it('should update the calendar state on modelValue change', async () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })

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
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                type: 'day'
            }
        })

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
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date
                },
                type: 'month'
            }
        })

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

    it('should not update the date interval when disabled', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                disabled: true
            }
        })

        wrapper.vm.updateDateInterval({
            from: date,
            to: date
        })

        expect(wrapper.vm.dateInterval.to).toEqual(date2)
    })

    it('should update the date interval when not disabled', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                disabled: false
            }
        })

        wrapper.vm.updateDateInterval({
            from: date,
            to: date
        })

        expect(wrapper.vm.dateInterval.to).toEqual(date)
    })

    it('should change calendar state when not disabled', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                disabled: false
            }
        })

        wrapper.vm.handleMonthNext()
        expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
            new CustomDate(date2).add(1, 'year').startOf('year').toString()
        )

        wrapper.vm.handleMonthPrev()
        expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
            new CustomDate(date2).startOf('year').toString()
        )

        wrapper.vm.handleDateNext()
        expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
            new CustomDate(date2).add(1, 'month').startOf('month').toString()
        )

        wrapper.vm.handleDatePrev()
        expect(wrapper.vm.calendarTo.activeDate.toString()).toEqual(
            new CustomDate(date2).startOf('month').toString()
        )
    })

    it('should not change calendar state when disabled', () => {
        const wrapper = mount(DlDatePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                },
                disabled: true
            }
        })

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
