<template>
    <div :id="uuid" class="slider-content" :style="sliderStyles">
        <div v-if="slim" class="slider slim" data-test="slim-slider">
            <span class="text capitalize">{{ text }}</span>
            <dl-slider-input
                v-model="value"
                :min="min"
                :max="max"
                :readonly="readonly"
                :disabled="disabled"
                :style="{ marginRight: '10px' }"
                data-test="slim-slider-input"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <div class="slider-bar-container">
                <dl-slider-base
                    v-model.number="value"
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
        <div v-else class="slider non-slim" data-test="non-slim-slider">
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
                        data-test="non-slim-slider-button"
                        @click="handleResetButtonClick"
                    />
                    <dl-slider-input
                        id="slider-input"
                        v-model="value"
                        :min="min"
                        :max="max"
                        :readonly="readonly"
                        :disabled="disabled"
                        data-test="non-slim-slider-input"
                        @change="onChange"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    />
                </div>
            </div>
            <div class="slider-bar-container">
                <dl-slider-base
                    v-model.number="value"
                    :min="min"
                    :max="max"
                    :step="step"
                    :color="color"
                    :readonly="readonly"
                    :thumb-size="thumbSize"
                    :disabled="disabled"
                    :snap="snap"
                    :name="name"
                    @change="onChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue-demi'
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
        slim: {
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
        defaultValue: {
            type: Number,
            default: null
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
    emits: ['update:model-value', 'change', 'input-focus', 'input-blur'],
    setup(props, { emit }) {
        const {
            modelValue,
            min,
            max,
            textColor,
            width,
            thumbSize,
            color,
            defaultValue
        } = toRefs(props)
        const initialValue = ref(
            modelValue.value === null
                ? min.value
                : between(modelValue.value, min.value, max.value)
        )
        const displaySliderInput = ref(false)

        const value = computed({
            get: () => {
                return modelValue.value === null
                    ? min.value
                    : between(modelValue.value, min.value, max.value)
            },
            set(val: number) {
                if (val === modelValue.value) {
                    return
                }
                emit('update:model-value', val)
                emit('change', val)
            }
        })

        const sliderStyles = computed<Record<string, any>>(() => {
            return {
                '--text-color': getColor(textColor.value, 'dl-color-darker'),
                '--width': width.value,
                '--thumb-size': parseInt(thumbSize.value) / 2 + 'px',
                '--color': getColor(color.value, 'dl-color-secondary')
            }
        })

        const onChange = (val: number) => {
            value.value = between(val, min.value, max.value)
        }

        const handleResetButtonClick = () => {
            onChange(defaultValue.value ?? initialValue.value)
        }

        watch(
            modelValue,
            () => {
                if (modelValue.value === value.value) {
                    return
                }

                if (modelValue.value === null) {
                    value.value = min.value
                } else {
                    value.value = between(
                        modelValue.value,
                        min.value,
                        max.value
                    )
                }
            },
            { immediate: true }
        )

        return {
            uuid: `dl-slider-${v4()}`,
            initialValue,
            value,
            sliderStyles,
            displaySliderInput,
            onChange,
            handleResetButtonClick
        }
    },
    methods: {
        handleFocus(e: Event) {
            this.$emit('input-focus', e)
        },
        handleBlur(e: Event) {
            this.$emit('input-blur', e)
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
