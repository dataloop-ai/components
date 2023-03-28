<template>
    <div
        :class="['tabs-wrapper', { scrollable: isScrollable }]"
        :style="cssVars"
    >
        <dl-button
            v-if="isScrollable"
            size="l"
            flat
            :disabled="isAtStart"
            data-qa="left-arrow-button"
            class="arrow-button"
            text-color="dl-color-darker"
            @click="handleLeftArrowClick"
        >
            <dl-icon
                icon="icon-dl-left-chevron"
                size="16px"
            />
        </dl-button>
        <slot class="tabs" />
        <dl-button
            v-if="isScrollable"
            size="l"
            data-qa="right-arrow-button"
            text-color="dl-color-darker"
            flat
            :disabled="isAtEnd"
            class="arrow-button"
            @click="handleRightArrowClick"
        >
            <dl-icon
                icon="icon-dl-right-chevron"
                size="16px"
            />
        </dl-button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton } from '../DlButton'
import DlIcon from '../DlIcon.vue'

export default defineComponent({
    components: {
        DlButton,
        DlIcon
    },
    props: {
        isScrollable: { type: Boolean, default: false },
        isVertical: { type: Boolean, default: false },
        isAtStart: { type: Boolean, default: true },
        isAtEnd: { type: Boolean, default: false }
    },
    emits: ['left-arrow-click', 'right-arrow-click'],
    computed: {
        cssVars(): string {
            return `
                --dl-tabs-arrows-size: ${this.isVertical ? '24px' : '40px'}
            `
        }
    },
    methods: {
        handleLeftArrowClick(e: Event) {
            if (this.isAtStart === false) {
                this.$emit('left-arrow-click', e)
            }
        },
        handleRightArrowClick(e: Event) {
            if (this.isAtEnd === false) {
                this.$emit('right-arrow-click', e)
            }
        }
    }
})
</script>
<style scoped lang="scss">
.tabs-wrapper {
    max-width: 100%;
    display: flex;
    align-items: center;
}

.tabs {
    flex-grow: 1;
}

::v-deep .dl-button {
    padding: 0px;

    &:disabled {
        pointer-events: none;
    }
}

::v-deep .dl-btn-content {
    padding-top: 1px;
    min-height: var(--dl-tabs-arrows-size);
    width: var(--dl-tabs-arrows-size);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
