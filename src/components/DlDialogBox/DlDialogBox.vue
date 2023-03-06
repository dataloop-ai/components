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
                :style="{ maxWidth: Number(width) ? `${width}px` : width }"
                :class="{ 'dialog-wrapper--fullscreen': fullscreen }"
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
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlDialogBox',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        width: { type: [Number, String], default: 400 },
        fullscreen: Boolean,
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
                    : 'rgba(0, 0, 0, 0.4)'
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
            this.$emit('hide')
            this.$emit('update:modelValue', false)
            if (!this.hasParent) {
                document.documentElement.style.overflow = 'auto'
            }
        },
        openModal() {
            this.show = true
            this.$emit('show')
            this.$emit('update:modelValue', true)
            if (!this.hasParent) {
                document.documentElement.style.overflow = 'hidden'
            }
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
        width: 100vw;
        height: 100vh;
        max-width: 100vw !important;
        border-radius: 0px;
    }
}

.header {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid var(--dl-color-separator);
}

.content {
    padding: 10px 16px 30px 16px;
    overflow: auto;

    &--fullscreen {
        flex-grow: 1;
    }
}

.footer {
    display: flex;
    padding: 20px 16px;
    border-top: 1px solid var(--dl-color-separator);
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
