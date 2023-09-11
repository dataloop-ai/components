<template>
    <div
        :id="uuid"
        class="dl-date-picker"
    >
        <div
            v-if="type === 'day'"
            class="dl-date-picker--day_picker"
        >
            <div class="dl-date-picker--calendar_from">
                <dl-calendar
                    v-if="calendarFrom"
                    :model-value="dateInterval"
                    :title="calendarFrom.dateTitle"
                    :dates="calendarFrom.dates"
                    :available-range="availableRange"
                    :disabled="disabled"
                    :with-left-chevron="true"
                    @prev="handleDatePrev"
                    @update:model-value="updateDateInterval"
                    @mousedown="handleMousedown"
                    @mouseenter="handleMouseenter"
                />
            </div>
            <div class="dl-date-picker--calendar_to">
                <dl-calendar
                    v-if="calendarTo"
                    :model-value="dateInterval"
                    :title="calendarTo.dateTitle"
                    :dates="calendarTo.dates"
                    :available-range="availableRange"
                    :disabled="disabled"
                    :with-right-chevron="true"
                    @next="handleDateNext"
                    @update:model-value="updateDateInterval"
                    @mousedown="handleMousedown"
                    @mouseenter="handleMouseenter"
                />
            </div>
        </div>
        <div
            v-else
            class="dl-date-picker--month_picker"
        >
            <div class="dl-date-picker--calendar_from">
                <dl-month-calendar
                    :model-value="dateInterval"
                    :title="calendarFrom.monthTitle"
                    :available-range="availableRange"
                    :disabled="disabled"
                    :with-left-chevron="true"
                    @update:model-value="updateDateInterval"
                    @prev="handleMonthPrev"
                    @mousedown="handleMousedown"
                    @mouseenter="handleMouseenter"
                />
            </div>
            <div class="dl-date-picker--calendar_to">
                <dl-month-calendar
                    :model-value="dateInterval"
                    :title="calendarTo.monthTitle"
                    :available-range="availableRange"
                    :disabled="disabled"
                    :with-right-chevron="true"
                    @update:model-value="updateDateInterval"
                    @next="handleMonthNext"
                    @mousedown="handleMousedown"
                    @mouseenter="handleMouseenter"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import DlCalendar from './components/DlCalendar.vue'
import DlMonthCalendar from './components/DlMonthCalendar.vue'
import { CalendarDate, Calendar } from './models'
import { defineComponent, PropType } from 'vue-demi'
import { DateInterval } from './types'
import { v4 } from 'uuid'

const HOVER_TIMEOUT = 700

export default defineComponent({
    components: {
        DlCalendar,
        DlMonthCalendar
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Object as PropType<DateInterval | null>,
            default: null
        },
        type: {
            type: String,
            default: 'day'
        },
        availableRange: {
            type: Object as PropType<Partial<DateInterval> | null>,
            default: null
        },
        singleSelection: {
            type: Boolean,
            default: false
        },
        normalizeCalendars: Boolean,
        disabled: Boolean
    },
    emits: ['update:model-value', 'change'],
    data(): {
        uuid: string
        timeout: number | null
        calendarFrom: Calendar | null
        calendarTo: Calendar | null
        isSelectionMode: boolean
        dateInterval: DateInterval | null
    } {
        return {
            uuid: `dl-date-picker-${v4()}`,
            timeout: null,
            calendarFrom: null,
            calendarTo: null,
            isSelectionMode: false,
            dateInterval: this.modelValue
        }
    },
    watch: {
        type(value: string) {
            const [cDateFrom, cDateTo] = this.getCalendarDates(this.modelValue)

            this.calendarFrom!.currentDate = cDateFrom
            this.calendarTo!.currentDate = cDateTo

            const unit = value === 'day' ? 'month' : 'year'

            this.calendarTo!.activeDate = cDateTo
            this.calendarFrom!.activeDate = new CalendarDate(cDateTo).subtract(
                1,
                unit
            )
        },
        modelValue: {
            handler(value: DateInterval | null) {
                this.dateInterval = value
                const [cDateFrom, cDateTo] = this.getCalendarDates(value)

                this.calendarFrom!.currentDate = cDateFrom
                this.calendarTo!.currentDate = cDateTo

                if (this.normalizeCalendars) {
                    const unit = this.type === 'day' ? 'month' : 'year'

                    this.calendarTo!.activeDate = cDateTo
                    this.calendarFrom!.activeDate = new CalendarDate(
                        cDateTo
                    ).subtract(1, unit)
                }
            },
            deep: true
        }
    },
    beforeMount() {
        const [cDateFrom, cDateTo] = this.getCalendarDates(this.modelValue)

        const unit = this.type === 'day' ? 'month' : 'year'

        this.calendarFrom = new Calendar(cDateFrom)
        this.calendarFrom.activeDate = new CalendarDate(cDateTo).subtract(
            1,
            unit
        )

        this.calendarTo = new Calendar(cDateTo)
        this.calendarTo.activeDate = cDateTo
    },
    beforeUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    },
    methods: {
        getCalendarDates(value: DateInterval): [CalendarDate, CalendarDate] {
            if (value === null) {
                const now = new CalendarDate()
                return [now, now]
            }

            return [new CalendarDate(value.from), new CalendarDate(value.to)]
        },
        updateModelValue(value: DateInterval) {
            if (this.disabled) return
            this.$emit('update:model-value', value)
            this.$emit('change', value)
        },

        updateDateInterval(value: DateInterval) {
            if (this.disabled) return
            this.dateInterval = value
            this.updateModelValue(value)
        },

        handleDateNext() {
            if (this.disabled) return

            this.calendarFrom?.moveToNextMonth()
            this.calendarTo?.moveToNextMonth()
        },

        handleDatePrev() {
            if (this.disabled) return

            this.calendarFrom?.moveToPreviousMonth()
            this.calendarTo?.moveToPreviousMonth()
        },

        handleMonthNext() {
            if (this.disabled) return

            this.calendarFrom?.moveToNextYear()
            this.calendarTo?.moveToNextYear()
        },

        handleMonthPrev() {
            if (this.disabled) return

            this.calendarFrom?.moveToPreviousYear()
            this.calendarTo?.moveToPreviousYear()
        },

        handleMouseup() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }

            if (this.isSelectionMode) {
                window.removeEventListener('mouseup', this.handleMouseup)
                this.isSelectionMode = false
                this.updateModelValue(this.dateInterval)
            }
        },

        handleMousedown(date: Date) {
            if (this.disabled) return

            window.addEventListener('mouseup', this.handleMouseup)

            this.dateInterval = { from: date, to: date }

            if (!this.singleSelection) {
                this.isSelectionMode = true
            } else {
                this.updateModelValue(this.dateInterval)
            }
        },

        handleMouseenter(date: Date) {
            if (!this.isSelectionMode) return

            if (this.type === 'day') {
                const calendarDateClone = this.calendarTo?.activeDate.clone()

                const isLastDayOfTheMonth = calendarDateClone
                    .endOf('month')
                    .isSame(new CalendarDate(date), 'day')

                if (isLastDayOfTheMonth) {
                    if (this.timeout) {
                        clearTimeout(this.timeout)
                    }

                    // @ts-ignore
                    this.timeout = setTimeout(
                        this.handleDateNext,
                        HOVER_TIMEOUT
                    )
                }
            } else {
                if (
                    this.calendarTo?.activeDate.isSame(
                        new CalendarDate(date),
                        'year'
                    ) &&
                    new CalendarDate(date).month() === 11
                ) {
                    if (this.timeout) {
                        clearTimeout(this.timeout)
                    }

                    // @ts-ignore
                    this.timeout = setTimeout(
                        this.handleMonthNext,
                        HOVER_TIMEOUT
                    )
                }
            }

            this.dateInterval = {
                from: this.dateInterval.from,
                to: date
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-date-picker {
    user-select: none;
    padding: 0 30px;

    &--day_picker,
    &--month_picker {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    &--calendar_from,
    &--calendar_to {
        width: 230px;
        padding: 30px 0;
    }
}
</style>
