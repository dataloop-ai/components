<template>
    <div
        class="dl-layout-drawer"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div style="height: 100%; position: relative">
            <div
                v-if="location === 'right'"
                class="dl-layout-drawer__wrapper"
            >
                <dl-icon
                    :icon="expandIcon"
                    size="25px"
                    class="dl-layout-drawer__wrapper__expand-icon"
                    :class="{ expanded: !isExpanded }"
                    @click="toggleExpandDrawer"
                />
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue-demi'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'

export default defineComponent({
    name: 'NavigationDrawer',
    components: {
        DlIcon
    },
    props: {
        position: {
            type: String,
            default: 'relative',
            validator: (val: string) => ['relative', 'absolute'].includes(val)
        },
        location: {
            type: String,
            default: 'left',
            validator: (val: string) => ['left', 'right'].includes(val)
        },
        expandDrawer: {
            type: Boolean
        }
    },
    emits: ['expand'],
    setup(props, context) {
        const isVisible = ref(true)
        const propsExpandDrawer = computed(() => props.expandDrawer)
        const isExpanded = ref(propsExpandDrawer.value)
        const drawerWidth = ref('')
        const LARGE_WIDTH = '250px'
        const SMALL_WIDTH = '0px'

        const onMouseEnter = () => {
            if (isExpanded.value) return
            drawerWidth.value = LARGE_WIDTH
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpanded.value) return
            drawerWidth.value = SMALL_WIDTH
            isVisible.value = false
        }
        const expandIcon = computed(() =>
            props.location === 'left'
                ? 'icon-dl-left-chevron'
                : 'icon-dl-right-chevron'
        )
        const toggleExpandDrawer = () => {
            isExpanded.value = !isExpanded.value
            context.emit('expand', isExpanded.value)
        }

        onMounted(() => {
            drawerWidth.value = SMALL_WIDTH
        })
        watch(isExpanded, (value) => {
            isVisible.value = value
            drawerWidth.value = value ? LARGE_WIDTH : SMALL_WIDTH
        })

        watch(propsExpandDrawer, (value) => {
            isExpanded.value = value
        })

        const cssVars = computed(() => {
            return {
                '--dl-layout-drawer-width': isExpanded.value
                    ? LARGE_WIDTH
                    : SMALL_WIDTH,
                '--dl-layout-position': props.position,
                '--dl-layout-drawer-overflow':
                    props.position === 'absolute' ? 'hidden' : null
            }
        })
        return {
            cssVars,
            onMouseEnter,
            drawerWidth,
            onMouseLeave,
            isVisible,
            expandIcon,
            isExpanded,
            toggleExpandDrawer
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-drawer {
    position: var(--dl-layout-position);
    z-index: 1;
    width: var(--dl-layout-drawer-width);
    height: 100%;
    overflow: var(--dl-layout-drawer-overflow);
    transition: all 300ms;
    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);
    background-color: transparent;

    &__wrapper {
        position: absolute;
        top: 70px;
        left: -17px;
        cursor: pointer;
        color: var(--dl-color-lighter);
        text-align: right;
        margin-top: 8px;
        background-color: var(--dl-color-bg);
        border-radius: 50px;

        &__expand-icon {
            display: flex !important;
            transition: all 300ms;

            &.expanded {
                transform: rotate(180deg);
            }
        }
    }
}
</style>
