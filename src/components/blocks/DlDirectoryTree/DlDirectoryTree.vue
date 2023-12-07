<template>
    <div :style="`width: ${width}`">
        <dl-input
            v-model="inputValue"
            placeholder="Search a folder"
            size="m"
            has-prepend
            padding-prop="0px 0px 0px 0px"
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
            ref="tree"
            draggable="none"
            separator="none"
            :hide-pagination="true"
            hide-header
            hide-bottom
            :bordered="false"
            :columns="columns"
            selection="multiple"
            :loading="false"
            :filter="inputValue"
            :rows="rows"
            shallow-select
            indented-chevron
            row-key="identifier"
            color="dl-color-secondary"
            @row-click="$emit('click', $event)"
            @selection-change="$emit('selected', $event)"
            @row-expanded="onExpandedRow"
        >
            <template #body-cell-displayLabel="props">
                <dl-icon
                    :icon="
                        props.row.isExpanded
                            ? 'icon-dl-open-folder'
                            : 'icon-dl-folder'
                    "
                    style="margin-right: 6px"
                />
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
import {
    ref,
    PropType,
    defineComponent,
    computed,
    toRefs,
    watch
} from 'vue-demi'
import { DlLabel, DlIcon } from '../../essential'
import { DlTreeTable, DlInput } from '../../compound'
import { DlTableColumn, DlTableRow } from '../../types'
import { DlDirectoryTreeItem } from './types'
import { nextTick } from 'process'

export default defineComponent({
    name: 'DlDirectoryTree',
    components: {
        DlTreeTable,
        DlLabel,
        DlIcon,
        DlInput
    },
    props: {
        items: {
            type: Array as PropType<DlDirectoryTreeItem[]>,
            default: () => [] as PropType<DlDirectoryTreeItem[]>
        },
        expandedDirs: {
            type: Array as PropType<(string | DlDirectoryTreeItem)[]>,
            default: () => [] as PropType<(string | DlDirectoryTreeItem)[]>
        },
        width: {
            type: String,
            default: '200px'
        }
    },
    emits: ['click', 'selected', 'expanded', 'add-dir', 'delete-dir'],
    setup(props, { emit }) {
        const { items, expandedDirs } = toRefs(props)
        const tree = ref<any>(null)

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

        const rows = computed<DlTableRow[]>(() => {
            return items.value?.map((i: DlDirectoryTreeItem) => ({
                ...i,
                name: i.displayLabel
            }))
        })

        watch(
            [items, expandedDirs],
            () => {
                nextTick(() => {
                    if (!tree.value) {
                        return
                    }

                    for (const val of expandedDirs.value) {
                        const textValue =
                            typeof val === 'string'
                                ? val
                                : (val as DlDirectoryTreeItem).identifier
                        tree.value?.updateExpandedRow(true, textValue)
                    }

                    expandedRows.value = expandedDirs.value.map((val) => {
                        const textValue =
                            typeof val === 'string'
                                ? val
                                : (val as DlDirectoryTreeItem).identifier
                        return items.value.find(
                            (r) => r.identifier === textValue
                        )
                    })
                })
            },
            { immediate: true }
        )

        const expandedRows = ref<DlDirectoryTreeItem[]>([])

        const onExpandedRow = (
            isExpanded: boolean,
            name: string,
            rowsArr: DlDirectoryTreeItem[]
        ) => {
            if (isExpanded) {
                expandedRows.value.push(
                    items.value.find((r) => r.identifier === name)
                )
            } else {
                expandedRows.value = expandedRows.value.filter(
                    (r) => r.identifier !== name
                )
            }

            emit('expanded', isExpanded, name, rowsArr)
        }

        return {
            tree,
            columns,
            rows,
            inputValue,
            onExpandedRow,
            expandedRows
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
