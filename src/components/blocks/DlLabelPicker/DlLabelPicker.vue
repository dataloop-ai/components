<template>
    <div style="width: 200px">
        <dl-input
            v-model="inputValue"
            :placeholder="placeHolderText"
            size="l"
            has-prepend
            padding-prop="0px 0px 0px 0px"
            :style="inputStyles"
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
            row-key="identifier"
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
import { ref, PropType, defineComponent, computed } from 'vue-demi'
import { DlLabel, DlIcon } from '../../essential'
import { DlInput, DlTreeTable } from '../../compound'
import { DlTableColumn } from '../../types'
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
        const columns: DlTableColumn[] = [
            {
                name: 'displayLabel',
                label: '',
                required: false,
                align: 'left',
                field: 'displayLabel',
                sortable: false,
                style: `cursor: pointer;`
            }
        ]

        const inputValue = ref('')
        const isInputActive = ref(false)
        const inputBorderLeft = ref('2px solid transparent')
        const currentSelectedLabel = ref<DlLabelPickerItem>(null)

        const handleRowClick = (_: MouseEvent, item: DlLabelPickerItem) => {
            currentSelectedLabel.value = item
            emit('selectedLabel', item)
        }

        const placeHolderText = computed(() => {
            if (!currentSelectedLabel.value) {
                return `No items selected`
            }

            return currentSelectedLabel.value.displayLabel
        })

        const selectedColor = computed(() => {
            if (!currentSelectedLabel.value) {
                return null
            }
            return currentSelectedLabel.value.color
        })

        const inputStyles = computed(() => {
            return { 'border-left': `2px solid ${selectedColor.value}` }
        })

        return {
            handleRowClick,
            inputValue,
            inputBorderLeft,
            isInputActive,
            columns,
            selectedColor,
            placeHolderText,
            inputStyles
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
