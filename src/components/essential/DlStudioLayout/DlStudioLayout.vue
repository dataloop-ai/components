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
            <div class="dl-layout__body__left-menu">
                <NavigationDrawer
                    position="absolute"
                    location="left"
                    :expand-drawer="isExpandedLeftDrawer"
                    @expand="expandedLeftDrawer"
                >
                    <template #default>
                        <slot name="left-menu" />
                    </template>
                </NavigationDrawer>
            </div>
            <div
                v-if="hasLeftDrawerSlot"
                class="dl-layout__body__left-drawer"
            >
                <slot name="left-drawer" />
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
                v-if="hasRightDrawerSlot"
                class="dl-layout__body__right-drawer"
            >
                <NavigationDrawer
                    location="right"
                    position="relative"
                    :expand-drawer="isExpandedRightDrawer"
                    @expand="expandedRightDrawer"
                >
                    <template #default>
                        <slot name="right-drawer" />
                    </template>
                </NavigationDrawer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'
import LayoutNavbar from './components/LayoutNavbar.vue'
import NavigationDrawer from './components/NavigationDrawer.vue'

export default defineComponent({
    name: 'DlLayout',
    components: {
        LayoutNavbar,
        NavigationDrawer
    },
    props: {
        expandLeftDrawer: {
            type: Boolean,
            default: false
        },
        expandRightDrawer: {
            type: Boolean,
            default: false
        }
    },
    emits: ['expandedLeftDrawer', 'expandedRightDrawer'],
    setup(props, context) {
        const propsExpandLeftDrawer = computed(() => props.expandLeftDrawer)
        const isExpandedLeftDrawer = ref(propsExpandLeftDrawer.value)
        const propsExpandRightDrawer = computed(() => props.expandRightDrawer)
        const isExpandedRightDrawer = ref(propsExpandRightDrawer.value)
        const hasFooterSlot = computed(() => context.slots.footer !== undefined)
        const hasLeftMenuSlot = computed(
            () => context.slots['left-menu'] !== undefined
        )
        const hasLeftDrawerSlot = computed(
            () => context.slots['left-drawer'] !== undefined
        )
        const hasRightDrawerSlot = computed(
            () => context.slots['right-drawer'] !== undefined
        )
        const expandedLeftDrawer = (value: boolean) => {
            context.emit('expandedLeftDrawer', value)
        }
        const expandedRightDrawer = (value: boolean) => {
            context.emit('expandedRightDrawer', value)
        }

        watch(propsExpandLeftDrawer, (value) => {
            isExpandedLeftDrawer.value = value
        })

        watch(propsExpandRightDrawer, (value) => {
            isExpandedRightDrawer.value = value
        })

        return {
            isExpandedLeftDrawer,
            isExpandedRightDrawer,
            hasFooterSlot,
            hasLeftMenuSlot,
            hasLeftDrawerSlot,
            hasRightDrawerSlot,
            expandedLeftDrawer,
            expandedRightDrawer
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;

    &__navbar {
        border: 1px solid var(--dl-color-fill);
        box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);
    }

    &__body {
        display: flex;
        height: 100%;
        background-color: var(--dl-color-bg);
        color: var(--dl-color-darker);

        &__left-menu {
            position: relative;
        }

        &__left-drawer {
            width: 210px;
            padding: 10px;
        }
        &__right-drawer {
            position: relative;
            background-color: transparent;
        }

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
