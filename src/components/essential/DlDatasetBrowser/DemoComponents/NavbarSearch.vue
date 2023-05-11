<template>
    <div class="navbar-search">
        <div style="display: flex; gap: 15px">
            <DlSmartSearch width="100%" />
            <dl-button flat>
                <div style="white-space: nowrap">
                    Switch to basic
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
import { defineComponent } from 'vue-demi'
import DlSmartSearch from '../../../compound/DlSearches/DlSmartSearch/DlSmartSearch.vue'
import DlButton from '../../../basic/DlButton/DlButton.vue'
import DlDropdownButton from '../../../compound/DlDropdownButton/DlDropdownButton.vue'
import DlList from '../../../essential/DlList/DlList.vue'
import DlListItem from '../../../basic/DlListItem/DlListItem.vue'
import DlItemSection from '../../../shared/DlItemSection/DlItemSection.vue'

export default defineComponent({
    name: 'NavbarSearch',
    components: {
        DlSmartSearch,
        DlButton,
        DlDropdownButton,
        DlList,
        DlListItem,
        DlItemSection
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
