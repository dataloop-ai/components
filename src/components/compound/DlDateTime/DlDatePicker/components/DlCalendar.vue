<template>
    <div class="dl-calendar" :class="{ 'dl-calendar-disabled': disabled }">
        <div
            class="dl-calendar--title"
            :class="{ 'dl-calendar--title-disabled': disabled }"
        >
            <dl-icon
                v-if="withLeftChevron"
                icon="icon-dl-left-chevron"
                class="dl-calendar--left-chevron"
                size="16px"
                :style="chevronStyle"
                @click="$emit('prev')"
            />
            {{ title }}
            <dl-icon
                v-if="withRightChevron"
                icon="icon-dl-right-chevron"
                class="dl-calendar--right-chevron"
                size="16px"
                :style="chevronStyle"
                @click="$emit('next')"
            />
        </div>
        <div class="dl-calendar--header">
            <div
                v-for="day in weekNames"
                :key="day"
                class="dl-calendar--header_item"
                :class="{ 'dl-calendar--header_item-disabled': disabled }"
            >
                {{ day }}
            </div>
        </div>
        <div class="dl-calendar--content">
            <div
                v-for="date in dates"
                :key="date.toString()"
                class="dl-calendar--day"
                :class="{ 'dl-calendar--day-disabled': disabled }"
                :style="getDayStyle(date)"
                @click="handleClick(date)"
                @mousedown="handleMouseDown(date)"
                @mouseenter="handleMouseEnter(date)"
            >
                <div
                    v-if="!date.isDisabled"
                    class="dl-calendar--inner_day"
                    :style="getInnerDayStyle(date)"
                >
                    {{ date.date() }}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { DlIcon } from '../../../../essential'
import { CalendarDate, CustomDate } from '../models'
import { defineComponent, PropType } from 'vue-demi'
import { getWeekDayNames, isInRange } from '../utils'
import { DateInterval } from '../types'

const DAYS_IN_WEEK = 7

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
            required: true
        },
        dates: {
            type: Array as PropType<Partial<CalendarDate>[]>,
            required: true
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
        weekNames(): string[] {
            return getWeekDayNames()
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
        handleClick(value: Partial<CustomDate>) {
            if (!isInRange(this.availableRange, value as CustomDate)) return
            const newDate = {
                from: value.toDate(),
                to: value.toDate()
            }

            this.$emit('update:model-value', newDate)
            this.$emit('change', newDate)
        },
        getDayStyle(value: Partial<CalendarDate>) {
            if (this.modelValue === null) return

            const style: Record<string, any> = {}
            if (value.isDisabled) return style

            const from = new CalendarDate(this.modelValue.from)
            const to = new CalendarDate(this.modelValue.to)

            if (!from.isSameOrAfter(to, 'date')) {
                const bgColor = 'var(--dell-blue-100)'

                if (value.isAfter(from, 'day') && value.isBefore(to, 'day')) {
                    style.background = bgColor
                } else if (value.isSame(from, 'day')) {
                    style.background = `linear-gradient(to right, transparent 50%, ${bgColor} 50%)`
                } else if (value.isSame(to, 'day')) {
                    style.background = `linear-gradient(to right, ${bgColor} 50%, transparent 50%)`
                }

                const radius = '11px'
                const valueClone = value.clone()

                if (
                    value.day() === 0 ||
                    value.isSame(valueClone.startOf('month'), 'day')
                ) {
                    style.borderTopLeftRadius = radius
                    style.borderBottomLeftRadius = radius
                }

                if (
                    value.day() === DAYS_IN_WEEK - 1 ||
                    value.isSame(valueClone.endOf('month'), 'day')
                ) {
                    style.borderTopRightRadius = radius
                    style.borderBottomRightRadius = radius
                }
            }

            return style
        },

        getInnerDayStyle(value: Partial<CalendarDate>) {
            let style: Record<string, any> = {}

            if (value.isDisabled) return style

            const disabledOpacity = 1
            const isToday = value.isSame(
                new CalendarDate().startOf('day'),
                'day'
            )

            if (
                !isInRange(
                    this.availableRange,
                    new CustomDate(value.toString())
                )
            ) {
                style.cursor = 'not-allowed'
                if (isToday && this.disabled) {
                    style.color = 'var(--dl-color-secondary)'
                    style.opacity = disabledOpacity
                } else if (isToday) {
                    style.color = 'var(--dl-color-secondary)'
                } else {
                    style.color = 'var(--dl-color-disabled)'
                }
            } else if (this.modelValue !== null) {
                const selectedStyle = {
                    backgroundColor: 'var(--dell-blue-500)',
                    color: 'var(--dell-white)',
                    borderRadius: '11px'
                }

                const from = new CalendarDate(this.modelValue.from)
                const to = new CalendarDate(this.modelValue.to)

                const isIntervalBoundary =
                    value.isSame(from, 'day') || value.isSame(to, 'day')

                const isInRange =
                    value.isAfter(from, 'day') && value.isBefore(to, 'day')

                // Start/end days get blue background with white text
                if (isIntervalBoundary && this.disabled) {
                    style = {
                        ...style,
                        ...selectedStyle,
                        opacity: disabledOpacity
                    }
                } else if (isIntervalBoundary) {
                    style = {
                        ...style,
                        ...selectedStyle
                    }
                } else if (isInRange) {
                    // Range dates should always use dell-gray-800, regardless of disabled state
                    if (value.isDisabled) {
                        style.color = 'var(--dl-color-lighter)'
                    } else {
                        style.color = 'var(--dell-gray-800)'
                    }
                } else if (value.isDisabled) {
                    // Only actual disabled dates get lighter color
                    style.color = 'var(--dl-color-lighter)'
                } else {
                    // All other dates (including those outside range) should use dell-gray-800
                    style.color = 'var(--dell-gray-800)'
                }
            } else {
                if (isToday) {
                    style.color = 'var(--dl-color-secondary)'

                    if (this.disabled) {
                        style.opacity = disabledOpacity
                    }
                } else if (value.isDisabled) {
                    // Only actual disabled dates get lighter color
                    style.color = 'var(--dl-color-lighter)'
                } else {
                    // Default color for unselected dates
                    style.color = 'var(--dell-gray-800)'
                }
            }

            return style
        },

        handleMouseDown(value: Partial<CustomDate>) {
            if (!isInRange(this.availableRange, value as CustomDate)) return
            this.$emit('mousedown', value.toDate())
        },

        handleMouseEnter(value: Partial<CustomDate>) {
            if (this.modelValue === null) return
            if (!isInRange(this.availableRange, value as CustomDate)) return

            if (value.isBefore(new CustomDate(this.modelValue.from))) return

            this.$emit('mouseenter', value.toDate())
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-calendar {
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

    &--header {
        font-weight: bold;
        display: flex;
        padding-bottom: 10px;
    }

    &--content {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        row-gap: 10px;
    }

    &--header_item {
        min-height: 18px;
        color: var(--dl-color-medium);
        justify-content: center;
        align-items: center;

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--day {
        min-height: 20px;
        color: var(--dell-gray-800);

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--inner_day {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        cursor: pointer;
        color: var(--dell-gray-800);

        &:hover {
            background-color: var(--dell-blue-100);
            border-radius: 11px;
        }
    }

    &--header_item,
    &--day {
        display: flex;
        flex: 1 1 auto;
    }
}

.dl-calendar-disabled {
    cursor: not-allowed !important;

    .dl-calendar--inner_day {
        cursor: not-allowed;

        &:hover {
            background-color: transparent;
        }
    }
}
</style>
