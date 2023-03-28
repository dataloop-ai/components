<template>
    <div
        class="DlToggleButton"
        :style="{ width: width }"
    >
        <div
            v-for="(btn, idx) in toggleButtons"
            :key="idx"
            :class="{ selected: btn.value === value }"
        >
            <dl-button
                color="black"
                text-color="black"
                outlined
                :label="btn.label"
                @click="handleChange(btn.value)"
            >
                <slot
                    :name="`button-${idx}`"
                    :label="btn.label"
                />
                <slot
                    name="button"
                    :label="btn.label"
                />
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { OptionItem } from './types'
import DlButton from '../DlButton/DlButton.vue'

export default defineComponent({
    name: 'DlToggleButton',
    components: { DlButton },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        modelValue: {
            type: [String, Number],
            default: null
        },
        options: {
            type: Array as () => OptionItem[],
            required: true
        }
    },
    emits: ['update:modelValue', 'change'],
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        },
        toggleButtons() {
            return this.options.slice(0, 3)
        }
    },
    methods: {
        handleChange(value) {
            this.$emit('change', value)
            if (this.value !== value) {
                this.value = value
            } else {
                this.value = null
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.DlToggleButton {
    display: inline-flex;
}
</style>
