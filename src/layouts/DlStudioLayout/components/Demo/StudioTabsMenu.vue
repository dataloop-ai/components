<template>
    <div
        class="tabs-menu"
        :style="cssVars"
    >
        <dl-tabs
            v-model="selectedTab"
            :items="tabItems"
            @update:model-value="handleSelectedOption"
        />
        <div class="tabs-menu__border-icon">
            <dl-button
                flat
                :icon="expandIcon"
                @click="onToggle"
            />
        </div>
        <component :is="tabs" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import TabMenuAnnotations from './TabMenu/TabMenuAnnotations.vue'
import TabMenuItem from './TabMenu/TabMenuItem.vue'
import {
    DlTabs,
    DlTabPanels,
    DlTabPanel,
    DlIcon,
    DlButton
} from '../../../../components'
import { DlTabDetails } from '../../../../components/types'

export default defineComponent({
    name: 'StudioTabsMenu',
    components: {
        DlTabs,
        DlTabPanels,
        DlTabPanel,
        TabMenuAnnotations,
        TabMenuItem,
        DlButton,
        DlIcon
    },
    props: {},
    setup() {
        const LARGE_WIDTH = '250px'
        const SMALL_WIDTH = '0px'
        const tabsMenuWidth = ref('')
        const isExpanded = ref(true)
        const selectedTab = ref('annotations')
        const tabItems = [
            {
                label: 'Annotations',
                name: 'annotations'
            },
            { label: 'Item', name: 'item' }
        ] as DlTabDetails[]

        const selectedOption = ref(null)

        const handleSelectedOption = (option: any) => {
            selectedOption.value = option
        }
        const tabs = computed(() => {
            switch (selectedTab.value) {
                case 'annotations':
                    return 'TabMenuAnnotations'
                case 'item':
                    return 'TabMenuItem'
                default:
                    return 'TabMenuAnnotations'
            }
        })

        const onToggle = () => {
            isExpanded.value = !isExpanded.value
            tabsMenuWidth.value = isExpanded.value ? LARGE_WIDTH : SMALL_WIDTH
        }
        const expandIcon = computed(() =>
            isExpanded.value ? 'icon-dl-right-chevron' : 'icon-dl-left-chevron'
        )
        const cssVars = computed(() => {
            return {
                '--tabs-menu-width': tabsMenuWidth.value
            }
        })

        return {
            selectedOption,
            handleSelectedOption,
            selectedTab,
            tabItems,
            tabs,
            cssVars,
            onToggle,
            expandIcon
        }
    }
})
</script>

<style scoped lang="scss">
.tabs-menu {
    width: var(--tabs-menu-width);
    overflow: auto;
    transition: all 300ms;

    &__border-icon {
        position: absolute;
        margin-left: -21px;
        background-color: var(--dl-color-bg);
        border-radius: 50%;
    }
}
</style>
