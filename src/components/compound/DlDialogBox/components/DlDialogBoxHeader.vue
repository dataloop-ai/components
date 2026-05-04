<template>
    <div class="root-container">
        <div style="width: 95%; height: 100%">
            <dl-button
                v-if="hasBackButton"
                dense
                label="Back"
                icon="icon-dl-arrow-left"
                flat
                text-color="dl-color-medium"
                style="padding: 0; margin-bottom: 10px"
                @click.stop.prevent="$emit('onClose')"
            />
            <h2 v-if="hasTitle" class="title">
                <slot name="title">
                    <dl-ellipsis :text="title" />
                </slot>
            </h2>
            <p v-if="hasSubtitle" class="subtitle">
                <slot name="subtitle">
                    <dl-ellipsis :text="subtitle" />
                </slot>
            </p>
        </div>
        <div class="actions-container">
            <slot name="actions" :button-props="actionButtonProps" />
            <dl-button
                v-if="closeButton"
                class="close-button"
                v-bind="actionButtonProps"
                icon="icon-dl-close"
                @click="$emit('onClose')"
            >
                <dl-tooltip :delay="800"> Close </dl-tooltip>
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import DlButton from '../../../basic/DlButton/DlButton.vue'
import { setIconPadding } from '../../../basic/DlButton/utils'
import { DlEllipsis } from '../../../essential'
import { DlTooltip } from '../../../shared'

export default defineComponent({
    name: 'DlDialogBoxHeader',
    components: {
        DlButton,
        DlEllipsis,
        DlTooltip
    },
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        closeButton: { type: Boolean, default: true },
        hasBackButton: Boolean
    },
    emits: ['onClose'],
    setup(props, { slots }) {
        const hasTitle = computed(() => !!props.title || !!slots.title)
        const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle)
        const actionButtonProps = {
            iconSize: '16px',
            flat: true,
            size: 'm',
            textColor: 'var(--dell-gray-600)',
            hoverBgColor: 'var(--dell-gray-100)',
            pressedBgColor: 'var(--dell-gray-200)',
            hoverTextColor: 'var(--dell-gray-800)',
            pressedTextColor: 'var(--dell-gray-800)',
            padding: '4px'
        }

        return { hasTitle, hasSubtitle, actionButtonProps }
    }
})
</script>

<style lang="scss" scoped>
.root-container {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
}

.title {
    font-family: var(--dl-typography-header-h5-font-family);
    font-size: var(--dl-typography-header-h5-font-size);
    line-height: var(--dl-typography-header-h5-line-height);
    font-weight: var(--dl-typography-header-h5-font-weight);
    margin: 0;
    color: var(--dell-gray-800);
}

.subtitle {
    font-family: var(--dl-typography-body-body3-font-family);
    font-size: var(--dl-typography-body-body3-font-size);
    line-height: var(--dl-typography-body-body3-line-height);
    font-weight: var(--dl-typography-body-body3-font-weight);
    color: var(--dell-gray-600);
    margin: 0;
}

.actions-container {
    margin-top: 5px;
    display: flex;
    gap: var(--dl-dialog-box-header-actions-gap, 4px);
    align-items: flex-start;
    ::v-deep button.dl-button {
        --dl-button-border-radius: 0;
        border: none;
        --dl-button-border: none;
        &:focus-visible {
            --dl-button-border-radius: 2px;
        }
    }
}
</style>
