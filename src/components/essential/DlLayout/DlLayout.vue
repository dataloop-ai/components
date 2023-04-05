<template>
    <div class="dl-layout">
        <div class="dl-layout__navbar">
            <DlLayoutNavbar @toggle="toggleLeftSideBar" />
        </div>
        <div class="dl-layout__body">
            <div>
                <DlLayoutLeftSide
                    :is-expanded="isExpandedLeftSide"
                    :items="leftItems"
                />
            </div>
            <div class="dl-layout__body__content">
                <slot />
            </div>
            <div>
                <DlLayoutRightSide />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import DlLayoutNavbar from './components/DlLayoutNavbar.vue'
import DlLayoutLeftSide from './components/DlLayoutLeftSide.vue'
import DlLayoutRightSide from './components/DlLayoutRightSide.vue'
import { LayoutVerticalItems } from './types/VerticalItems'

export default defineComponent({
    name: 'DlLayout',
    components: {
        DlLayoutNavbar,
        DlLayoutLeftSide,
        DlLayoutRightSide
    },
    props: {
        leftItems: {
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
            padding: 1px 16px;
            height: 100%;
        }
    }
}
</style>
