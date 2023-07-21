<template>
    <div>
        <DlTable
            ref="dlTableRef"
            :selected="selected"
            :separator="separator"
            :columns="tableColumns"
            :bordered="bordered"
            :draggable="draggable"
            :dense="dense"
            :filter="filter"
            :selection="selection"
            :loading="loading"
            :rows="tableRows"
            :flat-tree-data="hasFlatTreeData"
            :resizable="resizable"
            :row-key="rowKey"
            :color="color"
            :title="title"
            :virtual-scroll="virtualScroll"
            :rows-per-page-options="rowsPerPageOptions"
            @row-click="emitRowClick"
            @th-click="emitThClick"
            @update:selected="updateSelected"
        >
            <template #header-selection>
                <DlCheckbox
                    style="padding-left: 10px"
                    :color="color"
                    :model-value="headerSelectedValue"
                    :indeterminate-value="true"
                    @update:model-value="onMultipleSelectionSet"
                />
            </template>
            <template #body="props">
                <template v-if="virtualScroll">
                    <DlTrTreeView
                        :row="props.item"
                        :is-row-selected="
                            isRowSelected(rowKey, getRowKey(props.item))
                                ? 'selected'
                                : ''
                        "
                        :has-any-action="dlTableRef.hasAnyAction"
                        :no-hover="dlTableRef.noHover"
                        :page-index="props.index"
                        :has-draggable-rows="dlTableRef.hasDraggableRows"
                        :has-selection-mode="dlTableRef.hasSelectionMode"
                        :bind-body-selection="
                            dlTableRef.getBodySelectionScope({
                                key: getRowKey(props.item),
                                row: props.item,
                                pageIndex: props.index
                            })
                        "
                        :bind-body-cell-scope="
                            dlTableRef.getBodyCellScope({
                                key: getRowKey(props.item),
                                row: props.item,
                                pageIndex: props.index
                            })
                        "
                        :color="color"
                        :computed-cols="dlTableRef.computedCols"
                        :slot-name="dlTableRef.slotNames"
                        :computed-rows="computedRows"
                        :model-value="
                            isRowSelected(rowKey, getRowKey(props.item))
                        "
                        @update:model-value="
                            (adding, evt) =>
                                updateSelectionHierarchy(
                                    adding,
                                    evt,
                                    props.item
                                )
                        "
                        @rowClick="
                            dlTableRef.onTrClick(
                                $event,
                                props.item,
                                props.index
                            )
                        "
                        @rowDoubleClick="
                            dlTableRef.onTrDblClick(
                                $event,
                                props.item,
                                props.index
                            )
                        "
                        @rowContextMenu="
                            dlTableRef.onTrContextMenu(
                                $event,
                                props.item,
                                props.index
                            )
                        "
                        @updateExpandedRow="
                            updateExpandedRow(
                                !props.item.expanded,
                                getRowKey(props.item)
                            )
                        "
                    />
                </template>
                <template v-else>
                    <template v-if="dlTableRef">
                        <!--
                        <pre>
                            {{ computedRows }}
                        </pre>
                        -->
                        <DlTrTreeView
                            v-for="(row, pageIndex) in computedRows"
                            :row="row"
                            :is-row-selected="
                                isRowSelected(rowKey, getRowKey(row))
                                    ? 'selected'
                                    : ''
                            "
                            :has-any-action="dlTableRef.hasAnyAction"
                            :no-hover="dlTableRef.noHover"
                            :page-index="pageIndex"
                            :has-draggable-rows="dlTableRef.hasDraggableRows"
                            :has-selection-mode="dlTableRef.hasSelectionMode"
                            :bind-body-selection="
                                dlTableRef.getBodySelectionScope({
                                    key: getRowKey(row),
                                    row,
                                    pageIndex
                                })
                            "
                            :bind-body-cell-scope="
                                dlTableRef.getBodyCellScope({
                                    key: getRowKey(row),
                                    row,
                                    pageIndex
                                })
                            "
                            :color="color"
                            :computed-cols="dlTableRef.computedCols"
                            :slot-name="dlTableRef.slotNames"
                            :computed-rows="computedRows"
                            :model-value="isRowSelected(rowKey, getRowKey(row))"
                            @update:model-value="
                                (adding, evt) =>
                                    updateSelectionHierarchy(adding, evt, row)
                            "
                            @rowClick="
                                dlTableRef.onTrClick($event, row, pageIndex)
                            "
                            @rowDoubleClick="
                                dlTableRef.onTrDblClick($event, row, pageIndex)
                            "
                            @rowContextMenu="
                                dlTableRef.onTrContextMenu(
                                    $event,
                                    row,
                                    pageIndex
                                )
                            "
                            @updateExpandedRow="
                                updateExpandedRow(!row.expanded, getRowKey(row))
                            "
                        />
                    </template>
                    <template v-else>
                        no data
                    </template>
                </template>
            </template>
        </DlTable>
    </div>
</template>

<script lang="ts">
import {
    computed,
    ComputedRef,
    defineComponent,
    nextTick,
    PropType,
    ref,
    isVue2,
    set
} from 'vue-demi'
import { DlTable } from '../../../components'
import DlTrTreeView from './views/DlTrTreeView.vue'
import { cloneDeep, isNumber, times } from 'lodash'
import { DlTableProps, DlTableRow } from '../DlTable/types'
import { DlEmptyStateProps } from '../../basic/DlEmptyState/types'
import { useTableActionsProps } from '../DlTable/hooks/tableActions'
import { commonVirtScrollProps } from '../../shared/DlVirtualScroll/useVirtualScroll'
import {
    useTableRowExpandEmits,
    useTableRowExpandProps
} from '../DlTable/hooks/tableRowExpand'
import { useTablePaginationProps } from '../DlTable/hooks/tablePagination'
import { useTableFilterProps } from '../DlTable/hooks/tableFilter'
import { useTableSortProps } from '../DlTable/hooks/tableSort'
import { useTableColumnSelectionProps } from '../DlTable/hooks/tableColumnSelection'
import { useTableRowSelectionProps } from '../DlTable/hooks/tableRowSelection'
import {
    useTreeTableRowSelection,
    useTreeTableRowSelectionEmits
} from './utils/treeTableRowSelection'
import { RecordStringAny } from './types'
import { flatTreeData } from './utils/flatTreeData'
import { getFromChildren } from './utils/getFromChildren'
import DlCheckbox from '../../essential/DlCheckbox/DlCheckbox.vue'

export default defineComponent({
    name: 'DlTreeTable',
    components: {
        DlTable,
        DlTrTreeView,
        DlCheckbox
    },
    props: {
        columns: { type: Array, default: () => [] as Record<string, any>[] },
        rows: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },
        rowKey: {
            type: [String, Function],
            default: 'id'
        },
        bordered: Boolean,
        separator: {
            type: String,
            default: 'horizontal',
            validator: (v: string) =>
                ['horizontal', 'vertical', 'cell', 'none'].includes(v)
        },
        draggable: {
            type: String,
            default: 'none',
            validator: (v: string) =>
                ['rows', 'columns', 'none', 'both'].includes(v)
        },
        title: { type: String, default: null },
        color: {
            type: String,
            default: 'dl-color-darker'
        },
        loading: {
            type: Boolean,
            default: false
        },
        dense: {
            type: Boolean,
            default: false
        },
        resizable: {
            type: Boolean,
            default: false
        },
        hideNoData: {
            type: Boolean,
            default: false
        },
        hideHeader: {
            type: Boolean,
            default: false
        },
        hideBottom: {
            type: Boolean,
            default: false
        },
        virtualScroll: {
            type: Boolean,
            default: false
        },
        hidePagination: {
            type: Boolean,
            default: false
        },
        hideSelectedBanner: {
            type: Boolean,
            default: false
        },
        selectedRowsLabel: {
            type: Function,
            default: (val: number) => `${val} records selected`
        },
        loadingLabel: {
            type: String,
            default: 'Loading...'
        },
        noResultsLabel: {
            type: String,
            default: 'There are no results to display'
        },
        noDataLabel: {
            type: String,
            default: 'No data available'
        },
        virtualScrollTarget: {
            type: Object as PropType<HTMLElement>,
            default: null
        },
        titleClass: {
            type: [String, Array, Object],
            default: null
        },
        tableStyle: {
            type: [String, Array, Object],
            default: null
        },
        tableClass: {
            type: [String, Array, Object],
            default: null
        },
        tableHeaderStyle: {
            type: [String, Array, Object],
            default: null
        },
        tableHeaderClass: {
            type: [String, Array, Object],
            default: null
        },
        noHover: Boolean,
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        },
        scrollDebounce: {
            type: Number,
            default: 100
        },
        ...useTableActionsProps,
        ...commonVirtScrollProps,
        ...useTableRowExpandProps,
        ...useTablePaginationProps,
        ...useTableFilterProps,
        ...useTableSortProps,
        ...useTableColumnSelectionProps,
        ...useTableRowSelectionProps
    },
    emits: [
        'request',
        'virtual-scroll',
        'row-reorder',
        'col-reorder',
        'row-click',
        'th-click',
        'row-dblclick',
        'row-contextmenu',
        ...useTableRowExpandEmits,
        ...useTreeTableRowSelectionEmits
    ],
    setup(props, { emit }) {
        const dlTableRef = ref(null)
        const selected = ref([])
        const vScroll = ref(false)
        const borderState = ref([])
        const denseState = ref([])
        const resizableState = ref([])
        const tableRows = ref(cloneDeep(props.rows))
        const tableColumns = ref(props.columns)
        const hasFlatTreeData = true

        const computedRows = computed(() => dlTableRef.value.computedRows)

        const getRowKey = computed(() =>
            typeof props.rowKey === 'function'
                ? props.rowKey
                : (row: RecordStringAny) => row[props.rowKey as string]
        )

        const {
            hasSelectionMode,
            singleSelection,
            multipleSelection,
            allRowsSelected,
            someRowsSelected,
            rowsSelectedNumber,

            isRowSelected,
            clearSelection,
            updateSelection
        } = useTreeTableRowSelection(
            props as unknown as DlTableProps,
            emit,
            computedRows,
            getRowKey as ComputedRef<(val: string | DlTableRow) => any>
        )

        const updateExpandedRow = (
            isExpanded: boolean,
            name: string,
            rowsArr = tableRows.value
        ) => {
            (rowsArr as DlTableRow[]).some((o) => {
                if (o.name === name) {
                    if (isVue2) {
                        set(o, 'expanded', isExpanded)
                    } else {
                        o.expanded = isExpanded
                    }
                    // o.expanded = isExpanded
                    updateNestedRows(o, isExpanded)
                } else {
                    if ((o.children || []).length > 0) {
                        updateExpandedRow(isExpanded, name, o.children)
                    }
                }
            })
        }

        const updateNestedRows = (
            row: (typeof computedRows.value)[number],
            isExpanded: boolean
        ) => {
            if ((row.children || []).length > 0) {
                row.children.forEach(
                    (r: (typeof computedRows.value)[number]) => {
                        // r.isExpandedParent = isExpanded

                        if (isVue2) {
                            set(r, 'isExpandedParent', isExpanded)
                        } else {
                            r.isExpandedParent = isExpanded
                        }

                        if (!isExpanded) {
                            if (isVue2) {
                                set(r, 'isExpandedParent', isExpanded)
                            } else {
                                r.isExpandedParent = isExpanded
                            }

                            // r.expanded = isExpanded
                            updateNestedRows(r, isExpanded)
                        }
                    }
                )
            }
        }
        const updateSelectionHierarchy = (
            adding: boolean,
            event: any,
            row: any
        ) => {
            const { childrenKeys, childrenCollection } = getFromChildren(
                row,
                props.rowKey
            )

            updateSelection(childrenKeys, childrenCollection, adding, event)
        }

        const headerSelectedValue = computed(() =>
            someRowsSelected.value === true ? null : allRowsSelected.value
        )

        const onMultipleSelectionSet = (val: boolean) => {
            if (someRowsSelected.value === true) {
                val = false
            }

            updateSelection(
                computedRows.value.map(getRowKey.value as any),
                computedRows.value,
                val
            )
        }
        const updateSelected = (payload: any) => {
            selected.value = payload
            emitSelectedItems(payload)
        }
        const emitSelectedItems = (payload: any) => {
            emit('selectedItems', payload)
        }
        const emitRowClick = (payload: any) => {
            emit('row-click', payload)
        }
        const emitThClick = (payload: any) => {
            emit('th-click', payload)
        }

        return {
            dlTableRef,
            isRowSelected,
            hasFlatTreeData,
            vScroll,
            headerSelectedValue,
            selected,
            denseState,
            borderState,
            resizableState,
            tableRows,
            tableColumns,
            computedRows,
            getRowKey,
            updateSelection,
            updateExpandedRow,
            updateSelectionHierarchy,
            onMultipleSelectionSet,
            updateSelected,
            emitSelectedItems,
            emitRowClick,
            emitThClick
        }
    }
})
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    width: 100%;
    max-width: 600px;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    & > * {
        flex-grow: 1;
    }
}

.sticky-header {
    ::v-deep .dl-table__top,
    ::v-deep .dl-table__bottom,
    ::v-deep thead tr:first-child th {
        /* bg color is important for th; just specify one */
        background-color: var(--dl-color-panel-background);
    }
    ::v-deep thead tr th {
        position: sticky !important;
        z-index: 1;
    }
    ::v-deep thead tr:first-child th {
        top: 0;
    }
    /* this is when the loading indicator appears */
    &.dl-table--loading thead tr:last-child th {
        /* height of all previous header rows */
        top: 40px;
    }
}
</style>
