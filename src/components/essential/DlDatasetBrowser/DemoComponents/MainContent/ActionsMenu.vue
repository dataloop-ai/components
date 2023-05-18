<template>
    <dl-dropdown-button
        auto-close
        flat
        label="Actions"
        :no-wrap="false"
        :overflow="false"
        fit-content
        text-color="dl-color-darker"
    >
        <dl-list
            bordered
            separator
        >
            <dl-list-item
                v-for="item in items"
                :key="item.id"
                clickable
                :bordered="item.isBordered"
                :start-icon="item.icon"
                :start-icon-color="item.iconColor"
                @click="handleOption(item)"
            >
                <dl-item-section :color="item.labelColor">
                    {{ item.label }}
                </dl-item-section>
            </dl-list-item>
        </dl-list>
    </dl-dropdown-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlDropdownButton from '../../../../compound/DlDropdownButton/DlDropdownButton.vue'
// import DlMenu from '../../../DlMenu/DlMenu.vue'
import DlList from '../../../DlList/DlList.vue'
import DlListItem from '../../../../basic/DlListItem/DlListItem.vue'
import DlItemSection from '../../../../shared/DlItemSection/DlItemSection.vue'

export default defineComponent({
    name: 'ActionsMenu',
    components: {
        DlDropdownButton,
        DlList,
        DlListItem,
        DlItemSection
    },
    props: {
        items: {
            type: Array,
            default: () => [] as Record<string, any>[]
        }
    },
    emits: ['onChange'],
    setup(props, context) {
        const handleOption = (event: Event) => {
            console.log('click: ', event)
            context.emit('onChange', event)
        }

        return {
            handleOption
        }
    }
})
</script>

<style scoped></style>
