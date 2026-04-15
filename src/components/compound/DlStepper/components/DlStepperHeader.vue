<template>
    <div class="dl-stepper-header">
        <slot>
            <dl-typography size="header5" variant="h2" color="dell-gray-800">
                {{ headerTitle }}
            </dl-typography>
        </slot>
        <dl-button
            v-if="!hideCloseButton"
            text-color="dl-color-darker"
            flat
            icon="icon-dl-close"
            size="xl"
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
        const closeIconSizePadding = `0 0 0 0`
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
</style>
