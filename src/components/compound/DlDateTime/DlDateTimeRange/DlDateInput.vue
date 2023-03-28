<template>
    <div
        class="dl-date-input"
        :class="{
            'dl-date-input-focused': focused && !disabled,
            'dl-date-input-disabled': disabled
        }"
    >
        <dl-icon
            icon="icon-dl-date"
            :color="disabled ? 'dl-color-disabled' : 'dl-color-darker'"
            size="16px"
        />
        <div class="dl-date-input--input-wrapper">
            <input
                type="text"
                :value="text"
                :disabled="disabled"
                :style="inputStyle"
                readonly
                @focus="focused = true"
                @blur="focused = false"
            >
        </div>
        <slot />
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../../essential'

export default defineComponent({
    components: {
        DlIcon
    },
    props: {
        text: {
            type: String,
            default: ''
        },
        disabled: Boolean,
        inputStyle: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        }
    },
    data() {
        return {
            focused: false
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-date-input {
    background-color: var(--dl-color-bg);
    border: 1px solid var(--dl-color-separator);
    color: var(--dl-color-darker);
    border-radius: 2px;
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    box-sizing: border-box;

    &-focused {
        border-color: var(--dl-color-secondary);

        &:hover {
            border-color: var(--dl-color-hover);
        }
    }

    &-disabled {
        border-color: var(--dl-color-separator);
        color: var(--dl-color-disabled);
        cursor: not-allowed;

        &:hover {
            border-color: var(--dl-color-separator);
        }
    }

    &--input-wrapper {
        display: flex;
        padding-left: 10px;

        input {
            border: none;
            color: var(--dl-color-darker);
            font-size: 12px;
            height: 14px;
            outline: none;
            background: none;
            padding: 0px;

            &:disabled {
                color: var(--dl-color-disabled);
                cursor: not-allowed;
            }
        }
    }
}
</style>
