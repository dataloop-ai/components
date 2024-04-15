<template>
    <div :id="uuid" class="dl-date-time-range-card">
        <div class="dl-date-time-range-card--content">
            <dl-date-picker
                :model-value="dateInterval"
                :available-range="availableRange"
                :disabled="disabled"
                single-calendar
                single-selection
                @update:model-value="dateSelected"
            />
            <dl-time-picker
                v-if="showTime"
                :disabled="disabled"
                :model-value="dateInterval"
                single-time
                @update:model-value="updateDateInterval"
            />

            <dl-button
                size="s"
                outlined
                class="dl-date-time-range-card--button"
                @click="handleClearAction"
            >
                <span style="text-transform: capitalize"> Clear </span>
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import {
    computed,
    defineComponent,
    PropType,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { DateInterval } from '../types'
import { DlTimePicker } from '../DlTimePicker'
import DlDatePicker from '../DlDatePicker/DlDatePicker.vue'
import { DlButton } from '../../../basic'
import { isEqual } from 'lodash'

export default defineComponent({
    components: {
        DlDatePicker,
        DlTimePicker,
        DlButton
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Object as PropType<Date | null>,
            default: null
        },
        showTime: Boolean,
        availableRange: {
            type: Object as PropType<Partial<DateInterval> | null>,
            default: null
        },
        disabled: Boolean
    },
    emits: ['update:model-value', 'date-selected', 'change', 'clear'],
    setup(props, { emit }) {
        const { modelValue, availableRange } = toRefs(props)

        const uuid = ref(`dl-date-time-card-${v4()}`)
        const dateInterval = computed<DateInterval>({
            get() {
                return modelValue.value
                    ? {
                          from: modelValue.value,
                          to: new Date(modelValue.value)
                      }
                    : null
            },
            set(val: DateInterval | null) {
                emit('update:model-value', val ? val.from : null)
            }
        })

        const handleClearAction = () => {
            emit('clear')
            updateDateInterval(null)
        }

        const updateDateInterval = (value: DateInterval | null) => {
            if (value === null) {
                dateInterval.value = null
            } else {
                const newVal = {
                    from: value.from,
                    to: new Date(value.from)
                } as DateInterval

                if (isEqual(newVal, dateInterval.value)) {
                    return
                }

                dateInterval.value = newVal
            }
            emit('change', value.from)
        }

        const dateSelected = (value: DateInterval) => {
            const val = {
                from: value.from,
                to: new Date(value.from)
            }
            emit('date-selected', val.from)
            updateDateInterval(val)
        }

        watch(availableRange, () => {
            updateDateInterval(null)
        })

        return {
            uuid,
            dateInterval,
            handleClearAction,
            updateDateInterval,
            dateSelected
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-date-time-range-card {
    background-color: var(--dl-color-bg);
    display: flex;
    border-radius: 2px;
    border-radius: 2px;

    &--content {
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
