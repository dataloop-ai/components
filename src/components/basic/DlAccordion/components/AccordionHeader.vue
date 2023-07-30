<template>
    <div
        class="accordion-header"
        tabindex="0"
        :style="accordionHeadStyles"
        @click="handleClick"
    >
        <dl-icon
            class="expand-icon"
            :size="$props.fontSize"
            :class="{ expanded: isOpen, rightSide }"
            :icon="rightSide ? 'icon-dl-down-chevron' : 'icon-dl-right-chevron'"
            :color="titleColor"
        />
        <div class="header-content">
            <slot
                v-if="hasSlot"
                name="header"
            />
            <span
                v-else
                ref="dlAccordionTitleRef"
                class="accordion-title"
            >
                <dl-tooltip v-if="isOverflowing">
                    {{ title }}
                </dl-tooltip>
                {{ title }}
            </span>
            <span class="flex">
                <dl-icon
                    v-if="hasAdditionalInfo"
                    :size="$props.fontSize"
                    icon="icon-dl-info"
                    class="info-icon"
                />
                <dl-tooltip>
                    {{ additionalInfo }}
                </dl-tooltip>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { DlTooltip } from '../../../shared'
import { DlIcon } from '../../../essential'
import { defineComponent, ref } from 'vue-demi'
import { getColor } from '../../../../utils'
import { useSizeObserver } from '../../../../hooks/use-size-observer'
export default defineComponent({
    name: 'AccordionHeader',
    components: {
        DlIcon,
        DlTooltip
    },
    props: {
        additionalInfo: { type: String!, default: '' },
        defaultOpened: { type: Boolean, default: false },
        fontSize: { type: String, default: '12px' },
        title: { type: String, default: null },
        titleColor: { type: String, default: 'dl-color-medium' },
        isOpen: { type: Boolean, default: false },
        rightSide: { type: Boolean, default: false }
    },
    emits: ['click'],
    setup() {
        const dlAccordionTitleRef = ref(null)
        const { hasEllipsis } = useSizeObserver(dlAccordionTitleRef)

        return {
            dlAccordionTitleRef,
            isOverflowing: hasEllipsis
        }
    },
    computed: {
        accordionHeadStyles(): Record<string, string> {
            return {
                '--dl-title-color': getColor(
                    this.titleColor,
                    'dl-color-medium'
                ),
                '--dl-expand-icon-color': `var(--${
                    this.isOpen ? 'dl-color-darker' : this.titleColor
                })`,
                '--dl-accordion-header-flex-direction': this.rightSide
                    ? 'row-reverse'
                    : 'row',
                '--dl-accordion-header-fontsize': this.fontSize
            }
        },
        hasSlot(): boolean {
            return this.$slots.header !== undefined
        },
        hasAdditionalInfo(): boolean {
            return this.additionalInfo !== ''
        }
    },
    methods: {
        handleClick(e: Event) {
            this.$emit('click', e)
        }
    }
})
</script>

<style scoped lang="scss">
.accordion-header {
    padding: var(--dl-accordion-header-padding, 12px 16px);
    cursor: pointer;
    font-size: var(--dl-accordion-header-fontsize);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: var(--dl-accordion-header-flex-direction);
    color: var(--dl-title-color);
}

.accordion-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-content {
    max-width: calc(100% - 0px);
    flex-grow: 1;
    color: var(--dl-title-color);
    display: flex;
    align-items: center;
    gap: 5px;
    text-align: left;
}

.info-icon {
    color: var(--dl-title-color);
    display: flex !important;
}

.expand-icon {
    display: flex !important;
    color: var(--dl-expand-icon-color);
    transition: all 300ms;

    &.rightSide {
        padding-left: 10px;
        padding-right: 16px;
    }

    &.expanded.rightSide {
        transform: rotate(180deg);
    }

    &.expanded {
        transform: rotate(90deg);
    }
}
</style>
