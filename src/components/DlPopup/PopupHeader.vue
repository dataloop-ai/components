<template>
    <div
        class="popup-header"
        :style="cssVars"
    >
        <slot
            v-if="hasHeaderSlot"
            name="header"
        />
        <div
            v-else
            class="header-content"
        >
            <span class="title">
                {{ title }}
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
                class="hide-button"
                @click="handleHide"
            >
                <slot
                    v-if="hasHideButtonSlot"
                    name="hide-button"
                />
                <dl-icon
                    v-else
                    color="dl-color-darker"
                    icon="icon-dl-close"
                    size="8px"
                />
            </span>
            <span class="subtitle">{{ subtitle }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlTooltip from '../DlTooltip.vue'
import DlIcon from '../DlIcon.vue'

export default defineComponent({
    components: {
        DlIcon,
        DlTooltip
    },
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        additionalInfo: { type: String, default: '' },
        withCloseButton: { type: Boolean, default: false }
    },
    emits: ['hide-button-clik'],
    computed: {
        hasHeaderSlot(): boolean {
            return this.$slots.header !== undefined
        },
        hasHideButtonSlot(): boolean {
            return this.$slots['hide-button'] !== undefined
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
        handleHide(e: Event) {
            this.$emit('hide-button-clik', e)
        }
    }
})
</script>

<style scoped lang="scss">
.popup-header {
    max-width: 100%;
    padding: 0 10px 20px 16px;
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

.hide-button {
    display: flex;
    justify-content: center;
    align-items: center;
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
