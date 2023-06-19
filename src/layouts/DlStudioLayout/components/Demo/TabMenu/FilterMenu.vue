<template>
    <dl-button
        flat
        icon="icon-dl-filter"
    >
        <dl-menu>
            <dl-list
                style="display: flex"
                bordered
                separator
            >
                <dl-list-item
                    v-for="(listItem, listItemIndex) in listItems"
                    :key="listItemIndex"
                    clickable
                    :start-icon="listItem.icon"
                    :start-icon-color="listItem.color"
                >
                    <dl-item-section no-wrap>
                        {{ listItem.label }}
                    </dl-item-section>
                </dl-list-item>
            </dl-list>
        </dl-menu>
    </dl-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlButton from '../../../../../basic/DlButton/DlButton.vue'
import DlMenu from '../../../../../essential/DlMenu/DlMenu.vue'
import DlList from '../../../../../essential/DlList/DlList.vue'
import DlListItem from '../../../../../basic/DlListItem/DlListItem.vue'
import DlItemSection from '../../../../../shared/DlItemSection/DlItemSection.vue'

export default defineComponent({
    name: 'FilterMenu',
    components: {
        DlButton,
        DlMenu,
        DlList,
        DlListItem,
        DlItemSection
    },
    setup() {
        const listItems = [
            {
                icon: 'icon-dl-classification',
                color: '',
                label: 'Classification'
            }
        ]
        return {
            listItems
        }
    }
})
</script>

<style scoped></style>
