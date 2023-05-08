<template>
    <div class="tabs-menu">
        <dl-tabs
            v-model="selectedTab"
            :items="tabItems"
            @update:model-value="handleSelectedOption"
        />
        <div style="height: 4px" />
        <component :is="tabs" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import DlTabs from '../../../../compound/DlTabs/DlTabs.vue'
import DlTabPanels from '../../../../compound/DlTabPanels/DlTabPanels.vue'
import DlTabPanel from '../../../../compound/DlTabPanels/DlTabPanel.vue'
import { DlTabDetails } from '../../../../compound/DlTabs/types'
import TabMenuAnnotations from './TabMenu/TabMenuAnnotations.vue'
import TabMenuItem from './TabMenu/TabMenuItem.vue'

export default defineComponent({
    name: 'TabsMenu',
    components: {
        DlTabs,
        DlTabPanels,
        DlTabPanel,
        TabMenuAnnotations,
        TabMenuItem
    },
    props: {},
    setup() {
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

        return {
            selectedOption,
            handleSelectedOption,
            selectedTab,
            tabItems,
            tabs
        }
    }
})
</script>

<style scoped lang="scss">
.tabpanel {
    margin: 0 auto;
    padding: 1rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
.tabs-menu {
    padding: 10px;
}
</style>
