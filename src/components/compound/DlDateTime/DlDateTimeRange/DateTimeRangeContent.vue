<template>
    <div class="dl-date-time-range--card">
        <div v-if="mode === 'multi'" class="dl-date-time-range--card_sidebar">
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
                :active-date-from="activeDateFrom"
                :active-date-to="activeDateTo"
                @update:model-value="updateDateIntervalWithAutoClose"
                @update:from-to-date="updateFromToDate"
            />
            <dl-time-picker
                v-if="showTime && typeState === 'day'"
                :disabled="isInputDisabled"
                :model-value="dateInterval"
                @update:model-value="updateDateInterval"
            />

            <dl-button
                v-if="!hideClearButton"
                size="s"
                outlined
                class="dl-date-time-range--button"
                @click="handleClear"
            >
                <span style="text-transform: capitalize"> Clear </span>
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlTimePicker } from '../DlTimePicker'
import { DateInterval } from '../types'
import CardSidebar from './CardSidebar.vue'
import { DayTypeOption, MonthTypeOption } from './types'
import DlDatePicker from '../DlDatePicker/DlDatePicker.vue'
import { CalendarDate } from '../DlDatePicker/models/CalendarDate'
import { DlButton } from '../../../basic'

export default defineComponent({
    components: {
        CardSidebar,
        DlDatePicker,
        DlTimePicker,
        DlButton
    },
    props: {
        mode: {
            type: String as PropType<'single' | 'multi'>,
            required: true
        },
        typeState: {
            type: String as PropType<'day' | 'month'>,
            required: true
        },
        sidebarDayOptions: {
            type: Array as PropType<DayTypeOption[]>,
            required: true
        },
        sidebarMonthOptions: {
            type: Array as PropType<MonthTypeOption[]>,
            required: true
        },
        currentSidebarOption: {
            type: String,
            required: true
        },
        dateInterval: {
            type: Object as PropType<DateInterval | null>,
            default: null
        },
        availableRange: {
            type: Object as PropType<Partial<DateInterval> | null>,
            default: null
        },
        isInputDisabled: {
            type: Boolean,
            default: false
        },
        normalizeCalendars: {
            type: Boolean,
            default: false
        },
        activeDateFrom: {
            type: Object as PropType<CalendarDate | null>,
            default: null
        },
        activeDateTo: {
            type: Object as PropType<CalendarDate | null>,
            default: null
        },
        showTime: {
            type: Boolean,
            default: false
        },
        cardContentStyles: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        hideClearButton: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'day-type-option-click',
        'month-type-option-click',
        'update-date-interval',
        'update-date-interval-with-auto-close',
        'update-from-to-date',
        'clear'
    ],
    methods: {
        handleDayTypeOptionClick(option: DayTypeOption) {
            this.$emit('day-type-option-click', option)
        },
        handleMonthTypeOptionClick(option: MonthTypeOption) {
            this.$emit('month-type-option-click', option)
        },
        updateDateInterval(value: DateInterval | null) {
            this.$emit('update-date-interval', value)
        },
        updateDateIntervalWithAutoClose(value: DateInterval) {
            this.$emit('update-date-interval-with-auto-close', value)
        },
        updateFromToDate(value?: { from: CalendarDate; to: CalendarDate }) {
            this.$emit('update-from-to-date', value)
        },
        handleClear() {
            this.$emit('clear')
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-date-time-range--card {
    background-color: var(--dl-color-bg);
    z-index: 1;
    display: flex;
    border-radius: 2px;
    box-shadow: 0 8px 8px 0 var(--dell-shadow, rgba(0, 0, 0, 0.14));
}

.dl-date-time-range--card_content {
    width: var(--card-content-width);
}

.dl-date-time-range--button {
    display: flex;
    margin-left: auto;
    width: fit-content;
    margin-right: 16px;
    margin-bottom: 16px;
}
</style>
