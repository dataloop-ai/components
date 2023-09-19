<script lang="ts">
import {
    Vue,
    computed,
    ComputedRef,
    defineComponent,
    isVue2,
    set,
    ref,
    h,
    VNode,
    toRefs,
    getCurrentInstance
} from 'vue-demi'
import { DlCheckbox } from '../../essential'
import DlTable from '../DlTable/DlTable.vue'
import DlTrTreeView from './views/DlTrTreeView.vue'
import { cloneDeep } from 'lodash'
import { DlTableColumn, DlTableProps, DlTableRow } from '../DlTable/types'
import { useTreeTableRowSelection } from './utils/treeTableRowSelection'
import { getFromChildren } from './utils/getFromChildren'
import { props } from './props'
import { emits } from './emits'
import Sortable from '../DlSortable/Sortable.vue'
import TableSortable from '../DlSortable/TableSortable.vue'
import { renderComponent } from '../../../utils/render-fn'
import { isEmpty } from 'lodash'
import SortableJs from 'sortablejs'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlTreeTable',
    components: {
        DlTable,
        DlTrTreeView,
        DlCheckbox,
        Sortable,
        TableSortable
    },
    props,
    emits,
    setup(props, { emit, slots }) {
        const dlTableRef = ref(null)
        const selectedData = ref([])
        const borderState = ref([])
        const denseState = ref([])
        const resizableState = ref([])
        // const tableRows = ref(props.rows)
        // const tableColumns = ref(props.columns)
        const hasFlatTreeData = true

        const uuid = `dl-tree-table-${v4()}`

        const mainTbodyUuid = `dl-tree-table-tbody-${v4()}`

        const vm = getCurrentInstance()

        const { rows: tableRows, columns: tableColumns } = toRefs(props)

        const hasEmptyStateProps = computed(() =>
            props.emptyStateProps
                ? Object.keys(props.emptyStateProps).length > 0
                : false
        )

        const computedRows = computed(() => {
            if (props.draggable) {
                return dlTableRef.value?.rootRef?.computedRows || []
            }
            return dlTableRef.value?.computedRows || []
        })

        const tableRootRef = computed(() => {
            if (props.draggable) {
                return dlTableRef.value || {}
            }
            return dlTableRef.value || {}
        })

        const getRowKey = computed(() =>
            typeof props.rowKey === 'function'
                ? props.rowKey
                : (row: Record<string, any>) => row[props.rowKey as string]
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
            tableRows,
            getRowKey as ComputedRef<(val: string | DlTableRow) => any>
        )

        const updateExpandedRow = (
            isExpanded: boolean,
            name: string,
            rowsArr: DlTableRow[] = tableRows.value
        ) => {
            rowsArr.some((o) => {
                if (getRowKey.value(o) === name) {
                    if (isVue2) {
                        set(o, 'isExpanded', isExpanded)
                    } else {
                        o.isExpanded = isExpanded
                    }
                    updateNestedRows(o, isExpanded)
                } else {
                    if ((o.children || []).length > 0) {
                        updateExpandedRow(isExpanded, name, o.children)
                    }
                }
            })
        }

        const updateNestedRows = (
            row: (typeof tableRows.value)[number],
            isExpanded: boolean
        ) => {
            if ((row.children || []).length > 0) {
                const isParentExpanded = row.isExpanded
                row.children.forEach((r: (typeof tableRows.value)[number]) => {
                    if (!isParentExpanded) {
                        if (isVue2) {
                            set(r, 'isExpanded', isParentExpanded)
                        } else {
                            r.isExpanded = isParentExpanded
                        }

                        // r.expanded = isExpanded
                        updateNestedRows(r, isExpanded)
                    }
                })
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

        // const headerSelectedValue = computed(() => {
        //     return someRowsSelected.value === true
        //         ? null
        //         : allRowsSelected.value
        // })

        const headerSelectedValue = computed(() => {
            if (selectedData.value.length === tableRows.value.length)
                return true

            if (
                selectedData.value.length > 0 &&
                selectedData.value.length !== tableRows.value.length
            )
                return null

            return false
        })

        const onMultipleSelectionSet = (val: boolean) => {
            const value =
                selectedData.value.length > 0 &&
                selectedData.value.length === tableRows.value.length
                    ? false
                    : val

            updateSelected(value ? tableRows.value : [])
        }
        const updateSelected = (payload: any) => {
            selectedData.value = payload
            emitSelectedItems(payload)
        }
        const emitSelectedItems = (payload: any) => {
            emit('selected-items', payload)
        }
        const emitRowClick = (payload: any) => {
            emit('row-click', payload)
        }
        const emitThClick = (payload: any) => {
            emit('th-click', payload)
        }

        const hasSlotByName = (name: string) => !!slots[name]

        const getSlotByName = (name: string) => {
            if (hasSlotByName(`body-cell-${name}`)) {
                return `body-cell-${name}`
            }
        }

        const log = console.log

        // const rednerTBodySlots = () => {
        //     return renderComponent('')
        // }

        const tbodySlotsData = computed(() =>
            (dlTableRef.value?.computedCols || []).filter(
                (item: DlTableColumn) => hasSlotByName(`body-cell-${item.name}`)
            )
        )

        const getTBodyCell = (
            name: string,
            row: DlTableRow,
            col: DlTableColumn,
            index: number
        ) => {
            return slots[name](
                dlTableRef.value.getBodySelectionScope({
                    key: getRowKey.value(row),
                    row,
                    col,
                    pageIndex: index
                })
            )
        }

        const renderDlTrTree = (
            row: DlTableRow,
            index: number,
            children: DlTableRow[] = [],
            level: number = 1
        ) =>
            renderComponent(
                DlTrTreeView,
                {
                    row,
                    rowIndex: index,
                    rowKey: props.rowKey,
                    isRowSelected: isRowSelected(
                        props.rowKey,
                        getRowKey.value(row)
                    )
                        ? 'selected'
                        : '',
                    level,
                    class: 'nested-element',
                    'data-level': level,
                    'data-row': JSON.stringify(row),
                    hasAnyAction: tableRootRef.value.hasAnyAction,
                    noHover: tableRootRef.value.noHover,
                    hasDraggableRows: tableRootRef.value.hasDraggableRows,
                    hasSelectionMode: tableRootRef.value.hasSelectionMode,
                    bindBodySelection: tableRootRef.value.getBodySelectionScope(
                        {
                            key: getRowKey.value(row),
                            row,
                            pageIndex: index
                        }
                    ),
                    bindBodyCellScope: (col: DlTableColumn) =>
                        tableRootRef.value.getBodyCellScope({
                            key: getRowKey.value(row),
                            row,
                            pageIndex: index,
                            col
                        }),

                    key: getRowKey.value(row),
                    color: props.color,
                    computedCols: tableRootRef.value.computedCols,
                    modelValue: isRowSelected(
                        props.rowKey,
                        getRowKey.value(row)
                    ),
                    'onUpdate:modelValue': (adding: boolean, evt: Event) =>
                        updateSelectionHierarchy(adding, evt, row),
                    onRowClick: tableRootRef.value.onTrClick(event, row, index),
                    onRowDoubleClick: tableRootRef.value.onTrDblClick(
                        event,
                        row,
                        index
                    ),
                    onTrContextMenu: tableRootRef.value.onTrContextMenu(
                        event,
                        row,
                        index
                    ),
                    onUpdateExpandedRow: () =>
                        updateExpandedRow(!row.isExpanded, getRowKey.value(row))
                },
                () => children
            )

        const renderTr = (
            row: DlTableRow,
            index: number,
            level: number = 1
        ) => {
            const children = []

            children.push(renderDlTrTree(row, index, [], level))

            const tbodyEls: VNode[] = []

            if ((row.children || []).length > 0) {
                //TODO CHECK INDEX var
                level = level + 1

                row.children.forEach((childRow: DlTableRow, i: number) => {
                    tbodyEls.push(
                        renderComponent(
                            'tbody',
                            {
                                key: getRowKey.value(childRow),
                                'data-level': level,
                                class: 'nested-tbody'
                            },
                            renderTr(childRow, i, level)
                        )
                    )
                })

                const tdEl = renderComponent(
                    'td',
                    {
                        colspan: tableRootRef.value.computedColspan,
                        style: 'padding: 0'
                    },
                    renderComponent(
                        TableSortable,
                        {
                            list: [],
                            itemKey: getRowKey.value,
                            tag: 'table',
                            class: 'nested-table',
                            options: {
                                group: 'nested',
                                animation: 150,
                                fallbackOnBody: true,
                                invertSwap: true,
                                swapThreshold: 0.5
                            }
                        },
                        () => tbodyEls
                    )
                )

                const childrenTrWrapper = renderComponent(
                    'tr',
                    {
                        class:
                            (row.isExpanded ? '' : 'display-none') +
                            ' dl-tr--no-hover' +
                            ' nested-element'
                    },
                    tdEl
                )

                children.push(childrenTrWrapper)
            }

            return children
        }
        const nestedQuery = '.nested-sortable'
        const identifier = 'sortableId'

        function serialize(sortable) {
            const serialized = []

            const children = [].slice.call(sortable.children)

            for (const i in children) {
                const nested = children[i].querySelector('')

                console.log(nested)
                if (nested) {
                    console.log(JSON.parse(nested.dataset.row))
                }
                // serialized.push({
                //     id: children[i].dataset[identifier],
                //     children: nested ? serialize(nested) : []
                // })
            }
            return serialized
        }

        function serializeFn(sortable) {
            const serialized = []

            const children = [].slice.call(sortable.children)

            for (const i in children) {
                const el = {}
                const nested = children[i].querySelector('.nested-element')

                console.log(nested)
                if (nested) {
                    console.log(JSON.parse(nested.dataset.row))
                }

                // if(nested) {
                //     Object.assign(el, nested.)
                // }

                serialized.push({
                    id: children[i].dataset[identifier],
                    children: nested ? serialize(nested) : []
                })
            }
            return serialized
        }

        // function serializeNode(node) {
        //     const serializedNode = {
        //         tagName: node.tagName,
        //         attributes: {},
        //         children: []
        //     }

        //     // Serialize attributes
        //     for (const attr of node.attributes) {
        //         serializedNode.attributes[attr.name] = attr.value
        //     }

        //     // Serialize child nodes
        //     for (const childNode of node.childNodes) {
        //         if (childNode.nodeType === Node.ELEMENT_NODE) {
        //             serializedNode.children.push(serializeNode(childNode))
        //         }
        //     }

        //     return serializedNode
        // }

        const swapArrayLocs = (arr, oldIndex, newIndex) => {
            [arr[oldIndex], arr[newIndex]] = [arr[newIndex], arr[oldIndex]]

            // arr.splice(newIndex, 0, arr[oldIndex])

            const root = document.getElementById(mainTbodyUuid)

            console.log(serializeFn(root))

            emit('row-reorder', arr)
        }

        const handleEndEvent = (event: SortableJs.SortableEvent) => {
            console.log(event)
            swapArrayLocs(
                cloneDeep(tableRows.value),
                event.oldIndex,
                event.newIndex
            )
        }

        const renderTBody = () => {
            // console.log(tableRootRef.value)
            if (isEmpty(tableRootRef.value)) return null

            const children = tableRows.value.map((row, i) => {
                return renderComponent(
                    'tbody',
                    {
                        'data-level': 1,
                        key: getRowKey.value(row) + i,
                        class: 'nested-tbody'
                    },
                    renderTr(row, i)
                )
            })

            const tableBody = renderComponent(
                'tbody',
                {},
                renderComponent(
                    'tr',
                    {
                        class: 'dl-tr--no-hover'
                    },
                    renderComponent(
                        'td',
                        { colspan: tableRootRef.value.computedColspan },
                        renderComponent(
                            TableSortable,
                            {
                                list: [],
                                itemKey: getRowKey.value,
                                tag: 'table',
                                id: mainTbodyUuid,
                                onEnd: handleEndEvent,
                                class: 'nested-table',
                                options: {
                                    group: 'nested',
                                    animation: 150,
                                    fallbackOnBody: true,
                                    invertSwap: true,
                                    swapThreshold: 0.5
                                }
                            },
                            () => children
                        )
                    )
                )
            )

            return tableBody
        }

        return {
            log,
            dlTableRef,
            isRowSelected,
            hasFlatTreeData,
            headerSelectedValue,
            selectedData,
            denseState,
            borderState,
            resizableState,
            tableRows,
            tableColumns,
            computedRows,
            getRowKey,
            updateSelection,
            hasEmptyStateProps,
            updateExpandedRow,
            updateSelectionHierarchy,
            onMultipleSelectionSet,
            updateSelected,
            emitSelectedItems,
            emitRowClick,
            emitThClick,
            hasSlotByName,
            getSlotByName,
            renderTBody,
            tableRootRef,
            uuid,
            mainTbodyUuid
        }
    },
    render() {
        return renderComponent(
            // this.$props.draggable ? TableSortable : DlTable,
            DlTable,
            {
                ref: 'dlTableRef',
                id: this.uuid,
                selected: this.selectedData,
                separator: this.separator,
                columns: this.tableColumns,
                bordered: this.bordered,
                draggable: this.draggable,
                dense: this.dense,
                filter: this.filter,
                isTreeTable: true,
                selection: this.selection,
                loading: this.loading,
                rows: this.tableRows,
                resizable: this.resizable,
                rowKey: this.rowKey,
                color: this.color,
                title: this.title,
                virtualScroll: this.virtualScroll,
                rowsPerPageOptions: this.rowsPerPageOptions,
                hidePagination: this.hidePagination,
                isEmpty: this.isEmpty,
                emptyStateProps: this.emptyStateProps,
                noDataLabel: this.noDataLabel,
                onRowClick: this.emitRowClick,
                'onUpdate:selected': this.updateSelected
            },
            {
                'header-selection': () =>
                    renderComponent(
                        DlCheckbox,
                        {
                            color: this.color,
                            modelValue: this.headerSelectedValue,
                            indeterminateValue: true,
                            'onUpdate:modelValue': this.onMultipleSelectionSet
                        },
                        (): [] => []
                    ),
                tbody: this.renderTBody
            }
        )
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

table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
}

tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}

td {
    padding: 0 !important;
}

tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
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
