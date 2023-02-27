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
                :class="{ 'dl-month-calendar--month-disabled': disabled }"
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
import DlIcon from '../DlIcon.vue'
import { CalendarDate } from './classes/CalendarDate'
import { DateInterval } from './types'
import { Month, getMonths } from './utils'
import { isInRange } from './isInRange'

export default defineComponent({
    components: {
        DlIcon
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
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
        'update:modelValue',
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
        handleClick(value: number) {
            const d = new CalendarDate()
            d.year(parseInt(this.title)).month(value).startOf('month')

            if (!isInRange(this.availableRange, d)) return

            const date = d.toDate()
            const newDate = {
                from: date,
                to: date
            }
            this.$emit('update:modelValue', newDate)
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
                color: 'var(--dl-color-text-buttons)',
                background: 'var(--dl-color-secondary)'
            }

            const initialD = new CalendarDate()
            const d = new CalendarDate()

            d.year(parseInt(this.title)).month(value).startOf('month')

            if (!isInRange(this.availableRange, d)) {
                style = {
                    'border-color': 'var(--dl-color-disabled)',
                    color: 'var(--dl-color-disabled)'
                }
            } else if (this.modelValue !== null) {
                const from = new CalendarDate(this.modelValue.from)
                const to = new CalendarDate(this.modelValue.to)

                const bgColor = 'var(--dl-color-secondary)'
                const intervalOpacity = 0.3

                const isInInterval =
                    d.isAfter(from, 'month') && d.isBefore(to, 'month')

                const isIntervalBoundary =
                    d.isSame(from, 'month') || d.isSame(to, 'month')

                if (isInInterval && this.disabled) {
                    style = {
                        ...selectedStyle,
                        background: bgColor,
                        opacity: intervalOpacity
                    }
                } else if (isInInterval) {
                    style = {
                        background: bgColor,
                        color: 'var(--dl-color-text-buttons)',
                        opacity: intervalOpacity
                    }
                } else if (isIntervalBoundary && this.disabled) {
                    style = {
                        ...style,
                        ...selectedStyle,
                        opacity: 0.6
                    }
                } else if (isIntervalBoundary) {
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
        border-radius: 2px;
        margin-left: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        font-size: 14px;
        text-transform: capitalize;
        padding: 7px 21px;

        &-disabled {
            cursor: not-allowed;
            color: var(--dl-color-disabled);
            border: 1px solid var(--dl-color-disabled);
        }
    }
}

.dl-month-calendar-disabled {
    cursor: not-allowed !important;
}
</style>
