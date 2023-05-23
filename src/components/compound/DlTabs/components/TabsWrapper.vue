<template>
    <div :class="['tabs-wrapper', { scrollable: isScrollable }]">
        <dl-button
            v-if="isScrollable"
            :size="buttonSize"
            flat
            padding="0"
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
            :size="buttonSize"
            data-qa="right-arrow-button"
            text-color="dl-color-darker"
            flat
            padding="0"
            :disabled="isAtEnd"
            :class="rightArrowClass"
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
import { DlButton } from '../../../basic'
import { DlIcon } from '../../../essential'

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
        buttonSize(): string {
            return this.isVertical ? 's' : 'm'
        },
        hasTopRightSlot(): boolean {
            return !!this.$parent.$slots['top-right']
        },
        rightArrowClass(): string {
            if (this.hasTopRightSlot && !this.isVertical) {
                return 'arrow-button--right'
            }
            return 'arrow-button'
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

.arrow-button {
    &--right {
        border-bottom: 1px solid var(--dl-color-separator);
        height: calc(100% - 1px);
        display: flex;
    }
}

.tabs {
    flex-grow: 1;
    ::v-deep .dl-button-content {
        padding-top: 1px;
        min-height: var(--dl-tabs-arrows-size);
        width: var(--dl-tabs-arrows-size);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
