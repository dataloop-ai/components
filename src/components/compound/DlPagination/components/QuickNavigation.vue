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
        />
        <dl-link
            class="dl-pagination--quick_nav_link"
            color="dell-blue-600"
            :disabled="disabled"
            hover-color="dell-blue-700"
            @click="handleNavigation"
        >
            Go
        </dl-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTypography } from '../../../essential'
import { stopAndPrevent } from '../../../../utils'
import { admissibleKeys } from '../../../../utils/nav-keys-constants'
import { DlLink } from '../../../essential'

export default defineComponent({
    name: 'QuickNavigation',
    components: {
        DlTypography,
        DlLink
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: { type: Number, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        disabled: Boolean
    },
    emits: ['update:model-value'],
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

            this.$emit('update:model-value', Number(this.inputValue))
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
        color: var(--dell-gray-800);
        padding-right: 16px;
        & p {
            padding-right: 4px;
        }
    }
    &--navigation_input {
        border: 1px solid var(--dell-gray-500);
        border-radius: 2px;
        color: var(--dell-gray-800);
        outline: none;
        background: none;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 10px;
        max-width: 30px; // 40px - 10px (paddings)
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        &:hover {
            border-color: var(--dell-blue-600);
        }

        &:focus {
            border-color: var(--dell-blue-500);
        }

        &:disabled {
            border-color: var(--dell-gray-500);
            color: var(--dell-gray-500);
            cursor: not-allowed;

            &:hover {
                border-color: var(--dell-gray-500);
            }
        }
    }
    &--quick_nav_link {
        margin-left: 5px;
    }
}

::v-deep .dl-button {
    padding: 4px 5px;
    text-transform: uppercase;
}
</style>
