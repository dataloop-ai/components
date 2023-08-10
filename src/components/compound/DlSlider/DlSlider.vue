<template>
    <div
        :id="uuid"
        class="slider-content"
        :style="sliderStyles"
    >
        <div
            v-if="editable"
            class="slider editable"
            data-test="editable-slider"
        >
            <span class="text capitalize">{{ text }}</span>
            <dl-slider-input
                v-model="sliderValue"
                :min="min"
                :max="max"
                :readonly="readonly"
                :disabled="disabled"
                :style="{ marginRight: '10px' }"
                data-test="editable-slider-input"
            />
            <div class="slider-bar-container">
                <dl-slider-base
                    v-model.number="sliderValue"
                    :min="min"
                    :max="max"
                    :step="step"
                    :color="color"
                    :readonly="readonly"
                    :disabled="disabled"
                    :thumb-size="thumbSize"
                    :snap="snap"
                    :tabindex="tabindex"
                    :name="name"
                />
            </div>
        </div>
        <div
            v-else
            class="slider non-editable"
            data-test="non-editable-slider"
        >
            <div class="header">
                <div class="row text capitalize">
                    {{ text }}
                    <dl-icon
                        v-if="hint"
                        icon="icon-dl-info"
                        size="12px"
                        style="margin-left: 5px"
                    >
                        <dl-tooltip>
                            {{ hint }}
                        </dl-tooltip>
                    </dl-icon>
                </div>
                <div class="right-container capitalize">
                    <dl-button
                        flat
                        size="12px"
                        label="Reset"
                        :disabled="disabled || readonly"
                        data-test="non-editable-slider-button"
                        @click="handleResetButtonClick"
                    />
                    <dl-slider-input
                        id="slider-input"
                        v-model="sliderValue"
                        :min="min"
                        :max="max"
                        :readonly="readonly"
                        :disabled="disabled"
                        data-test="non-editable-slider-input"
                        @change="handleChange"
                    />
                </div>
            </div>
            <div class="slider-bar-container">
                <dl-slider-base
                    v-model.number="sliderValue"
                    :min="min"
                    :max="max"
                    :step="step"
                    :color="color"
                    :readonly="readonly"
                    :thumb-size="thumbSize"
                    :disabled="disabled"
                    :snap="snap"
                    :name="name"
                    @change="handleChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlSliderBase, DlSliderInput } from './components/'
import { DlButton } from '../../basic'
import { DlIcon } from '../../essential'
import { DlTooltip } from '../../shared'
import { getColor, between } from '../../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlSlider',
    components: {
        DlSliderBase,
        DlButton,
        DlSliderInput,
        DlTooltip,
        DlIcon
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        color: {
            type: String,
            default: 'dl-color-secondary'
        },
        textColor: {
            type: String,
            default: 'dl-color-darker'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        editable: {
            type: Boolean,
            default: false
        },
        thumbSize: {
            type: String,
            default: '10px'
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        readonly: {
            type: Boolean,
            default: false
        },
        snap: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1
        },
        tabindex: {
            type: [String, Number],
            default: '0'
        },
        text: {
            type: String,
            required: true
        },
        modelValue: {
            type: Number,
            default: null,
            validator: (v: number | null) => typeof v === 'number' || v === null
        },
        name: {
            type: String,
            default: null
        },
        hint: {
            type: String,
            default: null,
            required: false
        }
    },
    emits: ['update:model-value', 'change'],
    data() {
        const val =
            this.modelValue === null
                ? this.min
                : between(this.modelValue, this.min, this.max)

        return {
            uuid: `dl-slider-${v4()}`,
            initialValue: val,
            value: val,
            displaySliderInput: false
        }
    },
    computed: {
        valueUpdate(): string {
            return `${this.modelValue}|${this.min}|${this.max}`
        },
        sliderValue: {
            get(): number {
                return this.value
            },
            set(val: number | string): void {
                this.$emit(
                    'update:model-value',
                    typeof val === 'number' ? val : null
                )
            }
        },
        sliderStyles(): Record<string, any> {
            return {
                '--text-color': getColor(this.textColor, 'dl-color-darker'),
                '--width': this.width,
                '--thumb-size': parseInt(this.thumbSize) / 2 + 'px',
                '--color': getColor(this.color, 'dl-color-secondary')
            }
        }
    },
    watch: {
        valueUpdate() {
            this.value =
                this.modelValue === null
                    ? this.min
                    : between(this.modelValue, this.min, this.max)
        }
    },
    methods: {
        handleChange(value: number) {
            this.$emit('change', value)
        },
        handleResetButtonClick() {
            if (this.value === this.initialValue) return

            this.sliderValue = this.initialValue
            this.handleChange(this.initialValue)
        }
    }
})
</script>

<style scoped lang="scss">
@import './sliderStyles.scss';

.dl-button {
    padding: 0;
}
</style>
