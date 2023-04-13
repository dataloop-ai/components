<template>
    <div
        :style="{ width }"
        class="container"
    >
        <dl-button
            v-for="(btn, idx) in toggleButtons"
            :key="idx"
            :styles="
                getStyles(btn.value === scopedValue, hoverBtn === btn.value)
            "
            data-test="button"
            fluid
            @mouseenter="hoverBtn = btn.value"
            @mouseleave="hoverBtn = null"
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
import { DlToggleButtonOption } from './types'
import { DlButton } from '../../basic'
import { ButtonsStyles } from './config'

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
            type: Array as () => DlToggleButtonOption[],
            required: true
        }
    },
    emits: ['update:modelValue', 'change'],
    data: () => ({
        scopedValue: null as string | number,
        hoverBtn: null as string | number
    }),
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(value: string | number) {
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
        getStyles(activeBtn: boolean, hovered: boolean) {
            if (activeBtn) {
                return ButtonsStyles.activeStyles
            } else if (hovered) {
                return ButtonsStyles.hoverStyles
            } else {
                return ButtonsStyles.nonActiveStyles
            }
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
