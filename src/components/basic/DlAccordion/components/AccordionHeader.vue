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
import { getDellColorNextShade } from '../../../../utils/getLighterGradient'
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
        titleColor: { type: String, default: 'dell-gray-800' },
        isOpen: { type: Boolean, default: false },
        rightSide: { type: Boolean, default: false },
        closedIcon: { type: String, default: 'icon-dl-right-chevron' },
        openedIcon: { type: String, default: 'icon-dl-down-chevron' },
        backgroundColor: { type: String, default: 'dell-blue-100' },
        formMode: { type: Boolean, default: false },
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
            let bgColor = ''
            let hoverBgColor = ''
            let activeBgColor = ''
            let padding = '12px 16px'
            let marginBottom = '0px'
            let borderRadius = '0px'
            let borderTop = 'none'
            if (this.formMode) {
                padding = this.isOpen
                    ? '12px 16px 12px 12px'
                    : '11px 16px 12px 16px'
                borderTop = !this.isOpen
                    ? '1px solid var(--dell-gray-300, #C5C5C5)'
                    : 'none'
                if (this.isOpen) {
                    bgColor = getColor(this.backgroundColor)
                    const nextShadeColor = getDellColorNextShade(
                        this.backgroundColor
                    )
                    if (nextShadeColor) {
                        hoverBgColor = getColor(nextShadeColor)
                        activeBgColor = hoverBgColor
                    } else {
                        hoverBgColor = bgColor
                        activeBgColor = bgColor
                    }
                } else {
                    hoverBgColor = getColor(this.backgroundColor)
                    const nextShadeColor = getDellColorNextShade(
                        this.backgroundColor
                    )
                    activeBgColor = nextShadeColor
                        ? getColor(nextShadeColor)
                        : hoverBgColor
                }
            } else if (this.withBackground) {
                ;(hoverBgColor = !this.isOpen
                    ? getColor(this.backgroundColor)
                    : ''),
                    (padding = '4px')
                marginBottom = '2px'
                borderRadius = !this.isOpen ? '4px' : '0px'
            }

            return {
                '--dl-title-color': getColor(this.titleColor, 'dell-gray-600'),
                '--dl-expand-icon-color': `var(--${
                    this.isOpen ? 'dell-gray-800' : this.titleColor
                })`,
                '--dl-accordion-header-flex-direction': this.rightSide
                    ? 'row-reverse'
                    : 'row',
                '--dl-accordion-header-fontsize': this.fontSize,
                '--dl-accordion-header-fontweight': this.fontWeight,
                '--dl-accordion-header-background-color': bgColor,
                '--dl-accordion-header-hover-background-color': hoverBgColor,
                '--dl-accordion-header-active-background-color': activeBgColor,
                '--dl-accordion-header-border-radius': borderRadius,
                '--dl-accordion-header-padding': padding,
                '--dl-accordion-header-margin-bottom': marginBottom,
                '--dl-accordion-header-border-top': borderTop
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
    background-color: var(--dl-accordion-header-background-color, transparent);
    border-top: var(--dl-accordion-header-border-top, none);
}

.accordion-header:hover {
    background-color: var(
        --dl-accordion-header-hover-background-color,
        transparent
    );
    border-radius: var(--dl-accordion-header-border-radius, 0px);
}

.accordion-header:active {
    background-color: var(
        --dl-accordion-header-active-background-color,
        transparent
    );
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
