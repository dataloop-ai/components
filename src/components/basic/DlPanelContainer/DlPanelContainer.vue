<template>
    <div
        :id="uuid"
        class="dl-panel-container"
        :class="{ 'non-selectable': avoidUserSelect }"
        :style="cssVariables"
        :data-resizable="resizable"
        :data-collapsable="collapsable"
        :data-direction="direction"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <div ref="panel" :style="innerContainerStyles" class="inner-container">
            <div v-if="collapsed" class="inner-container-overlay">
                <slot name="overlay" />
            </div>
            <div
                ref="separator"
                class="separator"
                :class="{ resize: resizable === true && isFullWidth === true }"
                :style="separatorStyles"
            >
                <div
                    v-if="showDragHandle"
                    v-show="resizable === true"
                    class="gutter"
                    :style="glutterStyles"
                />
            </div>
            <div
                v-if="hasHeader === true && !isEmpty"
                class="header"
                :style="headerStyles"
            >
                <div class="overflow-hidden">
                    <slot name="header" />
                </div>
            </div>
            <div class="content" :style="contentStyle">
                <div class="column" />
                <dl-empty-state
                    v-if="isEmpty && emptyStateProps"
                    v-bind="emptyStateProps"
                >
                    <template v-for="(_, slot) in $slots" #[slot]="props">
                        <slot :name="slot" v-bind="props" />
                    </template>
                </dl-empty-state>
                <slot v-if="!isEmpty" />
            </div>
            <div
                v-if="hasFooter === true && !isEmpty"
                class="footer"
                :style="footerStyles"
            >
                <div class="overflow-hidden">
                    <slot name="footer" />
                </div>
            </div>
            <div v-if="collapsable === true">
                <div
                    v-if="
                        direction === 'right' &&
                            isFullWidth === true &&
                            hideCollapseButton === false
                    "
                    class="collapse-icon collapse-icon--right"
                    :style="collapseIconStyle"
                    @click="handleCollapseButtonClick"
                >
                    <dl-tooltip>Collapse Panel</dl-tooltip>
                    <dl-icon
                        icon="icon-dl-collapse"
                        color="dl-color-darker"
                        size="16px"
                    />
                </div>
                <div
                    v-else-if="direction === 'right' && isFullWidth === false"
                    class="collapse-icon collapse-icon--right"
                    :style="collapseIconStyle"
                    @click="handleCollapseButtonClick"
                >
                    <dl-tooltip>Expand Panel</dl-tooltip>
                    <dl-icon
                        icon="icon-dl-expand"
                        color="dl-color-darker"
                        size="16px"
                    />
                </div>
                <div
                    v-else-if="
                        direction === 'left' &&
                            isFullWidth === true &&
                            hideCollapseButton === false
                    "
                    class="collapse-icon collapse-icon--left"
                    :style="[collapseIconStyle, leftCollapseIconStyle]"
                    @click="handleCollapseButtonClick"
                    @mouseleave="collapseButtonMouseLeave"
                    @mouseenter="collapseButtonMouseEnter"
                >
                    <dl-tooltip>Collapse Panel</dl-tooltip>
                    <dl-icon
                        icon="icon-dl-expand"
                        color="dl-color-darker"
                        size="16px"
                    />
                </div>
                <div
                    v-else-if="direction === 'left' && isFullWidth === false"
                    class="collapse-icon collapse-icon--left--collapsed"
                    :style="[collapseIconStyle, leftClosedCollapseIconStyle]"
                    @click="handleCollapseButtonClick"
                    @mouseleave="collapseButtonMouseLeave"
                    @mouseenter="collapseButtonMouseEnter"
                >
                    <dl-tooltip>Expand Panel</dl-tooltip>
                    <dl-icon
                        icon="icon-dl-collapse"
                        color="dl-color-darker"
                        size="16px"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'
import { DlTooltip } from '../../shared'
import { DlEmptyStateProps } from '../DlEmptyState/types'
// todo: this will cause issues
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'

export default defineComponent({
    name: 'DlPanelContainer',
    components: {
        DlIcon,
        DlTooltip,
        DlEmptyState
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        width: {
            type: String,
            default: '400px'
        },
        height: {
            type: String,
            default: '100%'
        },
        minWidth: {
            type: Number,
            default: 36,
            validator: (val: number) => val >= 0
        },
        maxStretchableWidth: {
            type: Number,
            default: 360,
            validator: (val: number) => val >= 0
        },
        minStretchableWidth: {
            type: Number,
            default: 36,
            validator: (val: number) => val >= 0
        },
        direction: {
            type: String,
            default: 'right',
            validator: (val: string) => ['left', 'right'].includes(val)
        },
        collapsable: {
            type: Boolean,
            default: false
        },
        resizable: {
            type: Boolean,
            default: false
        },
        headerHeight: {
            type: String,
            default: '80px'
        },
        footerHeight: {
            type: String,
            default: '70px'
        },
        modelValue: { type: Boolean, required: false, default: false },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        },
        showCollapseOnHover: {
            type: Boolean,
            default: false
        },
        layoutMode: {
            type: String,
            default: 'regular'
        },
        showDragHandle: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:model-value', 'panel-width'],
    data() {
        return {
            uuid: `dl-panel-container-${v4()}`,
            w: 0,
            left: 0,
            isFullWidth: true,
            avoidUserSelect: false,
            collapsed: false,
            hideCollapseButton: false,
            collapseBorder:
                '1px solid var(--dl-color-separator, rgba(255, 255, 255, 0.15))'
        }
    },
    computed: {
        isStudioMode(): boolean {
            return this.layoutMode === 'studio'
        },
        minW(): number {
            if (this.minWidth <= 0) {
                return 0
            }

            if (this.minWidth > this.w) {
                return this.w
            }

            return this.minWidth
        },
        cssVariables(): Record<string, any> {
            return {
                '--dl-panel-container-width': this.width,
                '--dl-panel-container-height': this.height,
                '--dl-header-height': this.headerHeight,
                '--dl-footer-height': this.footerHeight
            }
        },
        contentStyle(): Record<string, any> {
            const styles: Record<string, any> = {
                'padding-top':
                    this.hasHeader && this.headerHeight
                        ? this.headerHeight
                        : 0 + 'px',
                'padding-bottom':
                    this.hasHeader && this.footerHeight
                        ? this.footerHeight
                        : 0 + 'px'
            }

            if (this.isEmpty) {
                styles['display'] = 'flex'
                styles['justify-content'] = 'center'
                styles['height'] = '100%'
                styles['max-height'] = '100%'
            }

            return styles
        },
        position(): 'left' | 'right' {
            return this.direction === 'right' ? 'left' : 'right'
        },
        separatorStyles(): Record<string, any> {
            return {
                [this.position]: '0px'
            }
        },
        glutterStyles(): Record<string, any> {
            return {
                [this.position]: '3px'
            }
        },
        hasHeader(): boolean {
            return !!this.$slots.header
        },
        headerStyles(): Record<string, any> {
            return {
                [this.position]: '0px'
            }
        },
        hasFooter(): boolean {
            return !!this.$slots.footer
        },
        footerStyles(): Record<string, any> {
            return {
                [this.position]: '0px'
            }
        },
        innerContainerStyles(): Record<string, string> {
            return {
                textAlign: 'left',
                fontSize: 'var(--dl-font-size-body)',
                position: 'relative',
                height: '100%',
                boxSizing: 'border-box',
                color: 'var(--dl-color-darker)',
                backgroundColor: 'var(--dl-color-panel-background)',
                zIndex: 'var(--dl-z-index-panel)',
                width: this.isStudioMode
                    ? 'calc(var(--dl-panel-container-width) - 10px)'
                    : this.width + 'px',
                padding: this.isStudioMode ? '0px' : '0px 10px'
            }
        },
        collapseIconStyle(): Record<string, string> {
            return {
                zIndex: 'var(--dl-z-index-panel-container-elements)',
                width: '20px',
                height: '20px',
                backgroundColor: 'var(--dl-color-fill)',
                position: 'absolute',
                top: this.isStudioMode ? '40px' : '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '2px',
                border: this.collapseBorder,
                background: 'var(--dl-color-bg, #30363D)',
                boxShadow:
                    '0px 4px 4px 0px var(--dl-color-shadow, rgba(27, 30, 34, 0.24))'
            }
        },
        leftCollapseIconStyle(): Record<string, string> {
            return {
                right: this.isStudioMode ? '-10px' : '0px',
                marginLeft: '15px',
                borderTopLeftRadius: '2px',
                borderBottomLeftRadius: '2px'
            }
        },
        leftClosedCollapseIconStyle(): Record<string, string> {
            return {
                left: this.isStudioMode ? '6px' : '0px',
                marginRight: '15px',
                borderTopRightRadius: '2px',
                borderBottomRightRadius: '2px'
            }
        }
    },
    watch: {
        modelValue() {
            this.collapse()
        },
        direction() {
            this.reset()
        },
        resizable(val: boolean) {
            if (val === true) {
                this.removeResizeEvent()
                this.addResizeEvent()
            } else {
                this.removeResizeEvent()
            }
        }
    },
    mounted() {
        const panelBoundings = (
            this.$refs['panel'] as HTMLDivElement
        ).getBoundingClientRect()

        this.w = panelBoundings.width
        this.left = panelBoundings.left + window.scrollX

        if (this.resizable === true) {
            this.addResizeEvent()
        }

        if (this.modelValue === true) {
            this.collapse()
        }
    },
    methods: {
        handleMouseEnter() {
            if (this.showCollapseOnHover) {
                this.hideCollapseButton = false
            }
        },
        handleMouseLeave() {
            if (this.showCollapseOnHover) {
                this.hideCollapseButton = true
            }
        },
        collapseButtonMouseEnter() {
            this.collapseBorder = '1px solid var(--dl-color-hover)'
        },
        collapseButtonMouseLeave() {
            this.collapseBorder =
                '1px solid var(--dl-color-separator, rgba(255, 255, 255, 0.15))'
        },
        reset() {
            const element = this.$refs['panel'] as HTMLDivElement
            element.style.width = this.w + 'px'
            element.style.left = 0 + 'px'
        },
        addResizeEvent() {
            const separator = this.$refs['separator'] as HTMLDivElement
            if (!separator) return

            separator.addEventListener('mousedown', this.mousedown)
        },
        removeResizeEvent() {
            const separator = this.$refs['separator'] as HTMLDivElement
            if (!separator) return

            separator.removeEventListener('mousedown', this.mousedown)
        },
        mousedown() {
            document.addEventListener('mousemove', this.mousemove)
            document.addEventListener('mouseup', this.mouseup)

            this.avoidUserSelect = true
        },
        mousemove(e: MouseEvent) {
            const element = this.$refs['panel'] as HTMLDivElement
            const offset = e.pageX - this.left

            if (this.direction === 'right') {
                if (e.pageX < this.left) {
                    element.style.width = this.w + 'px'
                    element.style.left = 0 + 'px'

                    this.collapsed = false
                } else if (e.pageX > this.left + this.w - this.minW) {
                    element.style.width = this.minW + 'px'
                    element.style.left = this.w - this.minW + 'px'

                    this.collapsed = true
                } else {
                    element.style.width = this.w - offset + 'px'
                    element.style.left = offset + 'px'

                    this.collapsed = false
                }
            } else {
                const newWidth = e.pageX - this.left

                if (newWidth > this.maxStretchableWidth) {
                    element.style.width = this.maxStretchableWidth + 'px'
                    this.collapsed = false
                } else if (newWidth < this.minW) {
                    const widthToSet = Math.max(
                        this.minStretchableWidth,
                        this.minW
                    )
                    element.style.width = widthToSet + 'px'
                    this.collapsed = widthToSet === this.minW
                } else {
                    const widthToSet = Math.max(
                        newWidth,
                        this.minStretchableWidth
                    )
                    element.style.width = widthToSet + 'px'
                    this.collapsed = false
                }
            }
            this.$emit('panel-width', parseInt(element.style.width))
        },
        mouseup(e: MouseEvent) {
            if (this.direction === 'right') {
                this.isFullWidth = e.pageX < this.left
            } else {
                this.isFullWidth =
                    this.isStudioMode || e.pageX > this.left + this.w
            }
            document.removeEventListener('mousemove', this.mousemove)
            document.removeEventListener('mouseup', this.mouseup)

            this.avoidUserSelect = false
        },
        handleCollapseButtonClick() {
            this.$emit('update:model-value', !this.modelValue)
        },
        collapse() {
            const element = this.$refs['panel'] as HTMLDivElement

            if (this.direction === 'right') {
                if (this.isFullWidth === false) {
                    element.style.width = this.w + 'px'
                    element.style.left = 0 + 'px'

                    this.isFullWidth = true
                    this.collapsed = false
                } else {
                    element.style.width = this.minW + 'px'
                    element.style.left = this.w - this.minW + 'px'

                    this.isFullWidth = false
                    this.collapsed = true
                }
            } else {
                if (this.isFullWidth === false) {
                    element.style.width = this.w + 'px'
                    element.style.right = this.w + 'px'
                    this.isFullWidth = true
                    this.collapsed = false
                } else {
                    element.style.width = this.minW + 'px'
                    element.style.left = 0 + 'px'

                    this.isFullWidth = false
                    this.collapsed = true
                }
                this.$emit('panel-width', parseInt(element.style.width))
            }
        }
    },
    template: 'dl-panel-container'
})
</script>

<style scoped lang="scss">
.dl-panel-container {
    position: relative;
    width: var(--dl-panel-container-width);
    max-height: var(--dl-panel-container-height);

    .inner-container {
        .collapse-icon {
            &--right {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
                right: 0px;
                margin-left: 15px;
            }
            &:hover {
                border: 1px solid var(--dl-color-hover);
            }
        }

        & .separator {
            top: 0px;
            position: absolute;
            width: 1px;
            height: 100%;
            background-color: var(--dl-color-separator);
            z-index: var(--dl-z-index-panel-container-elements);

            & .gutter {
                width: 1px;
                height: 24px;
                background-color: var(--dl-color-lighter);
                position: absolute;
                top: calc(100% / 2 - 12px);
                z-index: var(--dl-z-index-panel-container-elements);
            }
        }

        & .header {
            position: absolute;
            box-sizing: border-box;
            top: 0px;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 20px;
            height: var(--dl-header-height);
            width: 100%;
            z-index: var(--dl-z-index-panel-header-footer);
            background-color: var(--dl-color-panel-background);
        }

        & .content {
            overflow-x: hidden;
            max-height: calc(
                var(--dl-panel-container-height) - var(--dl-header-height, 0) -
                    var(--dl-footer-height, 0)
            );

            & :last-child {
                &::v-deep .separator,
                &::v-deep .resizable-separator,
                &::v-deep .w {
                    display: none;
                }
            }
        }

        & .column {
            display: table-column;
        }

        & .footer {
            box-sizing: border-box;
            position: absolute;
            bottom: 0px;
            padding: 20px 16px;
            height: var(--dl-footer-height);
            width: 100%;
            z-index: var(--dl-z-index-panel-header-footer);
            background-color: var(--dl-color-panel-background);
        }

        & .inner-container-overlay {
            position: absolute;
            background-color: var(--dl-color-panel-background);
            width: 100%;
            height: 100%;
            z-index: var(--dl-z-index-panel-container-overlay);
            left: 0;
            right: 0;
        }

        .overflow-hidden {
            overflow: hidden;
        }

        .resize {
            cursor: col-resize;

            &:hover {
                background-color: var(--dl-color-secondary);
            }
        }
    }
}
</style>
