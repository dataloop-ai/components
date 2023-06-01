<template>
    <input
        ref="sliderInput"
        :value="sliderValue"
        type="number"
        :min="min"
        :max="max"
        :readonly="readonly"
        :disabled="disabled"
        @input="sliderValue = $event"
        @change="handleChange"
    >
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
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
    computed: {
        sliderValue: {
            get(): number | undefined {
                return this.modelValue
            },
            set(evt: any): void {
                const val = evt.target.value

                if (val === '') return

                const { value } = getInputValue(val, this.min, this.max)

                ;(this.$refs.sliderInput as HTMLInputElement).value = value

                this.$emit('update:model-value', Number(value))
            }
        }
    },
    methods: {
        handleChange(evt: any) {
            const val = evt.target.value
            if (val === '') return

            const { value } = getInputValue(val, this.min, this.max)

            ;(this.$refs.sliderInput as HTMLInputElement).value = value

            this.$emit('change', Number(value))
        }
    },
    template: 'dl-slider-input'
})
</script>

<style scoped>
input[type='number'] {
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
