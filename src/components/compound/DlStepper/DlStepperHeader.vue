<template>
    <div class="dl-stepper-header">
        <slot>
            <dl-typography
                size="h2"
                variant="h2"
            >
                {{ headerTitle }}
            </dl-typography>
        </slot>
        <dl-button
            v-if="!hideCloseBtn"
            text-color="dl-color-darker"
            flat
            icon="icon-dl-close"
            @click="$emit('close')"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTypography, DlButton } from '../'

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
        hideCloseBtn: Boolean
    },
    emits: ['close']
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
