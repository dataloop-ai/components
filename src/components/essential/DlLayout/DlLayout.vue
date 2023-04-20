<template>
    <div class="dl-layout">
        <div class="dl-layout__navbar">
            <LayoutNavbar>
                <template #default>
                    <slot name="navbar-content" />
                </template>
            </LayoutNavbar>
        </div>
        <div class="dl-layout__body">
            <div
                v-if="hasLeftSideSlot"
                class="dl-layout__body__left-content"
            >
                <LayoutVerticalSidebar
                    position="left"
                    :expand-sidebar="isExpandedLeftSide"
                    @expand="expandedLeftSide"
                >
                    <template #default>
                        <slot name="left-side" />
                    </template>
                </LayoutVerticalSidebar>
            </div>
            <div class="dl-layout__body__content">
                <slot />
                <div
                    v-if="hasFooterSlot"
                    class="dl-layout__body__content__footer"
                >
                    <slot name="footer" />
                </div>
            </div>
            <div
                v-if="hasRightSideSlot"
                class="dl-layout__body__right-content"
            >
                <LayoutVerticalSidebar
                    position="right"
                    :expand-sidebar="isExpandedRightSide"
                    @expand="expandedRightSide"
                >
                    <template #default>
                        <slot name="right-side" />
                    </template>
                </LayoutVerticalSidebar>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'
import LayoutNavbar from './components/LayoutNavbar.vue'
import LayoutVerticalSidebar from './components/LayoutVerticalSidebar.vue'

export default defineComponent({
    name: 'DlLayout',
    components: {
        LayoutNavbar,
        LayoutVerticalSidebar
    },
    props: {
        expandLeftSidebar: {
            type: Boolean,
            default: false
        },
        expandRightSidebar: {
            type: Boolean,
            default: false
        }
    },
    emits: ['expandedLeftSidebar', 'expandedRightSidebar'],
    setup(props, context) {
        const isExpandedLeftSide = ref(true)
        const isExpandedRightSide = ref(true)
        const hasFooterSlot = computed(() => context.slots.footer !== undefined)
        const hasLeftSideSlot = computed(
            () => context.slots['left-side'] !== undefined
        )
        const hasRightSideSlot = computed(
            () => context.slots['right-side'] !== undefined
        )
        const expandedLeftSide = (value: boolean) => {
            context.emit('expandedLeftSidebar', value)
        }
        const expandedRightSide = (value: boolean) => {
            context.emit('expandedRightSidebar', value)
        }
        const propsExpandLeftSidebar = computed(() => props.expandLeftSidebar)
        watch(propsExpandLeftSidebar, (value) => {
            isExpandedLeftSide.value = value
        })
        const propsExpandRightSidebar = computed(() => props.expandRightSidebar)
        watch(propsExpandRightSidebar, (value) => {
            isExpandedRightSide.value = value
        })

        return {
            isExpandedLeftSide,
            isExpandedRightSide,
            hasFooterSlot,
            hasLeftSideSlot,
            hasRightSideSlot,
            expandedLeftSide,
            expandedRightSide
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout {
    width: 100%;
    height: 100%;

    &__navbar {
        border: 1px solid var(--dl-color-fill);
        box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);
    }

    &__body {
        display: flex;
        height: 100%;
        background-color: var(--dl-color-bg);
        color: var(--dl-color-darker);

        &__content {
            position: relative;
            height: 100%;
            width: 100%;
            margin-bottom: 50px;
            overflow: scroll;

            &__footer {
                position: absolute;
                height: 50px;
                box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
                bottom: 0px;
                left: 0px;
                right: 0px;
                margin-bottom: 0px;
                align-items: center;
            }
        }
    }
}
</style>
