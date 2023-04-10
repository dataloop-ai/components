<template>
    <div class="dl-layout">
        <div class="dl-layout__navbar">
            <LayoutNavbar
                :left-items="navbarLeftItems"
                :has-toggle="hasNavbarToggle"
                @toggle="toggleLeftSideBar"
            >
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
                <LayoutLeftSide
                    :is-expanded="isExpandedLeftSide"
                    :items="leftItems"
                >
                    <template #default>
                        <slot name="left-side" />
                    </template>
                </LayoutLeftSide>
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
                <LayoutRightSide :items="rightItems">
                    <template #default>
                        <slot name="right-side" />
                    </template>
                </LayoutRightSide>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue-demi'
import { LayoutVerticalItems } from './types/VerticalItems'
import LayoutNavbar from './components/LayoutNavbar.vue'
import LayoutLeftSide from './components/LayoutLeftSide.vue'
import LayoutRightSide from './components/LayoutRightSide.vue'

export default defineComponent({
    name: 'DlLayout',
    components: {
        LayoutNavbar,
        LayoutLeftSide,
        LayoutRightSide
    },
    props: {
        hasNavbarToggle: {
            type: Boolean,
            default: true
        },
        leftItems: {
            type: Array as PropType<LayoutVerticalItems[]>,
            default: () => [] as LayoutVerticalItems[]
        },
        rightItems: {
            type: Array as PropType<LayoutVerticalItems[]>,
            default: () => [] as LayoutVerticalItems[]
        }
    },
    setup(props, { attrs, slots }) {
        const isExpandedLeftSide = ref(true)
        const toggleLeftSideBar = (event: boolean) => {
            isExpandedLeftSide.value = event
        }
        const hasFooterSlot = computed(() => slots.footer !== undefined)
        const hasLeftSideSlot = computed(() => slots['left-side'] !== undefined)
        const hasRightSideSlot = computed(
            () => slots['right-side'] !== undefined
        )

        return {
            isExpandedLeftSide,
            toggleLeftSideBar,
            hasFooterSlot,
            hasLeftSideSlot,
            hasRightSideSlot
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout {
    width: 100%;
    height: 100%;

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
                background-color: var(--dl-color-panel-background);
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
