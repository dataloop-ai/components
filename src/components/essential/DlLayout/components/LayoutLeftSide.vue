<template>
    <div
        class="dl-layout-left-side"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <DlLayoutVerticalList
            :items="items"
            :is-visible="isVisible"
        />
        <div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    onMounted,
    watch,
    PropType
} from 'vue-demi'
import { LayoutVerticalItems } from '../types/VerticalItems'
import DlLayoutVerticalList from './LayoutVerticalList.vue'

export default defineComponent({
    name: 'DlLayoutLeftSide',
    components: {
        DlLayoutVerticalList
    },
    props: {
        isExpanded: {
            type: Boolean,
            default: true
        },
        items: {
            type: Array as PropType<LayoutVerticalItems[]>,
            default: () => [] as LayoutVerticalItems[]
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
    width: var(--dl-layout-left-side-width);
    height: 100%;
    overflow: auto;
    background-color: var(--dl-color-side-panel);
    transition: all 300ms;
}
</style>
