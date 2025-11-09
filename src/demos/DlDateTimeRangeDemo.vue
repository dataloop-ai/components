<template>
    <div class="dl-dtr">
        <div class="dl-dtr--options">
            <span class="dl-dtr--options_title">General Configuration</span>
            <div class="dl-dtr--option date-range-options">
                <span class="dl-dtr--option_title">Show time:</span>
                <dl-switch
                    v-model="switchState"
                    value="showTime"
                    left-label="No"
                    right-label="Yes"
                    class="dl-dtr--option_switch"
                />
            </div>
            <div class="dl-dtr--option date-range-options">
                <span class="dl-dtr--option_title">Type: {{ type }}</span>
                <dl-switch
                    v-model="switchState"
                    value="type"
                    left-label="Day"
                    right-label="Month"
                    class="dl-dtr--option_switch"
                />
            </div>
            <div class="dl-dtr--option date-range-options">
                <span class="dl-dtr--option_title">Mode:</span>
                <dl-switch
                    v-model="switchState"
                    value="mode"
                    left-label="Single"
                    right-label="Multi"
                    class="dl-dtr--option_switch"
                />
            </div>
            <div style="margin-top: 10px" class="dl-dtr--option__range">
                <div class="date-range-options">
                    <span class="dl-dtr--option_title">Available Range: </span>
                    <dl-switch
                        v-model="switchState"
                        value="range"
                        class="dl-dtr--option_switch"
                        @input="handleRange"
                    />
                </div>
                <div class="date-range-options">
                    <span class="dl-dtr--option_title">Auto Close: </span>
                    <dl-switch
                        v-model="switchState"
                        value="auto-close"
                        class="dl-dtr--option_switch"
                    />
                </div>
                <div class="date-range-options">
                    <span class="dl-dtr--option_title"
                    >Includes end date of current Month:
                    </span>
                    <dl-switch
                        v-model="switchState"
                        value="includes-current-month-end"
                        class="dl-dtr--option_switch"
                    />
                </div>
                <div class="date-range-options">
                    <span class="dl-dtr--option_title"
                    >Clear select first option:
                    </span>
                    <dl-switch
                        v-model="switchState"
                        value="should-clear-select-first-option"
                        class="dl-dtr--option_switch"
                    />
                </div>

                <br />
                <span>From</span>
                <input
                    type="date"
                    :disabled="!range"
                    :value="availableRangeFrom"
                    class="dl-dtr--range-input"
                    placeholder="from"
                    @input="setRangeFrom"
                />
                <span style="margin-left: 5px">To</span>
                <input
                    :disabled="!range"
                    type="date"
                    :value="availableRangeTo"
                    class="dl-dtr--range-input"
                    placeholder="to"
                    @input="setRangeTo"
                />
            </div>
        </div>
        <div>
            {{ date }}
        </div>
        <div class="dl-dtr--input">
            <div style="width: 500px">
                <dl-date-time-range
                    v-model="date"
                    :type="type"
                    :available-range="range ? availableRange : null"
                    :mode="mode"
                    :show-time="showTime"
                    :auto-close="autoClose"
                    :including-current-month="includesCurrentMonthEnd"
                    :disabled-type="type === 'day' ? 'month' : 'day'"
                    :should-clear-select-first-option="
                        shouldClearSelectFirstOption
                    "
                    @set-type="handleSetType"
                    @change="handleModelValueUpdate"
                />
            </div>
        </div>
        <div style="width: 500px">
            With 100% width
            <dl-date-time-range
                v-model="date"
                :type="type"
                width="100%"
                :available-range="range ? availableRange : null"
                :mode="mode"
                :show-time="showTime"
                :auto-close="autoClose"
                :including-current-month="includesCurrentMonthEnd"
                :should-clear-select-first-option="shouldClearSelectFirstOption"
                :disabled-type="type === 'day' ? 'month' : 'day'"
                @set-type="handleSetType"
                @change="handleModelValueUpdate"
            />
        </div>
        <div style="width: 500px">
            <div
                v-if="date"
                class="row"
                style="
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                "
            >
                to
                <input
                    type="date"
                    :disabled="!range"
                    :value="date.from"
                    class="dl-dtr--range-input"
                    placeholder="from"
                    @input="date.from = new Date($event.target.value)"
                />

                from
                <input
                    type="date"
                    :disabled="!range"
                    :value="date.to"
                    class="dl-dtr--range-input"
                    placeholder="from"
                    @input="date.to = new Date($event.target.value)"
                />
            </div>

            vmodel date: {{ date }}
            <dl-date-time-range
                v-model="date"
                :type="type"
                width="100%"
                :available-range="range ? availableRange : null"
                :mode="mode"
                :show-time="showTime"
                :auto-close="autoClose"
                :including-current-month="includesCurrentMonthEnd"
                @set-type="handleSetType"
                @change="handleModelValueUpdate"
            />
        </div>
        <div style="width: 500px; margin-top: 30px">
            <div style="margin-bottom: 10px; font-weight: bold">
                Inline Mode
            </div>
            <dl-date-time-range
                v-model="date"
                :type="type"
                width="100%"
                :available-range="range ? availableRange : null"
                :mode="mode"
                :show-time="showTime"
                :auto-close="autoClose"
                :including-current-month="includesCurrentMonthEnd"
                :should-clear-select-first-option="shouldClearSelectFirstOption"
                :disabled-type="type === 'day' ? 'month' : 'day'"
                view-mode="inline"
                @set-type="handleSetType"
                @change="handleModelValueUpdate"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlSwitch, DlDateTimeRange } from '../components'
import { DateInterval } from '../components/types'

export default defineComponent({
    components: {
        DlSwitch,
        DlDateTimeRange
    },
    data(): {
        date: DateInterval
        switchState: any[]
        availableRange: Partial<DateInterval>
    } {
        const from = new Date()
        from.setDate(from.getDate() - 35)
        const to = new Date()
        to.setDate(to.getDate() + 35)

        return {
            date: null,
            availableRange: {
                from,
                to
            },
            switchState: ['range']
        }
    },
    computed: {
        type(): string {
            return this.switchState.includes('type') ? 'month' : 'day'
        },
        mode(): string {
            return this.switchState.includes('mode') ? 'multi' : 'single'
        },
        showTime(): boolean {
            return this.switchState.includes('showTime')
        },
        range(): boolean {
            return this.switchState.includes('range')
        },
        availableRangeFrom(): string {
            return this.availableRange?.from?.toISOString().split('T')[0] ?? ''
        },
        availableRangeTo(): string {
            return this.availableRange?.to?.toISOString().split('T')[0] ?? ''
        },
        autoClose(): boolean {
            return this.switchState.includes('auto-close')
        },
        includesCurrentMonthEnd(): boolean {
            return this.switchState.includes('includes-current-month-end')
        },
        shouldClearSelectFirstOption(): boolean {
            return this.switchState.includes('should-clear-select-first-option')
        }
    },
    methods: {
        handleModelValueUpdate(value: DateInterval) {
            console.log('Date: ', value)
        },
        handleSetType(value: string) {
            if (value === 'day') {
                const typeIndex = this.switchState.findIndex(
                    (t) => t === 'type'
                )
                if (typeIndex > -1) {
                    this.switchState.splice(typeIndex, 1)
                }
            } else {
                this.switchState.push('type')
            }
        },
        setRangeFrom({ target }: { target: HTMLInputElement }) {
            this.availableRange = {
                from: target.value ? new Date(target.value) : null,
                to: this.availableRange?.to
            }
        },
        setRangeTo({ target }: { target: HTMLInputElement }) {
            this.availableRange = {
                to: target.value ? new Date(target.value) : null,
                from: this.availableRange?.from
            }
        },
        handleRange({ target }: { target: HTMLInputElement }) {
            if (!target.checked) this.availableRange = null
        }
    }
})
</script>
<style lang="scss" scoped>
.date-range-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.dl-dtr {
    display: flex;
    justify-content: center;
    padding-top: 30px;

    &--range-input {
        height: 18px;
        padding: 5px;
        color: darkgray;
        margin-top: 10px;
        margin-left: 5px;
    }

    &--options {
        color: var(--dl-color-darker);
        display: flex;
        flex-direction: column;
        padding: 0 30px 0 0;
        text-align: left;

        &_title {
            font-size: 20px;
        }
    }

    &--option {
        padding: 8px;

        &__range {
            font-size: 12px;
        }
    }

    &--option_title {
        font-size: 14px;
    }

    &--option_switch {
        font-size: 12px;
    }

    &--input {
        display: flex;
        justify-content: center;
    }
}
</style>
