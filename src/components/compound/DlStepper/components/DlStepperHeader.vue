<template>
    <div class="dl-stepper-header">
        <slot>
            <dl-typography size="header5" variant="h2" color="dell-gray-800">
                {{ headerTitle }}
            </dl-typography>
        </slot>
        <dl-button
            v-if="!hideCloseButton"
            class="close-button"
            icon="icon-dl-close"
            icon-size="16px"
            flat
            size="m"
            text-color="var(--dell-gray-600)"
            hover-bg-color="var(--dell-gray-100)"
            pressed-bg-color="var(--dell-gray-200)"
            hover-text-color="var(--dell-gray-800)"
            pressed-text-color="var(--dell-gray-800)"
            :padding="closeIconSizePadding"
            @click="$emit('close')"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton } from '../../../basic'
import { setIconPadding } from '../../../basic/DlButton/utils'
import { DlTypography } from '../../../essential'

export default defineComponent({
    name: 'DlStepperHeader',
    components: {
        DlTypography,
        DlButton
    },
    props: {
        headerTitle: {
            type: String,
            required: false,
            default: ''
        },
        hideCloseButton: Boolean
    },
    emits: ['close'],
    setup() {
        const closeIconSizePadding = `4px`
        return { closeIconSizePadding }
    }
})
</script>
<style lang="scss" scoped>
.dl-stepper-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--dl-color-separator);
}
.close-button {
    ::v-deep button.dl-button {
        --dl-button-border-radius: 0;
        border: none;
        &:focus-visible {
            --dl-button-border-radius: 2px;
        }
    }
}
</style>
