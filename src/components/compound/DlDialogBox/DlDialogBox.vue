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
            >
                <dl-icon
                    v-if="draggable"
                    :style="{ cursor: draggableOptions.draggableCursor }"
                    class="dialog-wrapper--draggable-icon"
                    color="dl-color-medium"
                    icon="icon-dl-drag"
                    size="15px"
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
                    <slot name="body" />
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
import { throttle } from 'lodash'

export default defineComponent({
    name: 'DlDialogBox',
    components: { DlIcon },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
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
        }
    },
    emits: ['update:modelValue', 'hide', 'show'],
    data() {
        return {
            uuid: `dl-dialog-box-${v4()}`,
            show: this.modelValue,
            draggableOptions: {
                draggableX: 0,
                draggableY: 0,
                originalX: 0,
                originalY: 0,
                draggableCursor: 'pointer'
            }
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
                    : 'none'
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
            this.$emit('update:modelValue', false)
            if (!this.hasParent) {
                document.documentElement.style.overflow = 'auto'
            }
            this.$nextTick(() => {
                this.$emit('hide')
            })
        },
        openModal() {
            this.show = true
            this.$emit('update:modelValue', true)
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
    z-index: var(--dl-z-index-menu);
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
    z-index: var(--dl-z-index-menu);
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
    z-index: var(--dl-z-index-menu);

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
        top: -1px;
        left: 3px;
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
    padding: 16px;
    border-bottom: var(--dl-dialog-separator);
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
    padding: 20px 16px;
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
