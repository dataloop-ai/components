<template>
    <tabs-wrapper
        :id="uuid"
        :is-scrollable="isOverflowing"
        :is-at-end="isAtEnd"
        :is-at-start="isAtStart"
        :is-vertical="vertical"
        @left-arrow-click="handleLeft"
        @right-arrow-click="handleRight"
    >
        <div
            ref="dlTabsRef"
            class="dl-tabs-container"
            :class="{ 'full-width': fullWidth }"
            role="tablist"
        >
            <dl-tab
                v-for="(item, index) in items"
                :key="index"
                :name="item.name"
                :vertical="vertical"
                :label="item.label"
                :show-tooltip="item.showTooltip"
                :tooltip="item.tooltip"
                :disabled="disabled || item.disabled"
                :no-caps="item.noCaps"
                :is-active="modelValue === item.name"
                :font-size="fontSize"
                @click="handleTabClick"
            />
        </div>
    </tabs-wrapper>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { hasOverflowing } from '../../../utils'
import DlTab from './components/DlTab.vue'
import TabsWrapper from './components/TabsWrapper.vue'
import type { TabDetails } from './types'

export default defineComponent({
    name: 'DlTabs',
    components: {
        TabsWrapper,
        DlTab
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        items: { type: Array as PropType<TabDetails[]>, required: true },
        vertical: { type: Boolean, default: false },
        fullWidth: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        modelValue: { type: String, required: true },
        fontSize: { type: String, default: '12px' }
    },
    emits: ['update:model-value'],
    data() {
        return {
            uuid: `dl-tabs-${v4()}`,
            isOverflowing: false,
            isAtStart: true,
            isAtEnd: false,
            children: [] as HTMLElement[],
            invisibleLeftIndex: 0,
            invisibleRightIndex: 0
        }
    },
    computed: {
        // @ts-ignore
        resizeObserver(): ResizeObserver | undefined {
            // @ts-ignore
            if (typeof ResizeObserver !== 'undefined') {
                // @ts-ignore
                return new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        if (entry.contentBoxSize) {
                            this.isOverflowing = hasOverflowing(
                                this.$refs.dlTabsRef as HTMLElement
                            )
                            this.updatePosition()
                            this.initTabs()
                        }
                    }
                })
            }

            return undefined
        }
    },
    mounted() {
        const element = this.$refs.dlTabsRef as HTMLElement
        this.resizeObserver?.observe(element)
        element?.addEventListener('scroll', this.updatePosition)
    },
    unmounted() {
        this.unsubscribeListeners()
    },
    methods: {
        handleTabClick(newSelectedTab: string, e: Event) {
            this.$emit('update:model-value', newSelectedTab, e)
        },
        handleScroll(e: Event | undefined) {
            this.updatePosition()
        },
        unsubscribeListeners() {
            (this.$refs.dlTabsRef as HTMLElement)?.removeEventListener(
                'scroll',
                this.handleScroll
            )
            this.resizeObserver?.disconnect()
        },
        initTabs() {
            const element = this.$refs.dlTabsRef as HTMLElement

            Array.from(element.children).forEach((children: Element) => {
                this.children.push(children as HTMLElement)
            })

            this.invisibleLeftIndex = 0
        },
        handleLeft() {
            this.children[this.invisibleLeftIndex].scrollIntoView({
                block: 'nearest',
                inline: 'start'
            })
            this.updatePosition()
        },
        handleRight() {
            this.children[this.invisibleRightIndex].scrollIntoView({
                block: 'nearest',
                inline: 'end'
            })
            this.updatePosition()
        },
        updatePosition() {
            const element = this.$refs.dlTabsRef as HTMLElement

            const lastLeft = this.children.findIndex((child, index) => {
                return child.offsetLeft >= element.scrollLeft
            })
            this.invisibleLeftIndex = lastLeft === -1 ? 0 : lastLeft - 1

            const lastRight = this.children.findIndex(
                (child) =>
                    child.offsetLeft >
                    element.scrollLeft + element.clientWidth + 1
            )
            this.invisibleRightIndex =
                lastRight === -1 ? this.children.length - 1 : lastRight - 1

            if (element.scrollLeft < 1) {
                this.isAtStart = true
            } else {
                this.isAtStart = false
            }
            if (
                element.offsetWidth + element.scrollLeft ===
                element.scrollWidth
            ) {
                this.isAtEnd = true
            } else {
                this.isAtEnd = false
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-tabs-container {
    position: relative;
    text-align: center;
    display: flex;
    overflow: -moz-hidden-unscrollable;
    justify-content: stretch;
    overflow-x: scroll;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
}
.full-width {
    width: 100%;
}
</style>
