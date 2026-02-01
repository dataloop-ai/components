<template>
    <transition name="fade">
        <div
            v-if="show"
            :id="uuid"
            :class="$attrs.class"
            :style="cssVars"
            class="root-wrapper"
        >
            <div
                class="backdrop"
                @click.stop.prevent="volatile ? closeModal() : ''"
            />
            <div
                class="dialog-wrapper"
                :style="wrapperStyles"
                :class="{
                    'dialog-wrapper--fullscreen': fullscreen,
                    'dialog-wrapper--fullheight': fullHeight,
                    'dialog-wrapper--right': position === 'right',
                    'dialog-wrapper--left': position === 'left'
                }"
                @mouseenter="visibleDragIcon = true"
                @mouseleave="visibleDragIcon = false"
            >
                <dl-icon
                    v-if="draggable"
                    :style="iconStyles"
                    class="dialog-wrapper--draggable-icon"
                    color="dl-color-medium"
                    icon="icon-dl-drag"
                    :size="`${draggableOptions.draggableIconSize}px`"
                    @mousedown="startDragElement"
                />
                <div v-if="hasHeader" class="header">
                    <slot name="header" />
                </div>
                <div
                    class="content"
                    :class="{
                        'content--fullscreen': fullscreen,
                        'content--fullheight': fullHeight
                    }"
                >
                    <slot v-if="!isEmpty" name="body" />
                    <dl-empty-state
                        v-if="isEmpty && emptyStateProps"
                        v-bind="emptyStateProps"
                    >
                        <template v-for="(_, slot) in $slots" #[slot]="props">
                            <slot :name="slot" v-bind="props" />
                        </template>
                    </dl-empty-state>
                </div>
                <div v-if="hasFooter" class="footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import DlIcon from '../../essential/DlIcon/DlIcon.vue'
import { DlEmptyStateProps } from '../../basic/DlEmptyState/types'
import DlEmptyState from '../../basic/DlEmptyState/DlEmptyState.vue'
import { throttle } from 'lodash'

export default defineComponent({
    name: 'DlDialogBox',
    components: { DlIcon, DlEmptyState },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        width: { type: [Number, String], default: 400 },
        height: { type: [Number, String], default: 'fit-content' },
        hideHeader: { type: Boolean, default: false },
        hideFooter: { type: Boolean, default: false },
        fullscreen: Boolean,
        fullHeight: Boolean,
        separators: { type: Boolean, default: true },
        position: {
            type: String as PropType<'left' | 'right' | 'center'>,
            default: 'center'
        },
        modelValue: Boolean,
        volatile: { type: Boolean, default: false },
        draggable: {
            type: Boolean,
            default: false
        },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        },
        zIndex: {
            type: [Number, String],
            default: 'var(--dl-z-index-dialog)'
        }
    },
    emits: ['update:model-value', 'hide', 'show'],
    data(): {
        uuid: string
        show: boolean
        draggableOptions: {
            draggableX: number
            draggableY: number
            originalX: number
            originalY: number
            draggableCursor: string
            draggableIconSize: number
        }
        visibleDragIcon: boolean
    } {
        return {
            uuid: (this.$attrs.id as string)?.length
                ? (this.$attrs.id as string)
                : `dl-dialog-box-${v4()}`,
            show: this.modelValue,
            draggableOptions: {
                draggableX: 0,
                draggableY: 0,
                originalX: 0,
                originalY: 0,
                draggableCursor: 'pointer',
                draggableIconSize: 12
            },
            visibleDragIcon: false
        }
    },
    computed: {
        cssVars(): Record<string, string> {
            return {
                '--dl-backdrop-color': this.hasParent
                    ? 'transparent'
                    : 'rgba(0, 0, 0, 0.4)',
                '--dl-dialog-separator': this.separators
                    ? '1px solid var(--dl-color-separator)'
                    : 'none',
                '--dl-dialog-box-drag-icon-left': `${
                    (typeof this.width === 'string'
                        ? parseInt(this.width)
                        : this.width) /
                        2 -
                    this.draggableOptions.draggableIconSize / 2
                }px`,
                '--dialog-z-index':
                    `${this.zIndex}` ?? 'var(--dl-z-index-dialog)'
            }
        },
        wrapperStyles(): Record<string, string | number> {
            const styles: Record<string, string | number> = {
                width: Number(this.width) ? `${this.width}px` : this.width,
                height: Number(this.height) ? `${this.height}px` : this.height,
                maxHeight: !this.fullscreen && !this.fullHeight ? '90vh' : ''
            }

            if (this.draggable) {
                styles.transform = `translate(${this.draggableOptions.draggableX}px, ${this.draggableOptions.draggableY}px)`
            }

            return styles
        },
        iconStyles(): Record<string, string> {
            return {
                cursor: this.draggableOptions.draggableCursor,
                visibility: this.visibleDragIcon ? 'visible' : 'hidden'
            }
        },
        hasParent(): boolean {
            const parentClassList = (this?.$el?.parentNode as HTMLElement)
                ?.classList
            return !!parentClassList?.contains('content')
        },
        hasHeader(): boolean {
            const slotKeys = Object.keys(this.$slots)
            return (
                !this.hideHeader &&
                slotKeys.includes('header') &&
                !!this.$slots.header
            )
        },
        hasFooter(): boolean {
            const slotKeys = Object.keys(this.$slots)
            return (
                !this.hideFooter &&
                slotKeys.includes('footer') &&
                !!this.$slots.footer
            )
        }
    },
    watch: {
        modelValue(newVal: boolean) {
            if (newVal) {
                this.openModal()
            } else {
                this.closeModal()
            }
        }
    },
    methods: {
        startDragElement(e: {
            preventDefault: () => void
            y: number
            x: number
        }) {
            e.preventDefault()
            if (
                !this.draggableOptions.originalY &&
                !this.draggableOptions.originalX
            ) {
                this.draggableOptions.originalY = e.y
                this.draggableOptions.originalX = e.x
            }
            this.draggableOptions.draggableCursor = 'grabbing'
            document.onmousemove = throttle((e) => {
                this.draggableOptions.draggableX =
                    e.x - this.draggableOptions.originalX
                this.draggableOptions.draggableY =
                    e.y - this.draggableOptions.originalY
            }, 5)
            document.onmouseup = this.stopDragElement
        },
        stopDragElement() {
            document.onmousemove = null
            document.onmouseup = null
            this.draggableOptions.draggableCursor = 'pointer'
        },
        closeModal() {
            const el = this.$el as HTMLElement
            if (el?.blur) {
                el.blur()
            }
            this.show = false
            this.$emit('update:model-value', false)
            if (!this.hasParent) {
                document.documentElement.style.overflow = 'auto'
            }
            this.$nextTick(() => {
                this.$emit('hide')
            })
        },
        openModal() {
            this.show = true
            this.$emit('update:model-value', true)
            if (!this.hasParent) {
                document.documentElement.style.overflow = 'hidden'
            }
            this.$nextTick(() => {
                this.$emit('show')
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.root-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--dialog-z-index);
    overflow-x: hidden;
    overflow-y: hidden;
    text-align: start;
    display: flex;
    justify-content: center;
    align-items: center;
}

.backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--dl-backdrop-color);
    z-index: var(
        --dialog-z-index
    ); // todo: check if this should be overlay instead.
}

.dialog-wrapper {
    position: relative;
    width: 100%;
    background-color: var(--dl-color-panel-background);
    border: 1px solid var(--dl-color-separator);
    color: var(--dell-gray-200);
    display: flex;
    flex-direction: column;
    z-index: var(--dialog-z-index);
    box-shadow: 0 8px 8px 0 var(--dell-shadow, rgba(0, 0, 0, 0.14));

    &--fullscreen {
        margin: 0;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0px;
    }

    &--fullheight {
        margin: 0;
        height: 100vh !important;
        border-radius: 0px;
    }

    &--draggable-icon {
        position: absolute;
        top: 2px;
        left: var(--dl-dialog-box-drag-icon-left);
        cursor: pointer;
        transform: rotate(90deg);
    }

    &--right {
        position: absolute !important;
        right: 0;
    }

    &--left {
        position: absolute !important;
        left: 0;
    }
}

.header {
    display: flex;
    padding: var(--dl-dialog-box-header-padding, 16px);
    border-bottom: var(--dl-dialog-separator);
    height: fit-content;
}

.content {
    padding: var(--dl-dialog-box-content-padding, 20px 16px 30px 16px);
    overflow: auto;
    height: 100%;

    &--fullscreen {
        flex-grow: 1 !important;
    }
    &--fullheight {
        flex-grow: 1 !important;
    }
}

.footer {
    display: flex;
    padding: var(--dl-dialog-box-footer-padding, 20px 16px);
    height: fit-content;
    border-top: var(--dl-dialog-separator);
}

.fade {
    &-enter-active,
    &-leave-active {
        transition: opacity 0.2s;
    }

    &-enter,
    &-leave-to {
        opacity: 0;
    }
}
</style>
