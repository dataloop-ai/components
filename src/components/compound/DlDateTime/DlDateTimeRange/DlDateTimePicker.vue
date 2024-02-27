<template>
    <div :id="uuid" class="dl-date-time-range">
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
                <div class="dl-date-time-range--card">
                    <div
                        class="dl-date-time-range--card_content"
                        :style="cardContentStyles"
                    >
                        <dl-date-picker
                            :model-value="dateInterval"
                            :available-range="availableRange"
                            :disabled="isInputDisabled"
                            single-calendar
                            single-selection
                            @update:model-value="
                                updateDateIntervalWithAutoClose
                            "
                        />
                        <dl-time-picker
                            v-if="showTime"
                            :disabled="isInputDisabled"
                            :model-value="dateInterval"
                            single-time
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
import { CustomDate } from '../DlDatePicker/models/CustomDate'
import DlDatePicker from '../DlDatePicker/DlDatePicker.vue'
import DateInput from './DateInput.vue'
import { DlMenu } from '../../../essential'
import { DlButton } from '../../../basic'
import { defineComponent, PropType } from 'vue-demi'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
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
            type: Object as PropType<Date | null>,
            default: null
        },
        showTime: Boolean,
        datePickerCardWidth: {
            type: String,
            default: '300px'
        },
        availableRange: {
            type: Object as PropType<Partial<DateInterval> | null>,
            default: null
        },
        disabled: Boolean,
        autoClose: Boolean,
        placeholder: {
            type: String,
            default: 'Set Due Date'
        },
        width: {
            type: String,
            default: 'fit-content'
        }
    },
    emits: ['update:model-value', 'set-type', 'change'],
    data(): {
        uuid: string
        dateInterval: DateInterval | null
        isOpen: boolean
        isInputDisabled: boolean
    } {
        return {
            uuid: `dl-date-time-range-${v4()}`,
            dateInterval: this.modelValue
                ? {
                      from: this.modelValue,
                      to: new Date(this.modelValue)
                  }
                : null,
            isOpen: false,
            isInputDisabled: false
        }
    },
    computed: {
        dateInputStyle(): Record<string, any> {
            return { width: `${this.dateInputText.length / 2}em` }
        },
        dateInputText(): string {
            if (this.dateInterval === null) {
                return this.placeholder
            }

            let text = ''

            if (this.showTime) {
                text = CustomDate.format(
                    this.dateInterval.from,
                    'MMM D, YYYY, HH:mm'
                )
            } else {
                text = CustomDate.format(this.dateInterval.from, 'MMM D, YYYY')
            }

            return text
        },
        cardContentStyles(): Record<string, any> {
            return {
                '--card-content-width': this.datePickerCardWidth
            }
        }
    },
    watch: {
        availableRange: {
            handler() {
                this.updateDateInterval(null)
            },
            deep: true
        },
        modelValue(value: Date | null) {
            this.dateInterval = value && {
                from: value,
                to: new Date(value)
            }
        }
    },
    methods: {
        handleClearAction() {
            this.isInputDisabled = false
            this.updateDateInterval(null)
        },
        updateDateInterval(value: DateInterval | null) {
            if (value === null) {
                this.dateInterval = null
            } else {
                this.dateInterval = {
                    from: value.from,
                    to: new Date(value.from)
                }
            }
            this.$emit('update:model-value', value?.from)
            this.$emit('change', value?.from)
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
