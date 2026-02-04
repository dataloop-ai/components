<template>
    <div
        class="dl-month-calendar"
        :class="{ 'dl-month-calendar-disabled': disabled }"
    >
        <div
            class="dl-month-calendar--title"
            :class="{ 'dl-month-calendar--title-disabled': disabled }"
        >
            <dl-icon
                v-if="withLeftChevron"
                icon="icon-dl-left-chevron"
                class="dl-month-calendar--left-chevron"
                size="16px"
                :style="chevronStyle"
                @click="$emit('prev')"
            />
            {{ title }}
            <dl-icon
                v-if="withRightChevron"
                icon="icon-dl-right-chevron"
                class="dl-month-calendar--right-chevron"
                size="16px"
                :style="chevronStyle"
                @click="$emit('next')"
            />
        </div>
        <div class="dl-month-calendar--content">
            <div
                v-for="month in months"
                :key="month.name"
                class="dl-month-calendar--month"
                :class="{
                    'dl-month-calendar--month-disabled':
                        disabled || isMonthOutOfRange(month.value),
                    'dl-month-calendar--month-selected': isMonthSelected(
                        month.value
                    )
                }"
                :style="getMonthStyle(month.value)"
                @click="handleClick(month.value)"
                @mouseenter="handleMouseenter(month.value)"
                @mousedown="handleMousedown(month.value)"
            >
                {{ month.name }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../../../essential'
import { CalendarDate } from '../models'
import { DateInterval } from '../types'
import { Month, getMonths, isInRange } from '../utils'

export default defineComponent({
    components: {
        DlIcon
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        availableRange: {
            type: Object as PropType<Partial<DateInterval>>,
            default: null
        },
        modelValue: {
            type: Object as PropType<DateInterval | null>,
            default: null
        },
        withLeftChevron: Boolean,
        withRightChevron: Boolean,
        disabled: Boolean
    },
    emits: [
        'update:model-value',
        'change',
        'mousedown',
        'mouseenter',
        'next',
        'prev'
    ],
    computed: {
        months(): Month[] {
            return getMonths()
        },
        chevronStyle(): Record<string, any> {
            return this.disabled
                ? {
                      color: 'var(--dl-color-disabled)',
                      cursor: 'not-allowed'
                  }
                : {
                      color: 'var(--dl-color-darker)',
                      cursor: 'pointer'
                  }
        }
    },
    methods: {
        isMonthOutOfRange(value: number): boolean {
            const d = new CalendarDate().year(parseInt(this.title)).month(value)
            return !isInRange(this.availableRange, d)
        },
        isMonthSelected(value: number): boolean {
            if (
                this.modelValue === null ||
                !this.modelValue.from ||
                !this.modelValue.to
            )
                return false
            const d = new CalendarDate().year(parseInt(this.title)).month(value)
            const from = new CalendarDate(this.modelValue.from)
            const to = new CalendarDate(this.modelValue.to)
            return d.isSame(from, 'month') || d.isSame(to, 'month')
        },
        handleClick(value: number) {
            const d = new CalendarDate().year(parseInt(this.title)).month(value)

            // Check if this month is already selected
            if (
                this.modelValue !== null &&
                this.modelValue.from &&
                this.modelValue.to
            ) {
                const selectedFrom = new CalendarDate(this.modelValue.from)
                const selectedTo = new CalendarDate(this.modelValue.to)
                if (
                    d.isSame(selectedFrom, 'month') ||
                    d.isSame(selectedTo, 'month')
                ) {
                    return
                }
            }

            const from = new CalendarDate(d)
            const to = new CalendarDate(d)

            from.startOf('month')
            from.startOf('day')
            to.endOf('month')
            to.endOf('day')

            if (!isInRange(this.availableRange, new CalendarDate(from))) return
            if (!isInRange(this.availableRange, new CalendarDate(to))) return

            const newDate = {
                from: from.toDate(),
                to: to.toDate()
            }
            this.$emit('update:model-value', newDate)
            this.$emit('change', newDate)
        },
        handleMouseenter(value: number) {
            if (this.modelValue === null) return

            const d = new CalendarDate()
            d.year(parseInt(this.title)).month(value).startOf('month')

            if (!isInRange(this.availableRange, d)) return

            if (d.isBefore(new CalendarDate(this.modelValue.from), 'day'))
                return

            this.$emit('mouseenter', d.toDate())
        },

        handleMousedown(value: number) {
            const d = new CalendarDate()
            d.year(parseInt(this.title)).month(value).startOf('month')

            if (!isInRange(this.availableRange, d)) return

            this.$emit('mousedown', d.toDate())
        },

        getMonthStyle(value: number) {
            let style: Record<string, any> = {}

            const selectedStyle = {
                color: 'var(--dell-white)',
                background: 'var(--dell-blue-500)',
                border: 'none'
            }

            const initialD = new CalendarDate()
            const d = new CalendarDate()

            d.year(parseInt(this.title)).month(value).startOf('month')

            if (!isInRange(this.availableRange, d)) {
                style = {
                    'background-color': 'var(--dell-gray-100)',
                    'border-color': 'var(--dell-gray-500)',
                    color: 'var(--dell-gray-500)',
                    cursor: 'not-allowed'
                }
            } else if (this.modelValue !== null) {
                const from = new CalendarDate(this.modelValue.from)
                const to = new CalendarDate(this.modelValue.to)

                const isInInterval =
                    d.isAfter(from, 'month') && d.isBefore(to, 'month')

                const isIntervalBoundary =
                    d.isSame(from, 'month') || d.isSame(to, 'month')

                if ((isInInterval || isIntervalBoundary) && this.disabled) {
                    style = {
                        ...style,
                        ...selectedStyle,
                        opacity: 0.6
                    }
                } else if (isInInterval || isIntervalBoundary) {
                    style = {
                        ...style,
                        ...selectedStyle
                    }
                } else if (
                    d.isSame(initialD, 'month') &&
                    !isIntervalBoundary &&
                    this.disabled
                ) {
                    style.color = 'var(--dl-color-secondary)'
                } else if (d.isSame(initialD, 'month') && !isIntervalBoundary) {
                    style.color = 'var(--dl-color-secondary)'
                }
            } else {
                if (d.isSame(initialD, 'month')) {
                    style.color = 'var(--dl-color-secondary)'
                }
            }

            return style
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-month-calendar {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &--title {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        font-size: 14px;
        padding: 0 15px 20px 15px;
        position: relative;
        color: var(--dl-color-darker);

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--left-chevron,
    &--right-chevron {
        width: 16px;
        height: 16px;
        position: absolute;
    }

    &--left-chevron {
        left: 0;
    }

    &--right-chevron {
        right: 0;
    }

    &--content {
        width: 250px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        margin-left: -15px;
    }

    &--month {
        color: var(--dl-color-darker);
        border: 1px solid var(--dl-color-separator);
        border-radius: 0;
        margin-left: 15px;
        margin-bottom: 10px;
        cursor: pointer;
        font-size: 14px;
        text-transform: capitalize;
        padding: 4px 21px;

        &:hover:not(.dl-month-calendar--month-disabled) {
            background-color: var(--dell-blue-100);
            border-color: var(--dell-blue-500);
        }

        &:active:not(.dl-month-calendar--month-disabled) {
            background-color: var(--dell-blue-200) !important;
            color: var(--dell-blue-600) !important;
            border: 1px solid var(--dell-blue-500) !important;
        }

        &-selected {
            cursor: default;
            pointer-events: none;
        }

        &-disabled {
            cursor: not-allowed;
            background-color: var(--dell-gray-100);
            color: var(--dell-gray-500);
            border: 1px solid var(--dell-gray-500);

            &:hover {
                background-color: var(--dell-gray-100);
                color: var(--dell-gray-500);
                border-color: var(--dell-gray-500);
            }
        }
    }
}

.dl-month-calendar-disabled {
    cursor: not-allowed !important;
}
</style>
