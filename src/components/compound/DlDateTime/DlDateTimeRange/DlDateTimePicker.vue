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
                    <dl-date-time-card
                        :model-value="modelValue"
                        :show-time="showTime"
                        :available-range="availableRange"
                        :width="datePickerCardWidth"
                        :disabled="disabled"
                        @update:model-value="handleModelValueChange"
                        @date-selected="onDateSelected"
                        @clear="handleClearAction"
                    />
                </div>
            </dl-menu>
        </date-input>
    </div>
</template>
<script lang="ts">
import { DateInterval } from '../types'
import { CustomDate } from '../DlDatePicker/models/CustomDate'
import DateInput from './DateInput.vue'
import DlDateTimeCard from './DlDateTimeCard.vue'
import { DlMenu } from '../../../essential'
import { defineComponent, PropType } from 'vue-demi'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DateInput,
        DlMenu,
        DlDateTimeCard
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
        isOpen: boolean
        isInputDisabled: boolean
    } {
        return {
            uuid: `dl-date-time-range-${v4()}`,
            isOpen: false,
            isInputDisabled: false
        }
    },
    computed: {
        dateInputStyle(): Record<string, any> {
            return { width: `${this.dateInputText.length / 2}em` }
        },
        dateInputText(): string {
            if (this.modelValue === null) {
                return this.placeholder
            }

            let text = ''

            if (this.showTime) {
                text = CustomDate.format(this.modelValue, 'MMM D, YYYY, HH:mm')
            } else {
                text = CustomDate.format(this.modelValue, 'MMM D, YYYY')
            }

            return text
        }
    },
    methods: {
        handleClearAction() {
            this.isInputDisabled = false
        },
        handleModelValueChange(value: Date) {
            this.$emit('update:model-value', value)
            this.$emit('change', value)
        },
        onDateSelected() {
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
        z-index: 1;
        display: flex;
        width: 100%;
        height: 100%;
    }
}
</style>
