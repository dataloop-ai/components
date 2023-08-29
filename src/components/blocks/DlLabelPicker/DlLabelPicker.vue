<template>
    <div style="width: 200px">
        <dl-input
            v-model="inputValue"
            placeholder="No items selected"
            size="l"
            has-prepend
            padding-prop="0px 0px 0px 0px"
            :style="{ 'border-left': inputBorderLeft }"
        >
            <template #prepend>
                <dl-icon
                    style="margin-bottom: 5px"
                    icon="icon-dl-search"
                    size="12px"
                />
            </template>
        </dl-input>
        <dl-tree-table
            draggable="none"
            separator="none"
            :hide-pagination="true"
            :hide-header="true"
            :bordered="false"
            :columns="columns"
            selection="none"
            :loading="false"
            :filter="inputValue"
            :rows="items"
            row-key="name"
            color="dl-color-secondary"
            @row-click="handleRowClick"
        >
            <template #body-cell-displayLabel="item">
                <DlLabel
                    :text="item.row.displayLabel"
                    :indicator-color="item.row.color"
                    class="dl-label-picker-item"
                />
            </template>
        </dl-tree-table>
    </div>
</template>

<script lang="ts">
import { ref, PropType, defineComponent } from 'vue-demi'
import { DlLabel, DlInput, DlIcon, DlTreeTable } from '../../../components'
import { DlLabelPickerItem } from './types'

export default defineComponent({
    name: 'DlLabelPicker',
    components: {
        DlInput,
        DlIcon,
        DlLabel,
        DlTreeTable
    },
    props: {
        items: {
            type: Array as PropType<DlLabelPickerItem[]>,
            default: () => [] as PropType<DlLabelPickerItem[]>
        }
    },
    emits: ['selectedLabel'],
    setup(props, { emit, slots }) {
        const columns = [
            {
                name: 'displayLabel',
                label: '',
                required: false,
                align: 'left',
                field: 'displayLabel',
                sortable: false
            }
        ]

        const inputValue = ref('')
        const isInputActive = ref(false)
        const inputBorderLeft = ref('2px solid transparent')

        const handleRowClick = (_: MouseEvent, item: DlLabelPickerItem) => {
            inputBorderLeft.value = `2px solid ${item.color}`
            emit('selectedLabel', item)
        }

        return {
            handleRowClick,
            inputValue,
            inputBorderLeft,
            isInputActive,
            columns
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
