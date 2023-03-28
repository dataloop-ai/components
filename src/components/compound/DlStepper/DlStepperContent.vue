<template>
    <div class="stepper-content">
        <slot name="header">
            <div class="stepper-content--header">
                <dl-typography
                    size="h3"
                    variant="h3"
                    style="text-transform: capitalize"
                >
                    {{ title }}
                </dl-typography>
                <div class="flex justify-end">
                    <dl-chip
                        v-if="error"
                        text-color="dl-color-text-darker-buttons"
                        color="dl-color-negative-background"
                    >
                        {{ error }}
                    </dl-chip>
                    <dl-chip
                        v-else-if="completed"
                        text-color="dl-color-text-darker-buttons"
                        color="dl-color-positive-background"
                    >
                        completed
                    </dl-chip>
                </div>
            </div>
        </slot>
        <div class="stepper-content--content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlChip from '../DlChip'
import DlTypography from '../Basic/DlTypography/DlTypography.vue'

export default defineComponent({
    name: 'DlStepperContent',
    components: {
        DlChip,
        DlTypography
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        error: {
            type: String,
            default: ''
        },
        completed: Boolean
    },
    emits: ['next', 'prev']
})
</script>
<style scoped lang="scss">
.stepper-content {
    padding: 20px 50px;
    // max-height: calc(100vh - 175px);

    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 70px;

    overflow: auto;
    &::-webkit-scrollbar {
        width: 1px;
        height: 1px;
    }

    &--header {
        display: flex;
        height: 20px;
    }

    &--content {
        &::-webkit-scrollbar {
            width: 1px;
            height: 1px;
        }
    }

    &--content {
        margin-top: 20px;
    }

    .justify-end {
        margin-left: auto;
    }
}
</style>
