<template>
    <div
        :id="uuid"
        class="dl-date-time-range"
    >
        <date-input
            :text="dateInputText"
            :input-style="dateInputStyle"
            :disabled="disabled"
        >
            <dl-menu
                ref="dateTimeRangeMenu"
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 5]"
                :disabled="disabled"
            >
                <div class="dl-date-time-range--card">
                    <div
                        v-if="mode === 'multi'"
                        class="dl-date-time-range--card_sidebar"
                    >
                        <card-sidebar
                            v-if="typeState === 'day'"
                            :options="sidebarDayOptions"
                            :current-option="currentSidebarOption"
                            @click="handleDayTypeOptionClick"
                        />
                        <card-sidebar
                            v-else
                            :options="sidebarMonthOptions"
                            :current-option="currentSidebarOption"
                            @click="handleMonthTypeOptionClick"
                        />
                    </div>
                    <div
                        class="dl-date-time-range--card_content"
                        :style="cardContentStyles"
                    >
                        <dl-date-picker
                            :model-value="dateInterval"
                            :type="typeState"
                            :available-range="availableRange"
                            :disabled="isInputDisabled"
                            :normalize-calendars="normalizeCalendars"
                            @update:model-value="
                                updateDateIntervalWithAutoClose
                            "
                        />
                        <dl-time-picker
                            v-if="showTime && typeState === 'day'"
                            :disabled="isInputDisabled"
                            :model-value="dateInterval"
                            @update:model-value="updateDateInterval"
                        />

                        <dl-button
                            size="s"
                            outlined
                            class="dl-date-time-range--button"
                            @click="handleClearAction"
                        >
                            <span style="text-transform: capitalize">
                                Clear
                            </span>
                        </dl-button>
                    </div>
                </div>
            </dl-menu>
        </date-input>
    </div>
</template>
<script lang="ts">
import { DlTimePicker } from '../DlTimePicker'
import { DateInterval } from '../types'
import CardSidebar from './CardSidebar.vue'
import {
    DayTypeOption,
    DAY_SIDEBAR_OPTION,
    MonthTypeOption,
    MONTH_SIDEBAR_OPTION
} from './types'
import { CustomDate } from '../DlDatePicker/models/CustomDate'
import DlDatePicker from '../DlDatePicker/DlDatePicker.vue'
import { CalendarDate } from '../DlDatePicker/models/CalendarDate'
import DateInput from './DateInput.vue'
import { DlMenu } from '../../../essential'
import { DlButton } from '../../../basic'
import { defineComponent, PropType } from 'vue-demi'
import { isInRange } from '../DlDatePicker/utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        CardSidebar,
        DlDatePicker,
        DlTimePicker,
        DateInput,
        DlMenu,
        DlButton
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
        showTime: Boolean,
        type: {
            type: String as PropType<'day' | 'month'>,
            default: 'day'
        },
        mode: {
            type: String as PropType<'single' | 'multi'>,
            default: 'single'
        },
        datePickerCardWidth: {
            type: String,
            default: '590px'
        },
        availableRange: {
            type: Object as PropType<Partial<DateInterval> | null>,
            default: null
        },
        withSelectedOption: Boolean,
        disabled: Boolean,
        autoClose: Boolean,
        placeholder: {
            type: String,
            default: 'Set Due Date'
        }
    },
    emits: ['update:model-value', 'set-type', 'change'],
    data(): {
        uuid: string
        dateInterval: DateInterval | null
        typeState: 'day' | 'month'
        isOpen: boolean
        isInputDisabled: boolean
        currentSidebarOption: DAY_SIDEBAR_OPTION | MONTH_SIDEBAR_OPTION
    } {
        return {
            uuid: `dl-date-time-range-${v4()}`,
            dateInterval: this.modelValue,
            typeState: this.type,
            isOpen: false,
            isInputDisabled: false,
            currentSidebarOption: DAY_SIDEBAR_OPTION.custom
        }
    },
    computed: {
        dayTypeOptions(): DayTypeOption[] {
            const today = CustomDate.startOf('day').toDate()
            const yesterday = CustomDate.subtract(1, 'day')
                .startOf('day')
                .toDate()

            return [
                {
                    title: 'today',
                    key: DAY_SIDEBAR_OPTION.today,
                    value: {
                        from: today,
                        to: new CustomDate(today).endOf('day').toDate()
                    }
                },
                {
                    title: 'yesterday',
                    key: DAY_SIDEBAR_OPTION.yesterday,
                    value: {
                        from: yesterday,
                        to: new CustomDate(yesterday).endOf('day').toDate()
                    }
                },
                {
                    title: 'last 7 days',
                    key: DAY_SIDEBAR_OPTION.last_7_days,
                    value: {
                        from: CustomDate.subtract(7, 'day')
                            .startOf('day')
                            .toDate(),
                        to: today
                    }
                },
                {
                    title: 'last 14 days',
                    key: DAY_SIDEBAR_OPTION.last_14_days,
                    value: {
                        from: CustomDate.subtract(14, 'day')
                            .startOf('day')
                            .toDate(),
                        to: today
                    }
                },
                {
                    title: 'last 30 days',
                    key: DAY_SIDEBAR_OPTION.last_month,
                    value: {
                        from: CustomDate.subtract(1, 'months')
                            .startOf('day')
                            .toDate(),
                        to: today
                    }
                },
                { title: 'custom by day', key: DAY_SIDEBAR_OPTION.custom },
                {
                    title: 'custom by month',
                    key: DAY_SIDEBAR_OPTION.custom_by_month,
                    value: this.dateInterval && {
                        from: new CalendarDate(this.dateInterval.from)
                            .startOf('month')
                            .toDate(),
                        to: new CalendarDate(this.dateInterval.from)
                            .startOf('month')
                            .toDate()
                    }
                }
            ]
        },
        monthTypeOptions(): MonthTypeOption[] {
            const thisMonth = CustomDate.startOf('month').toDate()
            const lastMonth = CustomDate.subtract(1, 'months')
                .startOf('month')
                .toDate()

            return [
                {
                    title: 'this month',
                    key: MONTH_SIDEBAR_OPTION.this_month,
                    value: { from: thisMonth, to: thisMonth }
                },
                {
                    title: 'last month',
                    key: MONTH_SIDEBAR_OPTION.last_month,
                    value: { from: lastMonth, to: lastMonth }
                },
                {
                    title: 'last 3 months',
                    key: MONTH_SIDEBAR_OPTION.last_3_months,
                    value: {
                        from: CustomDate.subtract(3, 'months')
                            .startOf('month')
                            .toDate(),
                        to: thisMonth
                    }
                },
                {
                    title: 'last 6 months',
                    key: MONTH_SIDEBAR_OPTION.last_6_months,
                    value: {
                        from: CustomDate.subtract(6, 'months')
                            .startOf('month')
                            .toDate(),
                        to: thisMonth
                    }
                },
                {
                    title: 'last 12 months',
                    key: MONTH_SIDEBAR_OPTION.last_12_months,
                    value: {
                        from: CustomDate.subtract(1, 'year')
                            .startOf('month')
                            .toDate(),
                        to: thisMonth
                    }
                },
                { title: 'custom by month', key: MONTH_SIDEBAR_OPTION.custom },
                {
                    title: 'custom by day',
                    key: MONTH_SIDEBAR_OPTION.custom_by_day,
                    value: this.dateInterval && {
                        from: new CalendarDate(this.dateInterval.from)
                            .startOf('day')
                            .toDate(),
                        to: new CalendarDate(this.dateInterval.from)
                            .startOf('day')
                            .toDate()
                    }
                }
            ]
        },
        sidebarDayOptions(): DayTypeOption[] {
            return this.dayTypeOptions.map((o) => ({
                ...o,
                disabled: !isInRange(this.availableRange, o.value)
            }))
        },
        sidebarMonthOptions(): MonthTypeOption[] {
            return this.monthTypeOptions.map((o) => ({
                ...o,
                disabled: !isInRange(this.availableRange, o.value)
            }))
        },
        dateInputStyle(): Record<string, any> {
            return { width: `${this.dateInputText.length / 2}em` }
        },
        dateInputText(): string {
            if (this.dateInterval === null) {
                return this.placeholder
            }

            let text = ''

            if (this.typeState === 'month') {
                if (this.dateInterval.from !== this.dateInterval.to) {
                    text = `${CustomDate.format(
                        this.dateInterval.from,
                        'MMM, YYYY'
                    )} - ${CustomDate.format(
                        this.dateInterval.to,
                        'MMM, YYYY'
                    )}`
                } else {
                    text = CustomDate.format(
                        this.dateInterval.from,
                        'MMM, YYYY'
                    )
                }
            } else {
                if (this.dateInterval.from !== this.dateInterval.to) {
                    if (this.showTime) {
                        text = `${CustomDate.format(
                            this.dateInterval.from,
                            'MMM D, YYYY, HH:mm'
                        )} - ${CustomDate.format(
                            this.dateInterval.to,
                            'MMM D, YYYY, HH:mm'
                        )}`
                    } else {
                        text = `${CustomDate.format(
                            this.dateInterval.from,
                            'MMM D, YYYY'
                        )} - ${CustomDate.format(
                            this.dateInterval.to,
                            'MMM D, YYYY'
                        )}`
                    }
                } else {
                    if (this.showTime) {
                        text = CustomDate.format(
                            this.dateInterval.from,
                            'MMM D, YYYY, HH:mm'
                        )
                    } else {
                        text = CustomDate.format(
                            this.dateInterval.from,
                            'MMM D, YYYY'
                        )
                    }
                }
            }

            if (this.mode === 'multi' && this.withSelectedOption) {
                let title = ''
                if (this.typeState === 'month') {
                    const option = this.monthTypeOptions.find(
                        (option) => option.key === this.currentSidebarOption
                    )
                    title = option ? option.title : MONTH_SIDEBAR_OPTION.custom
                } else {
                    const option = this.dayTypeOptions.find(
                        (option) => option.key === this.currentSidebarOption
                    )
                    title = option ? option.title : DAY_SIDEBAR_OPTION.custom
                }
                text = `${title.slice(0, 1).toUpperCase()}${title.slice(
                    1
                )}: ${text}`
            }

            return text
        },
        normalizeCalendars(): boolean {
            return ![
                DAY_SIDEBAR_OPTION.custom,
                DAY_SIDEBAR_OPTION.custom_by_month,
                MONTH_SIDEBAR_OPTION.custom_by_day
            ].includes(this.currentSidebarOption as any)
        },
        cardContentStyles(): Record<string, any> {
            return {
                '--card-content-width': this.datePickerCardWidth
            }
        }
    },
    watch: {
        type(value: 'day' | 'month') {
            this.typeState = value

            if (this.dateInterval === null) return

            const date = new CustomDate(this.dateInterval.from)
                .startOf(value)
                .toDate()

            this.updateDateInterval({
                from: date,
                to: date
            })
        },
        mode(value: 'single' | 'multi') {
            if (value === 'single') {
                this.currentSidebarOption = DAY_SIDEBAR_OPTION.custom
                this.isInputDisabled = false
            }
        },
        availableRange: {
            handler() {
                this.currentSidebarOption =
                    this.typeState === 'day'
                        ? DAY_SIDEBAR_OPTION.custom
                        : MONTH_SIDEBAR_OPTION.custom

                this.updateDateInterval(null)
            },
            deep: true
        }
    },
    methods: {
        handleClearAction() {
            this.currentSidebarOption = DAY_SIDEBAR_OPTION.custom
            this.isInputDisabled = false
            this.updateDateInterval(null)
        },
        handleTypeChange(value: 'day' | 'month') {
            this.isInputDisabled = false
            this.currentSidebarOption =
                value === 'day'
                    ? DAY_SIDEBAR_OPTION.custom
                    : MONTH_SIDEBAR_OPTION.custom

            this.typeState = value
            this.$emit('set-type', value)
        },
        updateDateInterval(value: DateInterval | null) {
            if (value === null) {
                this.dateInterval = null
            } else {
                this.dateInterval = {
                    from: value.from,
                    to: new Date(value.to)
                }
            }
            this.$emit('update:model-value', value)
            this.$emit('change', value)
        },
        updateDateIntervalWithAutoClose(value: DateInterval) {
            this.updateDateInterval(value)

            if (this.autoClose) {
                const dateTimeRangeMenu = this.$refs[
                    'dateTimeRangeMenu'
                ] as unknown as {
                    hide: () => void
                }
                dateTimeRangeMenu.hide()
            }
        },
        handleDayTypeOptionClick(option: DayTypeOption) {
            this.currentSidebarOption = option.key as DAY_SIDEBAR_OPTION
            this.isInputDisabled = option.key !== DAY_SIDEBAR_OPTION.custom

            if (option.disabled || option.key === DAY_SIDEBAR_OPTION.custom) {
                return
            }

            if (option.key === DAY_SIDEBAR_OPTION.custom_by_month) {
                this.handleTypeChange('month')
            }

            this.updateDateInterval(option.value)
        },
        handleMonthTypeOptionClick(option: MonthTypeOption) {
            this.currentSidebarOption = option.key as MONTH_SIDEBAR_OPTION
            this.isInputDisabled = option.key !== MONTH_SIDEBAR_OPTION.custom

            if (option.disabled || option.key === MONTH_SIDEBAR_OPTION.custom) {
                return
            }

            if (option.key === MONTH_SIDEBAR_OPTION.custom_by_day) {
                this.handleTypeChange('day')
            }

            this.updateDateInterval(option.value)
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-date-time-range {
    display: flex;
    justify-content: center;

    &--card {
        background-color: var(--dl-color-bg);
        z-index: 1;
        display: flex;
        border-radius: 2px;
        border-radius: 2px;
    }

    &--card_content {
        width: var(--card-content-width);
    }

    &--button {
        display: flex;
        margin-left: auto;
        width: fit-content;
        margin-right: 16px;
        margin-bottom: 16px;
    }
}
</style>
