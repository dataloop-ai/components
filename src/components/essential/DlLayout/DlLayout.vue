<template>
    <div class="dl-layout">
        <div class="dl-layout__navbar">
            <DlLayoutNavbar
                :left-items="navbarLeftItems"
                @toggle="toggleLeftSideBar"
            >
                <template #center-content>
                    <slot name="navbar-center-content" />
                </template>
                <template #right-content>
                    <slot name="navbar-right-content" />
                </template>
            </DlLayoutNavbar>
        </div>
        <div class="dl-layout__body">
            <div>
                <DlLayoutLeftSide
                    :is-expanded="isExpandedLeftSide"
                    :items="leftItems"
                >
                    <template #default>
                        <slot name="left-side" />
                    </template>
                </DlLayoutLeftSide>
            </div>
            <div class="dl-layout__body__content">
                <slot />
                <div class="dl-layout__body__content__footer">
                    <slot name="layout-footer" />
                </div>
            </div>
            <div>
                <DlLayoutRightSide :items="rightItems">
                    <template #default>
                        <slot name="right-side" />
                    </template>
                </DlLayoutRightSide>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import { LayoutVerticalItems } from './types/VerticalItems'
import { HorizontalItems } from './types/HorizontalItems'
import DlLayoutNavbar from './components/DlLayoutNavbar.vue'
import DlLayoutLeftSide from './components/DlLayoutLeftSide.vue'
import DlLayoutRightSide from './components/DlLayoutRightSide.vue'

export default defineComponent({
    name: 'DlLayout',
    components: {
        DlLayoutNavbar,
        DlLayoutLeftSide,
        DlLayoutRightSide
    },
    props: {
        navbarLeftItems: {
            type: Array as PropType<HorizontalItems[]>,
            default: () => [] as HorizontalItems[]
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
    setup() {
        const isExpandedLeftSide = ref(true)
        const toggleLeftSideBar = (event: boolean) => {
            isExpandedLeftSide.value = event
        }

        return {
            isExpandedLeftSide,
            toggleLeftSideBar
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
            overflow: hidden;

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
