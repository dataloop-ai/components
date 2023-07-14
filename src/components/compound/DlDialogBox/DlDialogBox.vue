<template>
    <transition name="fade">
        <div
            v-if="show"
            :id="uuid"
            :style="cssVars"
            class="root-wrapper"
        >
            <div
                class="backdrop"
                @click.stop.prevent="volatile ? closeModal() : ''"
            />
            <div
                class="dialog-wrapper"
                :style="{
                    width: Number(width) ? `${width}px` : width,
                    height: Number(height) ? `${height}px` : height,
                    transform: `translate(${draggableOptions.draggableX}px, ${draggableOptions.draggableY}px)`,
                    maxHeight: !fullscreen && !fullHeight ? '90vh' : ''
                }"
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
                    size="12px"
                    @mousedown="startDragElement"
                />
                <div
                    v-if="hasHeader"
                    class="header"
                >
                    <slot name="header" />
                </div>
                <div
                    class="content"
                    :class="{
                        'content--fullscreen': fullscreen,
                        'content--fullheight': fullHeight
                    }"
                >
                    <slot
                        v-if="!isEmpty"
                        name="body"
                    />
                    <dl-empty-state
                        v-if="isEmpty"
                        v-bind="emptyStateProps"
                    >
                        <template
                            v-for="(_, slot) in $slots"
                            #[slot]="props"
                        >
                            <slot
                                :name="slot"
                                v-bind="props"
                            />
                        </template>
                    </dl-empty-state>
                </div>
                <div
                    v-if="hasFooter"
                    class="footer"
                >
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
            default: () => ({} as DlEmptyStateProps)
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
        }
        visibleDragIcon: boolean
    } {
        return {
            uuid: `dl-dialog-box-${v4()}`,
            show: this.modelValue,
            draggableOptions: {
                draggableX: 0,
                draggableY: 0,
                originalX: 0,
                originalY: 0,
                draggableCursor: 'pointer'
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
                    typeof this.width === 'string'
                        ? parseInt(this.width)
                        : this.width / 2
                }px`,
                '--dialog-z-index':
                    `${this.zIndex}` ?? 'var(--dl-z-index-dialog)'
            }
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
            return parentClassList?.contains('content')
        },
        hasHeader(): boolean {
            return !!this.$slots.header
        },
        hasFooter(): boolean {
            return !!this.$slots.footer
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
            if ((this.$el as HTMLElement)?.blur) {
                (this.$el as HTMLElement).blur()
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
    color: var(--dl-color-darker);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    z-index: var(--dialog-z-index);

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
    height: var(--dl-dialog-box-header-height, 60px);
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
    height: var(--dl-dialog-box-footer-height, 35px);
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
