<template>
    <div>
        <dl-tabs
            v-model="selectedTab"
            :items="tabItems"
            @update:model-value="handleModelValueUpdate"
        />
        <div style="height: 4px" />
        <dl-tab-panels v-model="selectedTab">
            <dl-tab-panel
                v-for="item in tabItems"
                :key="item.name"
                class="tabpanel"
                :name="item.name"
            >
                <h1>{{ item.label }}</h1>
            </dl-tab-panel>
        </dl-tab-panels>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTabs, DlTabPanel, DlTabPanels } from '../components'
import { DlTabDetails } from '../components/types'

export default defineComponent({
    components: {
        DlTabs,
        DlTabPanel,
        DlTabPanels
    },
    data() {
        return {
            selectedTab: 'one',
            tabItems: [
                {
                    label: 'One',
                    name: 'one',
                    showTooltip: true,
                    tooltip: 'Some tooltip content'
                },
                { label: 'Two', name: 'two' },
                { label: 'Three', name: 'three' },
                { label: 'Four', name: 'four', disabled: true },
                { label: 'Five', name: 'five' },
                { label: 'Six', name: 'six' },
                { label: 'Seven', name: 'seven' },
                { label: 'Eight', name: 'eight' }
            ] as DlTabDetails[]
        }
    },
    methods: {
        handleModelValueUpdate(e: string) {
            console.log(e)
        }
    }
})
</script>
<style scoped>
.tabpanel {
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid var(--dl-color-separator);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
</style>
