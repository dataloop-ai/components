<template>
    <div
        class="dl-layout-vertical-sidebar"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div style="height: 100%">
            <div class="dl-layout-vertical-sidebar__expand-icon">
                <dl-icon
                    :icon="expandIcon"
                    size="20px"
                    @click="expandSidebar"
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
            default: 'left',
            validator: (val: string) => ['left', 'right'].includes(val)
        }
    },
    emits: ['expand'],
    setup(props, context) {
        const isVisible = ref(true)
        const isExpanded = ref(true)
        const sideWidth = ref('')
        const largeWidth = '206px'
        const smallWidth = '44px'

        const onMouseEnter = () => {
            if (isExpanded.value) return
            sideWidth.value = largeWidth
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpanded.value) return
            sideWidth.value = smallWidth
            isVisible.value = false
        }
        const expandIcon = computed(() =>
            props.position === 'left' ? 'icon-dl-expand' : 'icon-dl-collapse'
        )
        const expandSidebar = () => {
            isExpanded.value = !isExpanded.value
            context.emit('expand', isExpanded.value)
        }

        onMounted(() => {
            sideWidth.value = largeWidth
        })
        watch(isExpanded, (value) => {
            isVisible.value = value
            sideWidth.value = value ? largeWidth : smallWidth
        })
        const cssVars = computed(() => {
            return {
                '--dl-layout-vertical-side-width': sideWidth.value
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
            expandSidebar
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-vertical-sidebar {
    position: relative;
    width: var(--dl-layout-vertical-side-width);
    height: 100%;
    overflow: auto;
    transition: all 300ms;
    border: 1px solid var(--dl-color-fill);
    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);

    &__expand-icon {
        position: absolute;
        right: 5px;
        cursor: pointer;
        color: var(--dl-color-lighter);
        text-align: right;
        margin-top: 8px;
    }
}
</style>
