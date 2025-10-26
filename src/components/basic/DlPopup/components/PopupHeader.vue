<template>
    <div class="popup-header" :style="cssVars">
        <slot v-if="hasHeaderSlot" name="header" />
        <div v-else class="header-content">
            <span class="title">
                <dl-ellipsis :text="title" />
                <span class="info-icon">
                    <dl-icon
                        v-if="hasAdditionalInfo"
                        size="12px"
                        icon="icon-dl-info"
                        class="info-icon"
                    />
                    <dl-tooltip>
                        {{ additionalInfo }}
                    </dl-tooltip>
                </span>
            </span>
            <span
                v-if="withCloseButton"
                class="close-button"
                @click="handleClick"
            >
                <slot v-if="hasCloseButtonSlot" name="close-button" />
                <dl-icon
                    v-else
                    color="dl-color-darker"
                    icon="icon-dl-close"
                    size="16px"
                />
            </span>
            <span class="subtitle">
                <dl-ellipsis :text="subtitle" />
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlIcon, DlEllipsis } from '../../../essential'
import { DlTooltip } from '../../../shared'

export default defineComponent({
    components: {
        DlIcon,
        DlTooltip,
        DlEllipsis
    },
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        additionalInfo: { type: String, default: '' },
        withCloseButton: { type: Boolean, default: false }
    },
    emits: ['close-button-click'],
    computed: {
        hasHeaderSlot(): boolean {
            return this.$slots.header !== undefined
        },
        hasCloseButtonSlot(): boolean {
            return this.$slots['close-button'] !== undefined
        },
        hasAdditionalInfo(): boolean {
            return this.additionalInfo !== ''
        },
        cssVars(): Record<string, string> {
            return {
                '--popup-header-template-columns': this.withCloseButton
                    ? '1fr auto'
                    : '100%'
            }
        }
    },
    methods: {
        handleClick(e: Event) {
            this.$emit('close-button-click', e)
        }
    }
})
</script>

<style scoped lang="scss">
.popup-header {
    max-width: 100%;
    padding: 16px 10px 16px 16px;
}

.header-content {
    display: grid;
    grid-template-columns: var(--popup-header-template-columns);
    column-gap: 10px;
}

.title {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--dl-color-darker);
}

.close-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4px;
    cursor: pointer;
    transition: color 200ms;
    &:hover {
        color: var(--dl-color-secondary);
    }
}

.subtitle {
    color: var(--dl-color-medium);
    padding-top: 3px;
    font-size: var(--dl-font-size-small);
    grid-column: 1 / 3;
    grid-row: 2;
}
</style>
