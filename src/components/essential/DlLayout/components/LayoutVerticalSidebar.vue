<template>
    <div
        class="dl-layout-vertical-sidebar"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div style="height: 100%; position: relative">
            <div
                v-if="side === 'right'"
                class="dl-layout-vertical-sidebar__wrapper"
            >
                <dl-icon
                    :icon="expandIcon"
                    size="25px"
                    class="dl-layout-vertical-sidebar__wrapper__expand-icon"
                    :class="{ expanded: !isExpanded }"
                    @click="toggleExpandSidebar"
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
    name: 'LayoutVerticalSidebar',
    components: {
        DlIcon
    },
    props: {
        position: {
            type: String,
            default: 'relative',
            validator: (val: string) => ['relative', 'absolute'].includes(val)
        },
        side: {
            type: String,
            default: 'left',
            validator: (val: string) => ['left', 'right'].includes(val)
        },
        expandSidebar: {
            type: Boolean
        }
    },
    emits: ['expand'],
    setup(props, context) {
        const isVisible = ref(true)
        const propsExpandSidebar = computed(() => props.expandSidebar)
        const isExpanded = ref(propsExpandSidebar.value)
        const sideWidth = ref('')
        const LARGE_WIDTH = '250px'
        const SMALL_WIDTH = '0px'

        const onMouseEnter = () => {
            if (isExpanded.value) return
            sideWidth.value = LARGE_WIDTH
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpanded.value) return
            sideWidth.value = SMALL_WIDTH
            isVisible.value = false
        }
        const expandIcon = computed(() =>
            props.side === 'left'
                ? 'icon-dl-left-chevron'
                : 'icon-dl-right-chevron'
        )
        const toggleExpandSidebar = () => {
            isExpanded.value = !isExpanded.value
            context.emit('expand', isExpanded.value)
        }

        onMounted(() => {
            sideWidth.value = SMALL_WIDTH
        })
        watch(isExpanded, (value) => {
            isVisible.value = value
            sideWidth.value = value ? LARGE_WIDTH : SMALL_WIDTH
        })

        watch(propsExpandSidebar, (value) => {
            isExpanded.value = value
        })

        const cssVars = computed(() => {
            return {
                '--dl-layout-vertical-side-width': isExpanded.value
                    ? LARGE_WIDTH
                    : SMALL_WIDTH,
                '--dl-layout-position': props.position,
                '--dl-layout-vertical-side-overflow':
                    props.position === 'absolute' ? 'hidden' : null
            }
        })
        return {
            cssVars,
            onMouseEnter,
            sideWidth,
            onMouseLeave,
            isVisible,
            expandIcon,
            isExpanded,
            toggleExpandSidebar
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-vertical-sidebar {
    position: var(--dl-layout-position);
    z-index: 1;
    width: var(--dl-layout-vertical-side-width);
    height: 100%;
    overflow: var(--dl-layout-vertical-side-overflow);
    transition: all 300ms;
    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);
    background-color: transparent;

    &__wrapper {
        position: absolute;
        top: 70px;
        left: -18px;
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
