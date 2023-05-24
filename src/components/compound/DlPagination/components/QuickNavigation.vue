<template>
    <div class="dl-pagination--quick_navigation">
        <dl-typography> Go to page </dl-typography>
        <input
            v-model="inputValue"
            type="number"
            class="dl-pagination--navigation_input"
            :max="max"
            :min="min"
            :disabled="disabled"
            @keydown="handleKeyDown"
            @keyup="handleKeyUp"
        >
        <dl-button
            size="s"
            flat
            margin="0"
            class="dl-pagination--quick_nav_button"
            :disabled="disabled"
            @click="handleNavigation"
        >
            Go
        </dl-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton } from '../../../basic'
import { DlTypography } from '../../../essential'
import { stopAndPrevent } from '../../../../utils'
import { admissibleKeys } from '../../../../utils/nav-keys-constants'

export default defineComponent({
    name: 'QuickNavigation',
    components: {
        DlTypography,
        DlButton
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        modelValue: { type: Number, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        disabled: Boolean
    },
    emits: ['update:modelValue'],
    data() {
        return {
            inputValue: this.modelValue.toString(),
            lastValue: ''
        }
    },
    watch: {
        modelValue() {
            this.inputValue = this.modelValue.toString()
        }
    },
    methods: {
        handleNavigation() {
            const numericValue = Number(this.inputValue)

            if (numericValue < this.min) {
                this.inputValue = this.min.toString()
            }

            if (numericValue > this.max) {
                this.inputValue = this.max.toString()
            }

            this.$emit('update:modelValue', Number(this.inputValue))
        },
        handleKeyDown(e: KeyboardEvent) {
            if (
                (Number.isNaN(Number(e.key)) &&
                    !admissibleKeys.includes(e.key)) ||
                e.key === ' '
            ) {
                stopAndPrevent(e)
            }
        },
        handleKeyUp(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.handleNavigation()
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination {
    &--quick_navigation {
        display: flex;
        align-items: center;
        color: var(--dl-color-darker);
        padding-right: 16px;
        & p {
            padding-right: 4px;
        }
    }
    &--navigation_input {
        border: 1px solid var(--dl-color-separator);
        border-radius: 2px;
        color: var(--dl-color-darker);
        outline: none;
        background: none;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 10px;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        &:hover {
            border-color: var(--dl-color-hover);
        }

        &:focus {
            border-color: var(--dl-color-secondary);
        }

        &:disabled {
            border-color: var(--dl-color-disabled);
            color: var(--dl-color-disabled);
            cursor: not-allowed;

            &:hover {
                border-color: var(--dl-color-disabled);
            }
        }
        max-width: 30px; // 40px - 10px (paddings)
        -moz-appearance: textfield;
    }
}

::v-deep .dl-button {
    padding: 4px 5px;
    text-transform: uppercase;
}
</style>
