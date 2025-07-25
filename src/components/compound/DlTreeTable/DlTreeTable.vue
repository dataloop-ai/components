<script lang="ts">
import {
    computed,
    ComputedRef,
    defineComponent,
    isVue2,
    set,
    ref,
    VNode,
    watch,
    PropType,
    toRefs
} from 'vue-demi'
import { DlCheckbox } from '../../essential'
import { DlEmptyState } from '../../basic'
import DlTable from '../DlTable/DlTable.vue'
import DlTrTreeView from './views/DlTrTreeView.vue'
import { DlTableColumn, DlTableProps, DlTableRow } from '../DlTable/types'

import { useTreeTableRowSelection } from './utils/treeTableRowSelection'
import { useNestedTableFilter } from './hooks/nestedTableFilter'
import { getFromChildren } from './utils/getFromChildren'
import { emits } from './emits'
import Sortable from '../DlTable/components/SortableJS.vue'
import { renderComponent } from '../../../utils/render-fn'
import { isEmpty } from 'lodash'
import SortableJs from 'sortablejs'
import { v4 } from 'uuid'
import { moveNestedRow } from './utils/moveNestedRow'
import { getElementAbove } from '../../../utils'
import { SortingMovement } from '../DlTable/types'
import { getContainerClass } from '../DlTable/utils/tableClasses'
import { DlEmptyStateProps } from '../../types'
import { useTableActionsProps } from '../DlTable/hooks/tableActions'
import { commonVirtScrollProps } from '../../shared/DlVirtualScroll/useVirtualScroll'
import { useTableRowExpandProps } from '../DlTable/hooks/tableRowExpand'
import { useTablePaginationProps } from '../DlTable/hooks/tablePagination'
import { useTableFilterProps } from '../DlTable/hooks/tableFilter'
import { useTableSortProps } from '../DlTable/hooks/tableSort'
import { useTableColumnSelectionProps } from '../DlTable/hooks/tableColumnSelection'
import { useTableRowSelectionProps } from '../DlTable/hooks/tableRowSelection'
import { RowExpandEventData } from './types'

let prevMouseY = 0

export default defineComponent({
    name: 'DlTreeTable',
    components: {
        DlTable,
        DlTrTreeView,
        DlCheckbox,
        Sortable,
        DlEmptyState
    },
    props: {
        /**
         * Array of DlTableColumn objects
         */
        columns: { type: Array, default: () => [] as Record<string, any>[] },
        /**
         * Array of DlTableRow objects
         */
        rows: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },
        /**
         * Specify which key will identify each row
         */
        rowKey: {
            type: [String, Function],
            default: 'id'
        },
        /**
         * Surrounded by a border
         */
        bordered: Boolean,
        /**
         * Borders inside the table: horizontal, vertical, cell or none
         */
        separator: {
            type: String,
            default: 'horizontal',
            validator: (v: string) =>
                ['horizontal', 'vertical', 'cell', 'none'].includes(v)
        },
        /**
         * Type of the draggable functionality: rows, columns or both
         */
        draggable: {
            type: String,
            default: 'none',
            validator: (v: string) =>
                ['rows', 'columns', 'none', 'both'].includes(v)
        },
        /**
         * Title to be displayed next to the table
         */
        title: { type: String, default: '' },
        /**
         * Text color
         */
        color: {
            type: String,
            default: 'dl-color-darker'
        },
        /**
         * Show a loading animation on the table
         */
        loading: {
            type: Boolean,
            default: false
        },
        /**
         *  Cells shrinks in size
         */
        dense: {
            type: Boolean,
            default: false
        },
        /**
         * Resizable columns
         */
        resizable: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the "No data" message
         */
        hideNoData: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the header
         */
        hideHeader: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the footer
         */
        hideBottom: {
            type: Boolean,
            default: false
        },
        /**
         * Enable virtual scroll
         */
        virtualScroll: {
            type: Boolean,
            default: false
        },
        /**
         * Hide table pagination
         */
        hidePagination: {
            type: Boolean,
            default: false
        },
        /**
         * Hide selected banner
         */
        hideSelectedBanner: {
            type: Boolean,
            default: false
        },
        /**
         * identifier As Tooltip form row object
         */
        identifierAsTooltip: {
            type: Boolean,
            default: false
        },
        /**
         * Function to generate the label visible when selecting rows
         */
        selectedRowsLabel: {
            type: Function,
            default: (val: number) => `${val} records selected`
        },
        /**
         * Label visible when loading is active
         */
        loadingLabel: {
            type: String,
            default: 'Loading...'
        },
        /**
         * Label visible when there are no results
         */
        noResultsLabel: {
            type: String,
            default: 'There are no results to display'
        },
        /**
         * Label visible when data is empty
         */
        noDataLabel: {
            type: String,
            default: 'No data available'
        },
        /**
         * Virtual scroll target
         */
        virtualScrollTarget: {
            type: Object as PropType<HTMLElement>,
            default: null as unknown as PropType<HTMLElement>
        },
        /**
         *  CSS class for the title
         */
        titleClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * Styles to be applied to the table container
         */
        tableStyle: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * Will add another column with a button opening a menu which lets the user choose the visible columns
         */
        visibleColumns: {
            type: Array as PropType<DlTableColumn[]>,
            default: (): [] => []
        },
        /**
         * CSS class for the table container
         */
        tableClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * Styles to be applies to the table header
         */
        tableHeaderStyle: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * CSS class for the table header
         */
        tableHeaderClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        menuClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        noHover: Boolean,
        /**
         * Indicates the data is empty
         */
        isEmpty: Boolean,
        /**
         * Props for the empty state component
         */
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () =>
                ({
                    title: '',
                    subtitle: 'No data to show yet',
                    icon: 'icon-dl-dataset-filled'
                } as unknown as PropType<DlEmptyStateProps>)
        },
        /**
         * Custom icon class to use for expanded rows.
         */
        customIconExpandedRow: {
            type: String,
            default: 'icon-dl-down-chevron'
        },
        /**
         * Custom icon class to use for compressed (collapsed) rows.
         */
        customIconCompressedRow: {
            type: String,
            default: 'icon-dl-right-chevron'
        },
        /**
         * color of the chevron icon
         */
        chevronIconColor: {
            type: String,
            default: ''
        },
        /**
         * identifier (rowKey) to highlight a row.
         */
        highlightedRow: {
            type: String,
            default: ''
        },
        /**
         * Scrolling delay
         */
        scrollDebounce: {
            type: Number,
            default: 100
        },
        /**
         * Disable child checkbox when parent is selected
         */
        disableChildCheckbox: {
            type: Boolean,
            default: false
        },
        /**
         * Tooltip text for disabled child checkbox
         */
        childDisabledCheckboxTooltip: {
            type: String,
            default: 'Cannot unselect child when parent is selected'
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
    emits,
    setup(props, { emit, slots }) {
        const dlTableRef = ref(null)
        const selectedData = ref([])
        const borderState = ref([])
        const denseState = ref([])
        const resizableState = ref([])
        const hasFlatTreeData = true
        const draggedRow = ref<DlTableRow | null>(null)
        const targetRow = ref<DlTableRow | null>(null)

        const vue2h = ref()

        const sortingMovement = ref<SortingMovement>({
            lastId: null,
            direction: 'up'
        })

        const uuid = `dl-tree-table-${v4()}`

        const mainTbodyUuid = `dl-tree-table-tbody-${v4()}`

        const mainTableKey = ref(v4())

        const { rows: tableRows, columns: tableColumns } = toRefs(props)

        const isDataEmpty = computed(() => !props.rows.length)

        const hasEmptyStateProps = computed(() =>
            props.emptyStateProps
                ? Object.keys(props.emptyStateProps).length > 0
                : false
        )

        const computedRows = computed(() => {
            return dlTableRef.value?.computedRows || []
        })

        const tableRootRef = computed(() => {
            return dlTableRef.value || {}
        })

        const getRowKey = computed(() =>
            typeof props.rowKey === 'function'
                ? props.rowKey
                : (row: Record<string, any>) =>
                      row[props.rowKey as string] ?? ''
        )

        const hasDraggableRows = computed(() =>
            ['rows', 'both'].includes(props.draggable)
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
            tableRows as ComputedRef<DlTableRow[]>,
            getRowKey as ComputedRef<(val: string | DlTableRow) => any>
        )

        const { filteredRows } = useNestedTableFilter(
            tableRows.value,
            (row) => {
                let filter = props.filter ?? ''
                if (typeof filter === 'string') {
                    filter = filter.toLowerCase()
                }

                // todo: row is not always defined. which will cause the filter not to work.
                return row.name?.toLowerCase?.().includes(filter)
            }
        )

        const computedFilter = computed<DlTableRow[]>(() =>
            props.filter && filteredRows.value.length
                ? filteredRows.value
                : tableRows.value
        )

        const updateExpandedRow = (
            isExpanded: boolean,
            name: string,
            rowsArr: DlTableRow[] = tableRows.value
        ) => {
            for (const row of rowsArr) {
                if (getRowKey.value(row) === name) {
                    if (isVue2) {
                        set(row, 'isExpanded', isExpanded)
                    } else {
                        row.isExpanded = isExpanded
                    }
                    updateNestedRows(row, isExpanded)

                    const eventData: RowExpandEventData = {
                        row,
                        rowKey: getRowKey.value(row),
                        isExpanded,
                        level: row.level || 1,
                        hasChildren: (row.children || []).length > 0
                    }

                    if (isExpanded) {
                        emit('row-expand', eventData)
                    } else {
                        emit('row-collapse', eventData)
                    }

                    break
                } else {
                    if ((row.children || []).length > 0) {
                        updateExpandedRow(isExpanded, name, row.children)
                    }
                }
            }
        }
        const updateNestedRows = (
            row: (typeof computedRows.value)[number],
            isExpanded: boolean
        ) => {
            if (!row.children) {
                return
            }

            for (const r of row.children) {
                if (isVue2) {
                    set(r, 'isExpanded', isExpanded)
                } else {
                    r.isExpanded = isExpanded
                }

                if (!isExpanded) {
                    if (isVue2) {
                        set(r, 'isExpanded', isExpanded)
                    } else {
                        r.isExpanded = isExpanded
                    }
                    updateNestedRows(r, isExpanded)
                }
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
        const emitRowClick = (...payload: any) => {
            emit('row-click', ...payload)
        }
        const emitRowDblclick = (...payload: any) => {
            emit('row-dblclic', ...payload)
        }
        const emitThClick = (payload: any) => {
            emit('th-click', payload)
        }

        const emitRowExpand = (eventData: RowExpandEventData) => {
            emit('row-expand', eventData)
        }

        const emitRowCollapse = (eventData: RowExpandEventData) => {
            emit('row-collapse', eventData)
        }

        const hasSlotByName = (name: string) => !!slots[name]

        const getSlotByName = (name: string) => {
            if (hasSlotByName(`body-cell-${name}`)) {
                return `body-cell-${name}`
            }
        }

        const tbodySlotsData = computed(() =>
            (dlTableRef.value?.computedCols || []).filter(
                (item: DlTableColumn) => hasSlotByName(`body-cell-${item.name}`)
            )
        )

        const containerClass = computed(() => {
            const { separator, bordered, dense, loading } = props
            return getContainerClass(separator, bordered, dense, loading)
        })

        const computedCellSlots = computed(() => {
            const obj: any = {}
            tbodySlotsData.value.forEach((item: DlTableColumn) => {
                const slot = slots[`body-cell-${item.name}`]
                obj[`body-cell-${item.name}`] = slot
            })
            return obj
        })

        const renderDlTrTree = (
            row: DlTableRow,
            index: number,
            children: DlTableRow[] = [],
            level: number = 1,
            parentSelected: boolean = false
        ) => {
            const currentSlots = {
                default: () => children,
                ...computedCellSlots.value
            }

            return renderComponent(vue2h.value, DlTrTreeView, {
                row,
                rowIndex: index,
                rowKey: props.rowKey,
                isRowSelected: isRowSelected(props.rowKey, getRowKey.value(row))
                    ? 'selected'
                    : '',
                isRowHighlighted:
                    props.highlightedRow &&
                    (typeof props.rowKey === 'string'
                        ? row[props.rowKey] === props.highlightedRow
                        : false),
                level,
                class: 'nested-element dl-tr',
                'data-level': level,
                'data-id': row.id,
                hasAnyAction: tableRootRef.value.hasAnyAction,
                noHover: tableRootRef.value.noHover,
                hasDraggableRows: hasDraggableRows.value,
                hasSelectionMode: tableRootRef.value.hasSelectionMode,
                bindBodySelection: tableRootRef.value.getBodySelectionScope({
                    key: getRowKey.value(row),
                    row,
                    pageIndex: index
                }),
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
                modelValue: isRowSelected(props.rowKey, getRowKey.value(row)),
                scopedSlots: currentSlots,
                tooltip: props.identifierAsTooltip ? row.identifier : null,
                customIconExpandedRow: props.customIconExpandedRow,
                customIconCompressedRow: props.customIconCompressedRow,
                chevronIconColor: props.chevronIconColor,
                disableChildCheckbox: props.disableChildCheckbox,
                childDisabledCheckboxTooltip:
                    props.childDisabledCheckboxTooltip,
                parentSelected,
                'onUpdate:modelValue': (adding: boolean, evt: Event) => {
                    updateSelectionHierarchy(adding, evt, row)
                },
                onRowClick: (event: Event, row: any, index: number) => {
                    tableRootRef.value.onTrClick(event, row, index)
                },
                onRowDoubleClick: (event: Event, row: any, index: number) => {
                    tableRootRef.value.onTrDblClick(event, row, index)
                },
                onRowContextMenu: (event: Event, row: any, index: number) => {
                    tableRootRef.value.onTrContextMenu(event, row, index)
                },
                onUpdateExpandedRow: () =>
                    updateExpandedRow(!row.isExpanded, getRowKey.value(row)),
                on: {
                    'update:model-value': (adding: boolean, evt: Event) => {
                        updateSelectionHierarchy(adding, evt, row)
                    },
                    rowClick: (event: Event, row: any, index: number) => {
                        tableRootRef.value.onTrClick(event, row, index)
                    },
                    rowDoubleClick: (event: Event, row: any, index: number) => {
                        tableRootRef.value.onTrDblClick(event, row, index)
                    },
                    rowContextMenu: (event: Event, row: any, index: number) => {
                        tableRootRef.value.onTrContextMenu(event, row, index)
                    },
                    updateExpandedRow: () =>
                        updateExpandedRow(
                            !row.isExpanded,
                            getRowKey.value(row)
                        ),
                    rowHoverStart: (...args: any) =>
                        emit('row-hover-start', ...args),
                    rowHoverEnd: (...args: any) =>
                        emit('row-hover-end', ...args)
                }
            })
        }

        const renderTr = (
            row: DlTableRow,
            index: number,
            level: number = 1,
            parentSelected: boolean = false
        ) => {
            const children = []
            const isCurrentRowSelected =
                isRowSelected(props.rowKey, getRowKey.value(row)) === true

            children.push(renderDlTrTree(row, index, [], level, parentSelected))

            const tbodyEls: VNode[] = []

            if ((row.children || []).length > 0) {
                //TODO CHECK INDEX var
                level++

                row.children.forEach((childRow: DlTableRow, i: number) => {
                    tbodyEls.push(
                        renderComponent(
                            vue2h.value,
                            'tbody',
                            {
                                key: getRowKey.value(childRow),
                                'data-level': level,
                                class: 'nested-tbody'
                            },
                            renderTr(childRow, i, level, isCurrentRowSelected)
                        ) as VNode
                    )
                })

                const tdEl = renderComponent(
                    vue2h.value,
                    'td',
                    {
                        colspan: tableRootRef.value.computedColspan,
                        style: 'padding: 0'
                    },
                    renderComponent(
                        vue2h.value,
                        Sortable,
                        {
                            list: [],
                            itemKey: getRowKey.value,
                            tag: 'table',
                            class: 'nested-table',
                            isSortable: hasDraggableRows.value,
                            onEnd: handleEndEvent,
                            onChange: handleChangeEvent,
                            onStart: handleStartEvent,
                            on: {
                                end: handleEndEvent,
                                change: handleChangeEvent,
                                start: handleStartEvent
                            },
                            options: {
                                group: 'nested',
                                animation: 150,
                                fallbackOnBody: true,
                                invertSwap: true,
                                swapThreshold: 0.5
                            }
                        },
                        isVue2 ? tbodyEls : () => tbodyEls
                    )
                )

                const childrenTrWrapper = renderComponent(
                    vue2h.value,
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

        const handleEndEvent = (event: SortableJs.SortableEvent) => {
            emit('row-drag-end', {
                draggedRow: draggedRow.value,
                targetRow: targetRow.value
            })
            emit(
                'row-reorder',
                moveNestedRow(tableRows.value, event, sortingMovement.value)
            )
            draggedRow.value = null
            targetRow.value = null
            mainTableKey.value = v4()
        }

        const handleChangeEvent = (event: any) => {
            const originalEvent = event.originalEvent
            const passedElement = getElementAbove(
                originalEvent.srcElement,
                'dl-tr'
            ) as HTMLElement
            if (passedElement) {
                const targetRowId = passedElement.dataset.id
                targetRow.value =
                    tableRows.value.find(
                        (row) => getRowKey.value(row) === targetRowId
                    ) || null
                emit('row-drag-over', {
                    draggedRow: draggedRow.value,
                    targetRow: targetRow.value
                })
            }
            const currentY = originalEvent.clientY
            if (currentY > prevMouseY) {
                sortingMovement.value.direction = 'down'
            } else if (currentY < prevMouseY) {
                sortingMovement.value.direction = 'up'
            }
            prevMouseY = currentY
            sortingMovement.value.lastId = passedElement.dataset.id
        }

        const handleStartEvent = (event: any) => {
            prevMouseY = event.originalEvent.clientY
            const rowIndex = event.oldIndex
            if (rowIndex !== undefined && rowIndex >= 0) {
                draggedRow.value = tableRows.value[rowIndex] || null
                emit('row-drag-start', {
                    draggedRow: draggedRow.value
                })
            }
        }

        const updateColumns = (newColumns: DlTableColumn[]) => {
            emit('col-update', newColumns)
        }

        const renderEmptyState = () =>
            renderComponent(
                vue2h.value,
                'td',
                { colspan: '100%' },
                renderComponent(
                    vue2h.value,
                    'div',
                    {
                        class: 'flex justify-center full-width'
                    },
                    renderComponent(
                        vue2h.value,
                        DlEmptyState,
                        props.emptyStateProps,
                        (): [] => []
                    )
                )
            )

        const renderTBody = () => {
            if (isEmpty(tableRootRef.value)) return null
            const children = computedFilter.value.map((row, i) => {
                const rowBodySlot = slots['row-body']
                const [renderRow] = rowBodySlot
                    ? rowBodySlot({ row })
                    : [renderTr(row, i)]
                return renderComponent(
                    vue2h.value,
                    'tbody',
                    {
                        'data-level': 1,
                        key: getRowKey.value(row) + i,
                        class: 'nested-tbody'
                    },
                    isVue2 ? [renderRow] : renderRow
                )
            })

            const tableBody = renderComponent(
                vue2h.value,
                'tbody',
                {},
                renderComponent(
                    vue2h.value,
                    'tr',
                    {
                        class: 'dl-tr--no-hover'
                    },
                    renderComponent(
                        vue2h.value,
                        'td',
                        { colspan: tableRootRef.value.computedColspan },
                        renderComponent(
                            vue2h.value,
                            Sortable,
                            {
                                list: [],
                                itemKey: getRowKey.value,
                                tag: 'table',
                                id: mainTbodyUuid,
                                key: mainTableKey.value,
                                isSortable: hasDraggableRows.value,
                                onEnd: handleEndEvent,
                                onChange: handleChangeEvent,
                                onStart: handleStartEvent,
                                on: {
                                    end: handleEndEvent,
                                    change: handleChangeEvent,
                                    start: handleStartEvent
                                },
                                class: 'nested-table',
                                options: {
                                    group: 'nested',
                                    animation: 150,
                                    fallbackOnBody: true,
                                    invertSwap: true,
                                    swapThreshold: 0.5
                                }
                            },
                            isVue2 ? children : () => children
                        )
                    )
                )
            )

            return tableBody
        }

        return {
            renderEmptyState,
            isDataEmpty,
            updateColumns,
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
            emitRowDblclick,
            emitThClick,
            emitRowExpand,
            emitRowCollapse,
            hasSlotByName,
            getSlotByName,
            renderTBody,
            tableRootRef,
            uuid,
            mainTbodyUuid,
            vue2h,
            containerClass,
            computedFilter
        }
    },
    // adding ignore here as overloading the render function like this is not a known type
    // @ts-ignore
    render(vue2h: any) {
        this.vue2h = vue2h
        const tableBodySlot = isVue2
            ? this.$slots['table-body'] &&
              (() => (this.$slots['table-body'] as any)?.pop())
            : this.$slots['table-body']
        const tbody =
            tableBodySlot ?? (this.isDataEmpty ? null : this.renderTBody)
        return renderComponent(vue2h, DlTable, {
            ref: 'dlTableRef',
            draggable: this.draggable,
            id: this.uuid,
            selected: this.selectedData,
            separator: this.separator,
            columns: this.tableColumns,
            bordered: this.bordered,
            dense: this.dense,
            filter: this.filter,
            isTreeTable: true,
            selection: this.selection,
            loading: this.loading,
            rows: this.computedFilter,
            resizable: this.resizable,
            rowKey: this.rowKey,
            color: this.color,
            title: this.title,
            virtualScroll: this.virtualScroll,
            rowsPerPageOptions: this.rowsPerPageOptions,
            hidePagination: this.hidePagination,
            isEmpty: this.isDataEmpty,
            emptyStateProps: this.emptyStateProps,
            noDataLabel: this.noDataLabel,
            visibleColumns: this.visibleColumns,
            onRowClick: this.emitRowClick,
            onRowDblclick: this.emitRowDblclick,
            'onUpdate:selected': this.updateSelected,
            onColUpdate: this.updateColumns,
            class: this.containerClass,
            menuClass: this.menuClass,
            hideBottom: this.hideBottom,
            hideNoData: this.hideNoData,
            hideHeader: this.hideHeader,
            on: {
                'row-click': this.emitRowClick,
                'row-dblclick': this.emitRowDblclick,
                'update:selected': this.updateSelected,
                'col-update': this.updateColumns
            },
            scopedSlots: {
                'header-selection': () =>
                    renderComponent(
                        vue2h,
                        DlCheckbox,
                        {
                            color: this.color,
                            modelValue: this.headerSelectedValue,
                            indeterminateValue: true,
                            'onUpdate:modelValue': this.onMultipleSelectionSet,
                            on: {
                                'update:modelValue': this.onMultipleSelectionSet
                            }
                        },
                        (): [] => []
                    ),
                tbody,
                'no-data': this.$slots['no-data']
                    ? () => this.$slots['no-data']
                    : undefined
            }
        })
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
    // display: table-row-group;
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
