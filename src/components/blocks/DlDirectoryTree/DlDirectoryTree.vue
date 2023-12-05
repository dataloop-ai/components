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
            shallow-select
            row-key="identifier"
            color="dl-color-secondary"
            @row-click="$emit('click', $event)"
            @selection-change="$emit('selected', $event)"
        >
            <template #body-cell-displayLabel="props">
                <DlLabel
                    :text="props.row.displayLabel"
                    style="width: 100%"
                >
                    <template #actions>
                        <slot name="actions">
                            <div
                                style="
                                    display: flex;
                                    gap: 5px;
                                    align-items: center;
                                    height: 100%;
                                    margin-right: 5px;
                                "
                            >
                                <dl-icon
                                    icon="icon-dl-add"
                                    @click="$emit('add-dir', props.row)"
                                />
                                <dl-icon
                                    icon="icon-dl-delete"
                                    @click="$emit('delete-dir', props.row)"
                                />
                            </div>
                        </slot>
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
    emits: ['click', 'selected', 'add-dir', 'delete-dir'],
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

        const rows = computed<DlTableRow[]>(() => {
            return items.value?.map((i: DlDirectoryTreeItem) => ({
                ...i,
                name: i.displayLabel
            }))
        })

        return {
            columns,
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
