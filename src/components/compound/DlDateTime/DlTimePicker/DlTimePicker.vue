<template>
    <div
        :id="uuid"
        class="dl-time-picker"
    >
        <div
            class="dl-time-picker--input"
            :class="{ 'dl-time-picker--input-disabled': disableInput }"
        >
            <span>From: {{ formatedFrom }}</span>
            <dl-time-picker-input
                :disabled="disableInput"
                :model-value="formatedFromValue"
                @update:modelValue="handleFromTimeChange"
            />
        </div>
        <div class="dl-time-picker--dash">
            -
        </div>
        <div
            class="dl-time-picker--input"
            :class="{ 'dl-time-picker--input-disabled': disableInput }"
        >
            <span>To: {{ formatedTo }}</span>
            <dl-time-picker-input
                :disabled="disableInput"
                :model-value="formatedToValue"
                @update:modelValue="handleToTimeChange"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import DlTimePickerInput from './components/DlTimePickerInput.vue'
import { CustomDate } from '../DlDatePicker/models/CustomDate'
import { Time } from './types'
import { DateInterval } from '../DlDatePicker/types'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DlTimePickerInput
    },
    props: {
        modelValue: {
            type: Object as PropType<DateInterval | null>,
            default: null
        },
        disabled: Boolean
    },
    emits: ['update:model-value'],
    data() {
        return {
            uuid: `dl-time-picker-${v4()}`
        }
    },
    computed: {
        disableInput(): boolean {
            return this.modelValue === null || this.disabled
        },
        formatedFrom(): string {
            return this.modelValue !== null
                ? new CustomDate(this.modelValue.from).format('MMM DD, YYYY')
                : ''
        },
        formatedFromValue(): Time {
            if (this.modelValue === null) {
                return {
                    hour: '00',
                    minute: '00'
                }
            }

            const selectionObj = new CustomDate(this.modelValue.from)
            return {
                hour: selectionObj.format('HH'),
                minute: selectionObj.format('mm')
            }
        },
        formatedTo(): string {
            return this.modelValue !== null
                ? new CustomDate(this.modelValue.to).format('MMM DD, YYYY')
                : ''
        },
        formatedToValue(): Time {
            if (this.modelValue === null) {
                return {
                    hour: '00',
                    minute: '00'
                }
            }

            const selectionObj = new CustomDate(this.modelValue.to)
            return {
                hour: selectionObj.format('HH'),
                minute: selectionObj.format('mm')
            }
        }
    },
    methods: {
        handleFromTimeChange(value: Time) {
            const newFrom = new CustomDate(this.modelValue.from)
            newFrom.hours(parseInt(value.hour)).minutes(parseInt(value.minute))

            if (newFrom.isBefore(new CustomDate(this.modelValue.to))) {
                this.$emit('update:model-value', {
                    from: newFrom.toDate(),
                    to: this.modelValue.to
                })
            }
        },

        handleToTimeChange(value: Time) {
            const newTo = new CustomDate(this.modelValue.to)
            newTo.hours(parseInt(value.hour)).minutes(parseInt(value.minute))

            if (newTo.isAfter(new CustomDate(this.modelValue.from))) {
                this.$emit('update:model-value', {
                    from: this.modelValue.from,
                    to: newTo.toDate()
                })
            }
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-time-picker {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid var(--dl-color-separator);
    padding: 15px 30px;
    box-sizing: border-box;

    &--input {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 130px;

        span {
            font-size: 12px;
            margin-right: 10px;
            color: var(--dl-color-medium);
        }

        &-disabled {
            span {
                color: var(--dl-color-disabled);
            }
        }
    }

    &--dash {
        padding: 0 10px;
        color: var(--dl-color-disabled);
    }
}
</style>
