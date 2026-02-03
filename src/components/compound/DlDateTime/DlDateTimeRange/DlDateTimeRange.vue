<template>
    <div :id="uuid" class="dl-date-time-range">
        <template v-if="isInputMode">
            <date-input
                :text="dateInputText"
                :input-style="dateInputStyle"
                :disabled="disabled"
                :width="width"
            >
                <dl-menu
                    ref="dateTimeRangeMenu"
                    anchor="bottom middle"
                    self="top middle"
                    :offset="[0, 5]"
                    :disabled="disabled"
                >
                    <date-time-range-content
                        v-bind="dateTimeRangeContentProps"
                        @day-type-option-click="handleDayTypeOptionClick"
                        @month-type-option-click="handleMonthTypeOptionClick"
                        @update-date-interval="updateDateInterval"
                        @update-date-interval-with-auto-close="
                            updateDateIntervalWithAutoClose
                        "
                        @update-from-to-date="updateFromToDate"
                        @clear="handleClearAction"
                    />
                </dl-menu>
            </date-input>
        </template>
        <template v-else>
            <date-time-range-content
                v-bind="dateTimeRangeContentProps"
                @day-type-option-click="handleDayTypeOptionClick"
                @month-type-option-click="handleMonthTypeOptionClick"
                @update-date-interval="updateDateInterval"
                @update-date-interval-with-auto-close="
                    updateDateIntervalWithAutoClose
                "
                @update-from-to-date="updateFromToDate"
                @clear="handleClearAction"
            />
        </template>
    </div>
</template>
<script lang="ts">
import { DateInterval } from '../types'
import {
    DayTypeOption,
    DAY_SIDEBAR_OPTION,
    MonthTypeOption,
    MONTH_SIDEBAR_OPTION,
    DATETIME_RANGE_VIEW_MODE
} from './types'
import { CustomDate } from '../DlDatePicker/models/CustomDate'
import { CalendarDate } from '../DlDatePicker/models/CalendarDate'
import DateInput from './DateInput.vue'
import DateTimeRangeContent from './DateTimeRangeContent.vue'
import { DlMenu } from '../../../essential'
import { defineComponent, PropType } from 'vue-demi'
import { isInRange } from '../DlDatePicker/utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DateInput,
        DateTimeRangeContent,
        DlMenu
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
        },
        width: {
            type: String,
            default: 'fit-content'
        },
        disabledType: {
            type: String,
            default: null
        },
        skipAvailableRangeIntervalUpdate: {
            type: Boolean,
            default: false
        },
        includingCurrentMonth: {
            type: Boolean,
            default: false
        },
        shouldClearSelectFirstOption: {
            type: Boolean,
            default: false
        },
        viewMode: {
            type: String as PropType<DATETIME_RANGE_VIEW_MODE>,
            default: DATETIME_RANGE_VIEW_MODE.input
        },
        hideClearButton: {
            type: Boolean,
            default: false
        },
        enabledWholePeriod: {
            type: Boolean,
            default: false
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
        activeDateTo: CalendarDate | null
        activeDateFrom: CalendarDate | null
    } {
        let type: 'day' | 'month' = this.type
        if (this.disabledType === this.type) {
            type = this.type === 'day' ? 'month' : 'day'
        }
        return {
            uuid: `dl-date-time-range-${v4()}`,
            dateInterval: this.modelValue,
            typeState: type,
            isOpen: false,
            isInputDisabled: false,
            currentSidebarOption: DAY_SIDEBAR_OPTION.custom,
            activeDateTo: null,
            activeDateFrom: null
        }
    },
    computed: {
        dayTypeOptions(): DayTypeOption[] {
            const today = CustomDate.startOf('day').toDate()
            const yesterday = CustomDate.subtract(1, 'day')
                .startOf('day')
                .toDate()
            let allowWholePeriod = this.enabledWholePeriod
            if (!this.availableRange || !this.availableRange.from) {
                allowWholePeriod = false
            }
            return [
                ...(allowWholePeriod
                    ? [
                          {
                              title: 'whole period',
                              key: DAY_SIDEBAR_OPTION.whole_period,
                              value: {
                                  from: this.availableRange?.from,
                                  to: new CustomDate(today)
                                      .endOf('day')
                                      .toDate()
                              }
                          }
                      ]
                    : []),
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
                        to: new CustomDate(today).endOf('day').toDate()
                    }
                },
                {
                    title: 'last 14 days',
                    key: DAY_SIDEBAR_OPTION.last_14_days,
                    value: {
                        from: CustomDate.subtract(14, 'day')
                            .startOf('day')
                            .toDate(),
                        to: new CustomDate(today).endOf('day').toDate()
                    }
                },
                {
                    title: 'last 30 days',
                    key: DAY_SIDEBAR_OPTION.last_month,
                    value: {
                        from: CustomDate.subtract(1, 'months')
                            .startOf('day')
                            .toDate(),
                        to: new CustomDate(today).endOf('day').toDate()
                    }
                },
                { title: 'custom by day', key: DAY_SIDEBAR_OPTION.custom },
                ...(this.disabledType === 'month'
                    ? []
                    : [
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
                      ])
            ]
        },
        monthTypeOptions(): MonthTypeOption[] {
            const thisMonth = CustomDate.startOf('month').toDate()
            const currentMonth = this.includingCurrentMonth
                ? CustomDate.endOf('month').toDate()
                : thisMonth
            const lastMonth = CustomDate.subtract(1, 'months')
                .startOf('month')
                .toDate()
            const today = CustomDate.endOf('day').toDate()
            const removeMonth = this.includingCurrentMonth ? 1 : 0
            return [
                {
                    title: 'Current month',
                    key: MONTH_SIDEBAR_OPTION.this_month,
                    value: {
                        from: thisMonth,
                        to: new CustomDate(today).endOf('day').toDate()
                    }
                },
                {
                    title: this.includingCurrentMonth
                        ? 'Previous month'
                        : 'Last month',
                    key: MONTH_SIDEBAR_OPTION.last_month,
                    value: {
                        from: lastMonth,
                        to: this.includingCurrentMonth
                            ? CustomDate.subtract(1, 'months')
                                  .endOf('month')
                                  .toDate()
                            : thisMonth
                    }
                },
                {
                    title: 'last 3 months',
                    key: MONTH_SIDEBAR_OPTION.last_3_months,
                    value: {
                        from: CustomDate.subtract(3 - removeMonth, 'months')
                            .startOf('month')
                            .toDate(),
                        to: currentMonth
                    }
                },
                {
                    title: 'last 6 months',
                    key: MONTH_SIDEBAR_OPTION.last_6_months,
                    value: {
                        from: CustomDate.subtract(6 - removeMonth, 'months')
                            .startOf('month')
                            .toDate(),
                        to: currentMonth
                    }
                },
                {
                    title: 'last 12 months',
                    key: MONTH_SIDEBAR_OPTION.last_12_months,
                    value: {
                        from: CustomDate.subtract(12 - removeMonth, 'months')
                            .startOf('month')
                            .toDate(),
                        to: currentMonth
                    }
                },
                ...(this.disabledType === 'day'
                    ? []
                    : [
                          {
                              title: 'custom by day',
                              key: MONTH_SIDEBAR_OPTION.custom_by_day,
                              value: this.dateInterval && {
                                  from: new CalendarDate(this.dateInterval.from)
                                      .startOf('day')
                                      .toDate(),
                                  to: new CalendarDate(this.dateInterval.to)
                                      .startOf('day')
                                      .toDate()
                              }
                          }
                      ]),
                { title: 'custom by month', key: MONTH_SIDEBAR_OPTION.custom }
            ]
        },
        sidebarDayOptions(): DayTypeOption[] {
            return this.dayTypeOptions.map((o) => ({
                ...o,
                disabled: !isInRange(this.availableRange, o.value) || o.disabled
            }))
        },
        sidebarMonthOptions(): MonthTypeOption[] {
            return this.monthTypeOptions.map((o) => ({
                ...o,
                disabled: !isInRange(this.availableRange, o.value) || o.disabled
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
        },
        isInputMode(): boolean {
            return this.viewMode === DATETIME_RANGE_VIEW_MODE.input
        },
        dateTimeRangeContentProps(): Record<string, any> {
            return {
                mode: this.mode,
                typeState: this.typeState,
                sidebarDayOptions: this.sidebarDayOptions,
                sidebarMonthOptions: this.sidebarMonthOptions,
                currentSidebarOption: this.currentSidebarOption,
                dateInterval: this.dateInterval,
                availableRange: this.availableRange,
                isInputDisabled: this.isInputDisabled,
                normalizeCalendars: this.normalizeCalendars,
                activeDateFrom: this.activeDateFrom,
                activeDateTo: this.activeDateTo,
                showTime: this.showTime,
                cardContentStyles: this.cardContentStyles,
                hideClearButton: this.hideClearButton
            }
        }
    },
    watch: {
        type(value: 'day' | 'month') {
            if (value === this.disabledType) return
            this.typeState = value
            this.updateFromToDate()
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
                if (this.dateInterval) {
                    if (
                        isInRange(
                            this.availableRange,
                            new CustomDate(this.dateInterval.from)
                        ) &&
                        isInRange(
                            this.availableRange,
                            new CustomDate(this.dateInterval.to)
                        )
                    ) {
                        return
                    }
                }
                if (!this.skipAvailableRangeIntervalUpdate) {
                    this.updateDateInterval(null)
                }
            },
            deep: true
        },
        modelValue(value: DateInterval | null) {
            this.dateInterval = value
        }
    },
    methods: {
        handleClearAction() {
            this.updateFromToDate()
            if (this.shouldClearSelectFirstOption) {
                if (this.type === 'day') {
                    this.handleDayTypeOptionClick(this.dayTypeOptions[0])
                } else {
                    this.handleMonthTypeOptionClick(this.monthTypeOptions[0])
                }
                return
            }
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
        updateDateInterval(
            value: DateInterval | null,
            skipSidebarUpdate = false
        ) {
            if (value === null) {
                this.dateInterval = null
            } else {
                this.dateInterval = {
                    from: value.from,
                    to: new Date(value.to)
                }
                // When in multi mode, update sidebar option to custom if user manually selects date
                if (this.mode === 'multi' && !skipSidebarUpdate) {
                    this.currentSidebarOption =
                        this.typeState === 'day'
                            ? DAY_SIDEBAR_OPTION.custom
                            : MONTH_SIDEBAR_OPTION.custom
                    this.isInputDisabled = false
                }
            }
            this.$emit('update:model-value', value)
            this.$emit('change', value)
        },
        updateFromToDate(value?: { from: CalendarDate; to: CalendarDate }) {
            this.activeDateFrom = value?.from || null
            this.activeDateTo = value?.to || null
        },
        updateDateIntervalWithAutoClose(
            value: DateInterval,
            skipSidebarUpdate = false
        ) {
            this.updateDateInterval(value, skipSidebarUpdate)

            if (
                this.autoClose &&
                this.viewMode === DATETIME_RANGE_VIEW_MODE.input
            ) {
                const dateTimeRangeMenu = this.$refs[
                    'dateTimeRangeMenu'
                ] as unknown as {
                    hide: () => void
                }
                if (dateTimeRangeMenu) {
                    dateTimeRangeMenu.hide()
                }
            }
        },
        handleDayTypeOptionClick(option: DayTypeOption) {
            this.updateFromToDate()
            this.currentSidebarOption = option.key as DAY_SIDEBAR_OPTION
            this.isInputDisabled = option.key !== DAY_SIDEBAR_OPTION.custom

            if (option.disabled || option.key === DAY_SIDEBAR_OPTION.custom) {
                return
            }

            if (option.key === DAY_SIDEBAR_OPTION.custom_by_month) {
                this.handleTypeChange('month')
                this.updateDateInterval(option.value, true)
            } else {
                this.updateDateIntervalWithAutoClose(option.value, true)
            }
        },
        handleMonthTypeOptionClick(option: MonthTypeOption) {
            this.updateFromToDate()
            this.currentSidebarOption = option.key as MONTH_SIDEBAR_OPTION
            this.isInputDisabled = option.key !== MONTH_SIDEBAR_OPTION.custom

            if (option.disabled || option.key === MONTH_SIDEBAR_OPTION.custom) {
                return
            }

            if (option.key === MONTH_SIDEBAR_OPTION.custom_by_day) {
                this.handleTypeChange('day')
                this.updateDateInterval(option.value, true)
            } else {
                this.updateDateIntervalWithAutoClose(option.value, true)
            }
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-date-time-range {
    display: flex;
    justify-content: center;
}
</style>
