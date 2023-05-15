<template>
    <div
        :id="uuid"
        class="dl-filters-wrapper"
    >
        <dl-tabs
            v-model="currentTab"
            volatile
            full-width
            :items="tabItems"
        />
        <div class="dl-filters-tabs">
            <dl-tab-panels v-model="currentTab">
                <dl-tab-panel
                    v-for="tab in tabItems"
                    :key="tab.name"
                >
                    <div>
                        <filters-query
                            v-for="(query, index) in filters[currentTab]"
                            :key="index"
                            :type="currentTab"
                            :name="query.name"
                            @search="$emit('filters-search', currentTab, query)"
                            @delete="$emit('filters-delete', currentTab, query)"
                        />
                    </div>
                </dl-tab-panel>
            </dl-tab-panels>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlTabs } from '../../../DlTabs'
import { DlTabPanels, DlTabPanel } from '../../../DlTabPanels'
import { Filters } from '../../../DlSearches/DlSmartSearch/types'
import { getTabItems } from '../utils/utils'
import FiltersQuery from './FiltersQuery.vue'

export default defineComponent({
    components: {
        DlTabs,
        DlTabPanels,
        DlTabPanel,
        FiltersQuery
    },
    props: {
        filters: {
            type: Object as PropType<Filters>,
            default: (): Filters => ({ saved: [], recent: [], suggested: [] })
        }
    },
    emits: ['filters-delete', 'filters-search'],
    data() {
        return {
            currentTab: 'saved'
        }
    },
    computed: {
        tabItems(): { label: string; name: string }[] {
            return getTabItems(this.filters)
        }
    }
})
</script>
<style scoped lang="scss">
.dl-filters-wrapper {
    min-height: 300px;
}
.dl-filters-tabs {
    margin-top: 5px;
}
</style>
