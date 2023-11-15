<template>
    <input
        ref="sliderInput"
        :value="modelRef"
        type="text"
        :min="min"
        :max="max"
        :readonly="readonly"
        :disabled="disabled"
        @input="handleChange"
        @change="handleChange"
    >
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent, ref, toRef, watch } from 'vue-demi'
import { stateManager } from '../../../../StateManager'
import { getInputValue } from '../utils'

export default defineComponent({
    name: 'DlSliderInput',
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Number,
            default: null
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
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:model-value', 'change'],
    setup(props, { emit }) {
        const modelRef = toRef(props, 'modelValue')
        const sliderInput = ref<HTMLInputElement>(null)

        const handleChange = (evt: any) => {
            const validPartialExpressions = [
                '',
                '-',
                '.',
                '-.',
                '-0.',
                '0.',
                '.0'
            ]
            const val = evt.target.value.trim()
            if (validPartialExpressions.includes(val)) return

            const { value } = getInputValue(val, props.min, props.max)

            emit('change', Number(value))
            emit('update:model-value', Number(value))
            if (sliderInput.value) sliderInput.value.value = value
        }

        watch(
            modelRef,
            (newValue, oldValue) => {
                if (isNaN(newValue)) {
                    emit('update:model-value', oldValue)
                    emit('change', oldValue)
                    if (sliderInput.value)
                        sliderInput.value.value = oldValue.toString()
                    return
                }
            },
            { immediate: true, deep: true }
        )

        return {
            sliderInput,
            modelRef,
            handleChange
        }
    },
    template: 'dl-slider-input'
})
</script>

<style scoped>
input[type='text'] {
    width: 31px;
    height: 20px;
    padding-top: 3px;
    padding-left: 5px;
    padding-bottom: 3px;
    color: var(--text-color);
    background-color: transparent;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type='number'] {
    -moz-appearance: textfield;
    border: none;
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
}

input[type='number']:hover {
    border: none;
    border: 1px solid var(--dl-color-hover);
}

input[type='number']:focus-visible {
    border-color: var(--color);
    outline: none;
}

input:disabled {
    border-color: var(--dl-color-separator) !important;
    color: var(--dl-color-disabled);
    cursor: not-allowed;
}
</style>
