<template>
    <div
        class="dl-layout-left-side"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div>
            <div class="dl-layout-left-side__expand-icon">
                <dl-icon icon="icon-dl-expand" />
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'

import { defineComponent, ref, computed, onMounted, watch } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutLeftSide',
    components: {
        DlIcon
    },
    props: {
        isExpanded: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const isVisible = ref(true)
        const leftSideWidth = ref('')
        const largeWidth = '206px'
        const smallWidth = '44px'

        const onMouseEnter = () => {
            if (isExpandedProp.value) return
            leftSideWidth.value = largeWidth
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpandedProp.value) return
            leftSideWidth.value = smallWidth
            isVisible.value = false
        }
        const isExpandedProp = computed(() => props.isExpanded)

        onMounted(() => {
            leftSideWidth.value = largeWidth
        })
        watch(isExpandedProp, (value) => {
            isVisible.value = value
            leftSideWidth.value = value ? largeWidth : smallWidth
        })
        const cssVars = computed(() => {
            return {
                '--dl-layout-left-side-width': leftSideWidth.value
            }
        })
        return {
            cssVars,
            onMouseEnter,
            leftSideWidth,
            onMouseLeave,
            isVisible
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-left-side {
    position: relative;
    width: var(--dl-layout-left-side-width);
    height: 100%;
    overflow: auto;
    background-color: var(--dl-color-side-panel);
    transition: all 300ms;

    &__expand-icon {
        position: absolute;
        right: 0;
        cursor: pointer;
        color: var(--dl-color-lighter);
        text-align: right;
        margin-top: 8px;
    }
}
</style>
