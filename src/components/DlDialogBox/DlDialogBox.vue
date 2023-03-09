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
                    height: Number(height) ? `${height}px` : height
                }"
                :class="{
                    'dialog-wrapper--fullscreen': fullscreen,
                    'dialog-wrapper--right': position === 'right',
                    'dialog-wrapper--left': position === 'left'
                }"
            >
                <div
                    v-if="hasHeader"
                    class="header"
                >
                    <slot name="header" />
                </div>
                <div
                    class="content"
                    :class="{ 'content--fullscreen': fullscreen }"
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

export default defineComponent({
    name: 'DlDialogBox',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        width: { type: [Number, String], default: 400 },
        height: { type: [Number, String], default: 'fit-content' },
        fullscreen: Boolean,
        separators: { type: Boolean, default: true },
        position: {
            type: String as PropType<'left' | 'right' | 'center'>,
            default: 'center'
        },
        modelValue: Boolean,
        volatile: { type: Boolean, default: false }
    },
    emits: ['update:modelValue', 'hide', 'show'],
    data() {
        return {
            uuid: `dl-dialog-box-${v4()}`,
            show: this.modelValue
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
    max-height: 100vh;

    &--fullscreen {
        margin: 0;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0px;
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
    padding: 10px 16px 30px 16px;
    overflow: auto;
    height: 100%;

    &--fullscreen {
        flex-grow: 1 !important;
    }
}

.footer {
    display: flex;
    padding: 16px;
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
