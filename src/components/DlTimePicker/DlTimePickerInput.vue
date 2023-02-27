<template>
    <div class="dl-time-picker-input">
        <div
            class="dl-time-picker-input--clock_img"
            :class="{ 'dl-time-picker-input--clock_img-disabled': disabled }"
        >
            <dl-icon
                icon="icon-dl-time"
                size="16px"
            />
        </div>
        <div
            class="dl-time-picker-input--text"
            :class="{ 'dl-time-picker-input--text-disabled': disabled }"
        >
            {{ time }}
        </div>
        <dl-menu
            anchor="bottom start"
            :offset="[0, 4]"
            :disabled="disabled"
            @before-show="setOptions"
        >
            <div class="dl-time-picker-input--content">
                <div class="dl-time-picker-input--chevron_wrapper">
                    <dl-icon
                        icon="icon-dl-up-chevron"
                        size="16px"
                        class="dl-time-picker-input--chevron"
                        @click="handleHourUpChevronClick"
                    />
                    <dl-icon
                        icon="icon-dl-up-chevron"
                        size="16px"
                        class="dl-time-picker-input--chevron"
                        @click="handleMinuteUpChevronClick"
                    />
                </div>
                <dl-time-counter
                    v-for="(option, index) in options"
                    :key="index"
                    :hour="option.hour"
                    :minute="option.minute"
                    :current-hour="modelValue.hour"
                    :current-minute="modelValue.minute"
                    @set-hour="handleHourChange"
                    @set-minute="handleMinuteChange"
                />

                <div class="dl-time-picker-input--chevron_wrapper">
                    <dl-icon
                        icon="icon-dl-down-chevron"
                        size="16px"
                        class="dl-time-picker-input--chevron"
                        @click="handleHourDownChevronClick"
                    />
                    <dl-icon
                        icon="icon-dl-down-chevron"
                        size="16px"
                        class="dl-time-picker-input--chevron"
                        @click="handleMinuteDownChevronClick"
                    />
                </div>
                <div class="dl-time-picker-input--dots">
                    :
                </div>
            </div>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { Time } from './types'
import DlIcon from '../DlIcon.vue'
import DlTimeCounter from './DlTimeCounter.vue'
import { DlMenu } from '../DlMenu'
import { defineComponent, PropType } from 'vue-demi'

const MAX_HOUR = 23
const MAX_MINUTE = 59

function formatTime(value: number): string {
    return value < 10 ? `0${value}` : value.toString()
}

export default defineComponent({
    components: {
        DlIcon,
        DlTimeCounter,
        DlMenu
    },
    props: {
        modelValue: {
            type: Object as PropType<Time>,
            default: () => ({
                hour: '00',
                minute: '00'
            })
        },
        disabled: Boolean
    },
    emits: ['update:modelValue'],
    data(): {
        options: Time[]
    } {
        return {
            options: [
                {
                    hour: '00',
                    minute: '00'
                },
                {
                    hour: '01',
                    minute: '01'
                },
                {
                    hour: '02',
                    minute: '02'
                },
                {
                    hour: '03',
                    minute: '03'
                },
                {
                    hour: '04',
                    minute: '04'
                },
                {
                    hour: '05',
                    minute: '05'
                },
                {
                    hour: '06',
                    minute: '06'
                }
            ]
        }
    },
    computed: {
        time(): string {
            return `${this.modelValue.hour}:${this.modelValue.minute}`
        }
    },
    beforeMount() {
        this.setOptions()
    },
    methods: {
        setOptions() {
            const newOptions = [
                {
                    hour: this.modelValue.hour,
                    minute: this.modelValue.minute
                }
            ]

            const h = parseInt(this.modelValue.hour)
            const m = parseInt(this.modelValue.minute)
            let i = 1

            while (i <= 3) {
                let hVal = (h + i) % (MAX_HOUR + 1)
                let hMin = (m + i) % (MAX_MINUTE + 1)

                newOptions.push({
                    hour: hVal <= 9 ? `0${hVal}` : `${hVal}`,
                    minute: hMin <= 9 ? `0${hMin}` : `${hMin}`
                })

                hVal = (h - i) % (MAX_HOUR + 1)
                hMin = (m - i) % (MAX_MINUTE + 1)

                hVal = hVal < 0 ? MAX_HOUR + hVal + 1 : hVal
                hMin = hMin < 0 ? MAX_MINUTE + hMin + 1 : hMin

                newOptions.unshift({
                    hour: hVal <= 9 ? `0${hVal}` : `${hVal}`,
                    minute: hMin <= 9 ? `0${hMin}` : `${hMin}`
                })

                i++
            }

            this.options = newOptions
        },

        handleHourDownChevronClick() {
            this.increment('hour', MAX_HOUR)
        },

        handleHourUpChevronClick() {
            this.decrement('hour', MAX_HOUR)
        },

        handleMinuteDownChevronClick() {
            this.increment('minute', MAX_MINUTE)
        },

        handleMinuteUpChevronClick() {
            this.decrement('minute', MAX_MINUTE)
        },

        increment(key: keyof Time, compare: number) {
            let lastValue = parseInt(
                this.options[this.options.length - 1][key],
                10
            )

            this.options.forEach((t) => {
                if (lastValue < compare) {
                    t[key] = lastValue++ < 9 ? `0${lastValue}` : `${lastValue}`
                } else {
                    lastValue = 0
                    t[key] = '00'
                }
            })
        },

        decrement(key: keyof Time, compare: number) {
            let firstValue = parseInt(this.options[0][key], 10)
            firstValue = firstValue - 8

            this.options.forEach((t) => {
                firstValue++
                if (firstValue >= 0) {
                    t[key] =
                        firstValue <= 9 ? `0${firstValue}` : `${firstValue}`
                } else {
                    let val = compare + 1 + firstValue
                    t[key] = `${val++}`
                }
            })
        },

        handleHourChange(value: string) {
            this.$emit('update:modelValue', {
                hour: value,
                minute: this.modelValue.minute
            })
        },

        handleMinuteChange(value: string) {
            this.$emit('update:modelValue', {
                hour: this.modelValue.hour,
                minute: value
            })
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-time-picker-input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96px;
    border: 1px solid var(--dl-color-separator);

    &--clock_img {
        padding: 6px 10px 6px 0;
        height: 16px;
        color: var(--dl-color-darker);

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--text {
        display: flex;
        font-size: 12px;
        line-height: 14px;
        padding: 7px 0;
        color: var(--dl-color-darker);

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--content {
        top: 30px;
        box-sizing: border-box;
        min-width: 96px;
        z-index: 1;
        padding: 2px 16px;
        background: var(--dl-color-bg);
        color: var(--dl-color-darker);
    }

    &--chevron {
        width: 16px;
        height: 16px;
        cursor: pointer;
        font-size: 12px;
    }

    &--chevron_wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px;
    }

    &--dots {
        color: var(--dl-color-darker);
        font-size: 12px;
        position: absolute;
        top: 46%;
        left: 49%;
    }
}
</style>
