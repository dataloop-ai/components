<template>
    <div
        :style="{ width }"
        class="container"
    >
        <dl-button
            v-for="(btn, idx) in toggleButtons"
            :key="idx"
            :styles="getStyles(btn.value === scopedValue)"
            data-test="button"
            fluid
            @click="value = btn.value"
        >
            <span v-if="!$slots.button && !$slots[`button-${idx}`]">
                {{ btn.label }}
            </span>
            <slot
                :label="btn.label"
                :name="`button-${idx}`"
            />
            <slot
                :label="btn.label"
                name="button"
            />
        </dl-button>
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
    data: () => ({
        scopedValue: null as string | number,
        generalStyles: {
            padding: '7px 10px',
            height: '28px',
            fontSize: 'var(--dl-font-size-body)',
            borderRadius: '0'
        },
        nonActiveStyles: {
            color: 'var(--dl-color-darker)',
            borderColor: 'var(--dl-color-separator)',
            background: 'var(--dl-color-bg)'
        },
        activeStyles: {
            color: 'var(--dl-color-secondary)',
            borderColor: 'var(--dl-color-secondary)',
            background: 'var(--dl-color-secondary-opacity)'
        }
    }),
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(value: any) {
                this.$emit('change', value)
                let buttonValue
                if (this.scopedValue !== value) {
                    buttonValue = value
                } else {
                    buttonValue = null
                }
                this.scopedValue = buttonValue
                this.$emit('update:modelValue', buttonValue)
            }
        },
        toggleButtons() {
            return this.options.slice(0, 3)
        }
    },
    created() {
        this.scopedValue = this.value
    },
    methods: {
        getStyles(activeBtn: boolean) {
            return activeBtn
                ? { ...this.generalStyles, ...this.activeStyles }
                : { ...this.generalStyles, ...this.nonActiveStyles }
        }
    }
})
</script>

<style lang="scss" scoped>
.container {
    display: inline-flex;
    border-radius: 2px;
    overflow: hidden;
}
</style>
