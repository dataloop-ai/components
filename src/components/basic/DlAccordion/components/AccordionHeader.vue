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
            :icon="rightSide ? openedIcon : closedIcon"
            :color="titleColor"
        />
        <div class="header-content">
            <slot name="header">
                <span ref="dlAccordionTitleRef" class="accordion-title">
                    <dl-tooltip v-if="isOverflowing">
                        {{ title }}
                    </dl-tooltip>
                    {{ title }}
                </span>
            </slot>
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
        fontWeight: { type: String, default: '400' },
        title: { type: String, default: null },
        titleColor: { type: String, default: 'dl-color-medium' },
        isOpen: { type: Boolean, default: false },
        rightSide: { type: Boolean, default: false },
        closedIcon: { type: String, default: 'icon-dl-right-chevron' },
        openedIcon: { type: String, default: 'icon-dl-down-chevron' },
        backgroundColor: { type: String, default: 'dl-color-fill' },
        withBackground: { type: Boolean, default: false }
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
                '--dl-accordion-header-fontsize': this.fontSize,
                '--dl-accordion-header-fontweight': this.fontWeight,
                '--dl-accordion-header-background-color':
                    this.withBackground && !this.isOpen
                        ? getColor(this.backgroundColor)
                        : '',
                '--dl-accordion-header-border-radius':
                    this.withBackground && !this.isOpen ? '4px' : '0px',
                '--dl-accordion-header-padding': this.withBackground
                    ? '4px'
                    : '12px 16px',
                '--dl-accordion-header-margin-bottom': this.withBackground
                    ? '2px'
                    : '0px'
            }
        },
        hasSlot(): boolean {
            return this.$slots.header !== undefined
        },
        hasAdditionalInfo(): boolean {
            return this.additionalInfo.length !== 0
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
    font-weight: var(--dl-accordion-header-fontweight);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: var(--dl-accordion-header-flex-direction);
    color: var(--dl-title-color);
    margin-bottom: var(--dl-accordion-header-margin-bottom);
}

.accordion-header:hover {
    background-color: var(--dl-accordion-header-background-color, transparent);
    border-radius: var(--dl-accordion-header-border-radius, 0px);
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
