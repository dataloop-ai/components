<template>
    <div :style="`width: ${width}`">
        <dl-tree-table
            draggable="none"
            separator="none"
            :hide-pagination="true"
            :hide-header="true"
            :bordered="false"
            :columns="columns"
            selection="multiple"
            :loading="false"
            :filter="inputValue"
            :rows="rows"
            row-key="identifier"
            color="dl-color-secondary"
            @row-click="handleRowClick"
        >
            <template #body-cell-displayLabel="props">
                <DlLabel
                    :text="props.row.displayLabel"
                    style="width: 100%"
                >
                    <template #actions>
                        <div
                            style="
                                display: flex;
                                gap: 5px;
                                align-items: center;
                                height: 100%;
                                margin-right: 5px;
                            "
                        >
                            <dl-icon icon="icon-dl-add" />
                            <dl-icon icon="icon-dl-delete" />
                        </div>
                    </template>
                </DlLabel>
            </template>
        </dl-tree-table>
    </div>
</template>

<script lang="ts">
import { ref, PropType, defineComponent, computed, toRefs } from 'vue-demi'
import { DlLabel, DlIcon } from '../../essential'
import { DlTreeTable } from '../../compound'
import { DlTableColumn, DlTableRow } from '../../types'
import { DlDirectoryTreeItem } from './types'

export default defineComponent({
    name: 'DlDirectoryTree',
    components: {
        DlTreeTable,
        DlLabel,
        DlIcon
    },
    props: {
        items: {
            type: Array as PropType<DlDirectoryTreeItem[]>,
            default: () => [] as PropType<DlDirectoryTreeItem[]>
        },
        width: {
            type: String,
            default: '200px'
        }
    },
    emits: ['selected-label', 'click'],
    setup(props, { emit, slots }) {
        const { items } = toRefs(props)

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
        const currentSelectedLabel = ref<DlDirectoryTreeItem>(null)

        const handleRowClick = (_: MouseEvent, item: DlDirectoryTreeItem) => {}

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
            if (!selectedColor.value) {
                return {}
            }
            return { 'border-left': `2px solid ${selectedColor.value}` }
        })

        const rows = computed<DlTableRow[]>(() => {
            return items.value?.map((i: DlDirectoryTreeItem) => ({
                ...i,
                name: i.displayLabel
            }))
        })

        return {
            handleRowClick,
            inputValue,
            columns,
            placeHolderText,
            inputStyles,
            rows
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
