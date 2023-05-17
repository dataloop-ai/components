<template>
    <div class="navbar-search">
        <div
            v-if="!isBasicSearch"
            style="display: flex; gap: 15px"
        >
            <div style="width: 100%; position: relative">
                <DlSmartSearch width="100%" />
            </div>
            <dl-button
                flat
                @click="isBasicSearch = !isBasicSearch"
            >
                <div style="white-space: nowrap">
                    Switch to basic
                </div>
            </dl-button>
        </div>
        <div
            v-if="isBasicSearch"
            style="display: flex; gap: 15px; align-items: center"
        >
            <SearchFilterMenu />
            <dl-button
                flat
                @click="isBasicSearch = !isBasicSearch"
            >
                <div style="white-space: nowrap">
                    Reset
                </div>
            </dl-button>
        </div>
        <div style="display: flex; align-items: center; justify-content: end">
            <dl-button
                icon="icon-dl-info"
                color="secondary"
                flat
            >
                Details
            </dl-button>
            <dl-button
                icon="icon-dl-refresh"
                color="secondary"
                flat
            >
                Details
            </dl-button>
            <dl-dropdown-button
                split
                label="Create Task"
            >
                <dl-list>
                    <dl-list-item clickable>
                        <dl-item-section> Photos </dl-item-section>
                    </dl-list-item>

                    <dl-list-item clickable>
                        <dl-item-section> Videos </dl-item-section>
                    </dl-list-item>

                    <dl-list-item clickable>
                        <dl-item-section> Articles </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-dropdown-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlSmartSearch from '../../../compound/DlSearches/DlSmartSearch/DlSmartSearch.vue'
import DlButton from '../../../basic/DlButton/DlButton.vue'
import DlDropdownButton from '../../../compound/DlDropdownButton/DlDropdownButton.vue'
import DlList from '../../../essential/DlList/DlList.vue'
import DlListItem from '../../../basic/DlListItem/DlListItem.vue'
import DlItemSection from '../../../shared/DlItemSection/DlItemSection.vue'
import SearchFilterMenu from './SearchFilterMenu.vue'

export default defineComponent({
    name: 'NavbarSearch',
    components: {
        DlSmartSearch,
        DlButton,
        DlDropdownButton,
        DlList,
        DlListItem,
        DlItemSection,
        SearchFilterMenu
    },
    setup() {
        const isBasicSearch = ref(false)

        return {
            isBasicSearch
        }
    }
})
</script>

<style scoped>
.navbar-search {
    height: 70px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-self: center;
    justify-content: center;
    background-color: var(--dl-color-panel-background);
    padding-inline: 25px;
    align-items: center;
}
</style>
