<template>
    <div
        :id="uuid"
        ref="rootRef"
        :class="containerClass"
    >
        <div
            ref="dragRef"
            class="dl-table__drag"
        />
        <!-- Top Slots -->
        <div
            v-if="hasTopSlots"
            class="dl-table__top row items-center"
        >
            <slot
                v-bind="marginalsScope"
                name="top"
            >
                <slot
                    v-if="hasTopSelectionMode"
                    v-bind="marginalsScope"
                    name="top-selection"
                />

                <div
                    v-else
                    class="dl-table__control"
                >
                    <slot
                        name="top-left"
                        v-bind="marginalsScope"
                    >
                        <div
                            v-if="title"
                            class="dl-table__control"
                        >
                            <div :class="titleClasses">
                                {{ title }}
                            </div>
                        </div>
                    </slot>
                </div>

                <div class="dl-table__separator col" />
                <div class="dl-table__control">
                    <slot
                        name="top-right"
                        v-bind="marginalsScope"
                    />
                </div>
            </slot>
        </div>
        <!--  -->

        <!-- Virtual scroll  -->
        <DlVirtualScroll
            v-if="hasVirtScroll"
            ref="virtScrollRef"
            :class="tableClass"
            :draggable-classes="additionalClasses"
            :style="tableStyle"
            :scroll-target="virtualScrollTarget"
            :items="computedRows"
            :table-colspan="computedColspan"
            v-bind="virtProps"
            @virtual-scroll="onVScroll"
        >
            <template #before>
                <thead>
                    <slot
                        v-if="!hideHeader"
                        name="header"
                        v-bind="getHeaderScope({ header: true })"
                    >
                        <DlTr>
                            <th
                                v-if="hasDraggableRows"
                                class="dl-table--col-auto-with empty-col"
                                :data-resizable="false"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-with"
                            />

                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-with dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                            >
                                <slot
                                    name="header-selection"
                                    v-bind="getHeaderScope({})"
                                >
                                    <DlCheckbox
                                        :color="color"
                                        :model-value="headerSelectedValue"
                                        :indeterminate-value="
                                            selectionCheckboxIndeterminateVal
                                        "
                                        @update:model-value="
                                            onMultipleSelectionSet
                                        "
                                    />
                                </slot>
                            </th>

                            <slot
                                v-for="col in computedCols"
                                v-bind="getHeaderScope({ col })"
                                :name="
                                    hasSlotByName(`header-cell-${col.name}`)
                                        ? `header-cell-${col.name}`
                                        : 'header-cell'
                                "
                            >
                                <DlTh
                                    :key="col.name"
                                    :props="getHeaderScope({ col })"
                                >
                                    {{ col.label }}
                                </DlTh>
                            </slot>
                        </DlTr>

                        <tr
                            v-if="loading && !hasLoadingSlot"
                            class="dl-table__progress"
                        >
                            <th
                                :colspan="computedColspan"
                                class="relative-position"
                            >
                                <dl-progress-bar
                                    indeterminate
                                    :color="color"
                                />
                            </th>
                        </tr>
                    </slot>
                </thead>
            </template>
            <template #default="props">
                <DlTr
                    :key="getRowKey(props.item)"
                    :class="
                        isRowSelected(getRowKey(props.item))
                            ? 'selected'
                            : hasAnyAction
                                ? ' cursor-pointer'
                                : ''
                    "
                    :no-hover="noHover"
                    @click="onTrClick($event, props.item, pageIndex)"
                    @dblclick="onTrDblClick($event, props.item, pageIndex)"
                    @contextmenu="
                        onTrContextMenu($event, props.item, pageIndex)
                    "
                >
                    <td v-if="hasDraggableRows">
                        <dl-icon
                            class="draggable-icon"
                            icon="icon-dl-drag"
                            size="12px"
                        />
                    </td>
                    <td
                        v-if="hasSelectionMode"
                        class="dl-table--col-auto-with"
                    >
                        <slot
                            name="body-selection"
                            v-bind="
                                getBodySelectionScope({
                                    key: getRowKey(props.item),
                                    row: props.item,
                                    pageIndex: props.pageIndex
                                })
                            "
                        >
                            <DlCheckbox
                                :color="color"
                                :model-value="
                                    isRowSelected(getRowKey(props.item))
                                "
                                @update:model-value="
                                    (adding, evt) =>
                                        updateSelection(
                                            [getRowKey(props.item)],
                                            [props.item],
                                            adding,
                                            evt
                                        )
                                "
                            />
                        </slot>
                    </td>
                    <slot
                        v-for="col in computedCols"
                        v-bind="
                            getBodyCellScope({
                                key: getRowKey(props.item),
                                row: props.item,
                                pageIndex: props.pageIndex,
                                col
                            })
                        "
                        :name="
                            hasSlotByName(`body-cell-${col.name}`)
                                ? `body-cell-${col.name}`
                                : 'body-cell'
                        "
                    >
                        <DlTd
                            :class="col.tdClass(props.item)"
                            :style="col.tdStyle(props.item)"
                            :no-hover="noHover"
                        >
                            {{ getCellValue(col, props.item) }}
                        </DlTd>
                    </slot>
                </DlTr>
            </template>
        </DlVirtualScroll>
        <!--  -->

        <div
            v-else
            class="dl-table__middle scroll"
        >
            <table
                class="dl-table"
                :class="additionalClasses"
            >
                <thead>
                    <slot
                        v-if="!hideHeader"
                        name="header"
                        v-bind="getHeaderScope({ header: true })"
                    >
                        <DlTr>
                            <th
                                v-if="hasDraggableRows"
                                class="dl-table--col-auto-with empty-col"
                                :data-resizable="false"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-with"
                            />

                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-with dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                            >
                                <slot
                                    name="header-selection"
                                    v-bind="getHeaderScope({})"
                                >
                                    <DlCheckbox
                                        :color="color"
                                        :model-value="headerSelectedValue"
                                        :indeterminate-value="true"
                                        @update:model-value="
                                            onMultipleSelectionSet
                                        "
                                    />
                                </slot>
                            </th>

                            <slot
                                v-for="col in computedCols"
                                v-bind="getHeaderScope({ col, onThClick })"
                                :name="
                                    hasSlotByName(`header-cell-${col.name}`)
                                        ? `header-cell-${col.name}`
                                        : 'header-cell'
                                "
                            >
                                <DlTh
                                    :key="col.name"
                                    :props="getHeaderScope({ col })"
                                    @click="onThClick($event, col.name)"
                                >
                                    {{ col.label }}
                                </DlTh>
                            </slot>
                        </DlTr>

                        <tr
                            v-if="loading && !hasLoadingSlot"
                            class="dl-table__progress"
                        >
                            <th
                                :colspan="computedColspan"
                                class="relative-position"
                            >
                                <dl-progress-bar
                                    indeterminate
                                    :color="color"
                                />
                            </th>
                        </tr>
                    </slot>
                </thead>
                <tbody id="draggable">
                    <slot
                        name="top-row"
                        :cols="computedCols"
                    />
                    <slot
                        v-for="(row, pageIndex) in computedRows"
                        v-bind="
                            getBodyScope({
                                key: getRowKey(row),
                                row,
                                pageIndex,
                                trClass: isRowSelected(getRowKey(row))
                                    ? 'selected'
                                    : ''
                            })
                        "
                        name="body"
                    >
                        <DlTr
                            :key="getRowKey(row)"
                            :class="
                                isRowSelected(getRowKey(row))
                                    ? 'selected'
                                    : hasAnyAction
                                        ? ' cursor-pointer'
                                        : ''
                            "
                            :no-hover="noHover"
                            @click="onTrClick($event, row, pageIndex)"
                            @dblclick="onTrDblClick($event, row, pageIndex)"
                            @contextmenu="
                                onTrContextMenu($event, row, pageIndex)
                            "
                        >
                            <td v-if="hasDraggableRows">
                                <dl-icon
                                    class="draggable-icon"
                                    icon="icon-dl-drag"
                                    size="12px"
                                />
                            </td>
                            <td
                                v-if="hasSelectionMode"
                                class="dl-table--col-auto-with"
                            >
                                <slot
                                    name="body-selection"
                                    v-bind="
                                        getBodySelectionScope({
                                            key: getRowKey(row),
                                            row,
                                            pageIndex
                                        })
                                    "
                                >
                                    <DlCheckbox
                                        :color="color"
                                        :model-value="
                                            isRowSelected(getRowKey(row))
                                        "
                                        @update:model-value="
                                            (adding, evt) =>
                                                updateSelection(
                                                    [getRowKey(row)],
                                                    [row],
                                                    adding,
                                                    evt
                                                )
                                        "
                                    />
                                </slot>
                            </td>
                            <slot
                                v-for="col in computedCols"
                                v-bind="
                                    getBodyCellScope({
                                        key: getRowKey(row),
                                        row,
                                        pageIndex,
                                        col
                                    })
                                "
                                :name="
                                    hasSlotByName(`body-cell-${col.name}`)
                                        ? `body-cell-${col.name}`
                                        : 'body-cell'
                                "
                            >
                                <DlTd
                                    :class="col.tdClass(row)"
                                    :style="col.tdStyle(row)"
                                >
                                    {{ getCellValue(col, row) }}
                                </DlTd>
                            </slot>
                        </DlTr>
                    </slot>
                    <slot
                        name="bottom-row"
                        :cols="computedCols"
                    />
                </tbody>
            </table>
        </div>

        <div
            v-if="!hideBottom"
            :class="bottomClasses"
        >
            <div
                v-if="nothingToDisplay && !hideNoData"
                class="dl-table__control"
            >
                <slot name="no-data">
                    {{ noDataMessage }}
                </slot>
            </div>
            <div
                v-else
                class="dl-table__control"
            >
                <slot
                    name="bottom"
                    v-bind="marginalsScope"
                >
                    <div
                        v-if="hasBotomSelectionBanner"
                        class="dl-table__control"
                    >
                        <div>
                            {{ selectedRowsLabel(rowsSelectedNumber) }}
                        </div>
                    </div>

                    <slot
                        name="pagination"
                        v-bind="marginalsScope"
                    >
                        <dl-pagination
                            v-if="displayPagination"
                            v-bind="marginalsScope.pagination"
                            total-items="rows.length"
                            @update:rowsPerPage="
                                (v) => setPagination({ rowsPerPage: v })
                            "
                            @update:modelValue="
                                (v) => setPagination({ page: v })
                            "
                        />
                    </slot>
                </slot>
            </div>
        </div>

        <slot
            v-if="loading"
            name="loading"
        />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    ref,
    PropType,
    watch,
    getCurrentInstance,
    ComputedRef,
    onMounted
} from 'vue-demi'
import {
    useTablePagination,
    useTablePaginationState,
    useTablePaginationProps
} from './hooks/tablePagination'
import DlTr from './components/DlTr.vue'
import DlTh from './components/DlTh.vue'
import DlTd from './components/DlTd.vue'
import {
    commonVirtPropsList,
    commonVirtScrollProps,
    ScrollDetails
} from '../../shared/DlVirtualScroll/useVirtualScroll'
import { DlVirtualScroll } from '../../shared/DlVirtualScroll'
import { useTableFilter, useTableFilterProps } from './hooks/tableFilter'
import { useTableSort, useTableSortProps } from './hooks/tableSort'
import {
    useTableRowSelection,
    useTableRowSelectionProps,
    useTableRowSelectionEmits
} from './hooks/tableRowSelection'
import {
    useTableColumnSelection,
    useTableColumnSelectionProps
} from './hooks/tableColumnSelection'
import {
    useTableRowExpand,
    useTableRowExpandProps,
    useTableRowExpandEmits
} from './hooks/tableRowExpand'
import { useTableActionsProps, useTableActions } from './hooks/tableActions'
import {
    applyDraggableRows,
    applyDraggableColumns
} from '../../../utils/draggable-table'
import { injectProp } from '../../../utils/inject-object-prop'
import { DlTableRow, DlTableProps, DlTableColumn } from './types'
import { DlPagination } from '../DlPagination'
import { DlIcon, DlCheckbox, DlProgressBar } from '../../essential'
import { ResizableManager } from './utils'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlTable',
    components: {
        DlTr,
        DlTh,
        DlTd,
        DlVirtualScroll,
        DlPagination,
        DlProgressBar,
        DlIcon,
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
        loading: Boolean,
        dense: Boolean,
        resizable: Boolean,
        hideNoData: Boolean,
        hideHeader: Boolean,
        hideBottom: Boolean,
        virtualScroll: Boolean,
        hidePagination: Boolean,
        hideSelectedBanner: Boolean,
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
            default: void 0
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
        ...useTableRowSelectionEmits
    ],
    setup(props, { emit, slots }) {
        const vm = getCurrentInstance()

        const rootRef = ref(null)
        const virtScrollRef = ref(null)
        const hasVirtScroll = computed(() => props.virtualScroll === true)

        const { hasAnyAction } = useTableActions(props) // todo: does not work

        const getRowKey = computed(() =>
            typeof props.rowKey === 'function'
                ? props.rowKey
                : (row: Record<string, any>) => row[props.rowKey as string]
        )

        // table slots
        const hasSlotByName = (name: string) => !!slots[name]

        const hasPaginationSlot = computed(() => hasSlotByName('pagination'))

        const hasTopSlots = computed(
            () =>
                !!slots['top'] ||
                !!slots['top-left'] ||
                !!slots['top-right'] ||
                !!slots['top-selection']
        )
        //

        // table class names
        const __containerClass = computed(() => {
            let classNames = `dl-table__container dl-table--${props.separator}-separator column no-wrap dl-table--no-wrap`

            if (props.bordered) {
                classNames = classNames + ' dl-table--bordered'
            }

            if (props.dense) {
                classNames = classNames + ' dl-table--dense'
            }

            return classNames
        })

        const containerClass = computed(() => {
            let classNames = __containerClass.value

            if (props.loading) {
                classNames = classNames + ' dl-table--loading'
            }

            return classNames
        })

        const nothingToDisplay = computed(() => computedRows.value.length === 0)

        const titleClasses = computed(
            () => 'dl-table__title ' + (props.titleClass || '')
        )

        const bottomClasses = computed(() => {
            let classNames = 'dl-table__bottom row items-center'

            if (nothingToDisplay.value && !props.hideNoData) {
                // TODO add styles for this class
                classNames = classNames + ' dl-table__bottom--nodata'
            }

            return classNames
        })
        //

        const noDataMessage = computed(() => {
            if (props.loading) {
                return props.loadingLabel
            }

            if (props.filter) {
                return props.noResultsLabel
            }

            return props.noDataLabel
        })

        const hasDraggableRows = computed(() =>
            ['rows', 'both'].includes(props.draggable)
        )
        const hasDraggableColumns = computed(() =>
            ['columns', 'both'].includes(props.draggable)
        )

        let removeDraggableRows = () => {}
        let removeDraggableColumns = () => {}

        let resizableManager: ResizableManager | null = null
        let tableEl: HTMLTableElement = null

        onMounted(() => {
            tableEl = (rootRef.value as HTMLDivElement).querySelector(
                'table.dl-table'
            ) as HTMLTableElement
            resizableManager = new ResizableManager()

            if (props.resizable === true) {
                resizableManager.addResizeCapability(tableEl)
            }

            if (hasDraggableRows.value === true) {
                removeDraggableRows = applyDraggableRows(
                    tableEl,
                    vm,
                    rootRef.value
                )
            }

            if (hasDraggableColumns.value === true) {
                removeDraggableColumns = applyDraggableColumns(
                    tableEl,
                    vm,
                    vm.refs.dragRef as HTMLDivElement,
                    rootRef.value
                )
            }
        })

        watch(
            hasVirtScroll,
            () => {
                tableEl = (rootRef.value as HTMLDivElement).querySelector(
                    'table.dl-table'
                ) as HTMLTableElement

                if (props.resizable) {
                    resizableManager.removeResizeCapability()
                    resizableManager.addResizeCapability(tableEl)
                }

                if (hasDraggableRows.value === true) {
                    removeDraggableRows()
                    removeDraggableRows = applyDraggableRows(
                        tableEl,
                        vm,
                        rootRef.value
                    )
                }

                if (hasDraggableColumns.value === true) {
                    removeDraggableColumns()
                    removeDraggableColumns = applyDraggableColumns(
                        tableEl,
                        vm,
                        vm.refs.dragRef as HTMLDivElement,
                        rootRef.value
                    )
                }
            },
            {
                flush: 'post'
            }
        )

        watch(
            () => props.resizable,
            (value: boolean) => {
                if (value) {
                    resizableManager.addResizeCapability(tableEl)
                } else {
                    resizableManager.removeResizeCapability()
                }
            }
        )

        watch(
            () => props.draggable,
            () => {
                if (tableEl) {
                    if (hasDraggableRows.value === true) {
                        removeDraggableRows = applyDraggableRows(
                            tableEl,
                            vm,
                            rootRef.value
                        )
                    } else {
                        removeDraggableRows()
                    }

                    if (hasDraggableColumns.value === true) {
                        removeDraggableColumns = applyDraggableColumns(
                            tableEl,
                            vm,
                            vm.refs.dragRef as HTMLDivElement,
                            rootRef.value
                        )
                    } else {
                        removeDraggableColumns()
                    }
                }
            },
            { immediate: true }
        )

        watch(
            () =>
                (props.tableStyle as string) +
                props.tableClass +
                props.tableHeaderStyle +
                props.tableHeaderClass +
                __containerClass,
            () => {
                if (
                    hasVirtScroll.value === true &&
                    virtScrollRef.value !== null
                ) {
                    virtScrollRef.value.reset()
                }
            }
        )

        const { innerPagination, computedPagination, setPagination } =
            useTablePaginationState(vm, getCellValue)

        watch(
            [computedPagination, () => props.dense],
            () => {
                if (tableEl && props.resizable && resizableManager) {
                    const tableHeight = tableEl.offsetHeight || 0

                    resizableManager.updateResizersHeight(tableHeight)
                }
            },
            { deep: true, flush: 'post' }
        )

        const { computedFilterMethod } = useTableFilter(props, setPagination)

        const { isRowExpanded, setExpanded, updateExpanded } =
            useTableRowExpand(props, emit)

        const filteredSortedRows = computed(() => {
            let rows = props.rows as DlTableRow[]

            if (rows.length === 0) {
                return rows
            }

            const { sortBy, descending } = computedPagination.value

            if (props.filter) {
                rows = computedFilterMethod.value(
                    rows,
                    props.filter,
                    computedCols.value,
                    getCellValue
                )
            }

            if (columnToSort.value !== null) {
                rows = computedSortMethod.value(
                    props.rows === rows ? rows.slice() : rows,
                    sortBy,
                    descending
                )
            }

            return rows
        })

        const filteredSortedRowsNumber = computed(
            () => filteredSortedRows.value.length
        )

        const computedRows = computed(() => {
            let rows = filteredSortedRows.value

            const { rowsPerPage } = computedPagination.value

            if (rowsPerPage !== 0) {
                if (firstRowIndex.value === 0 && props.rows !== rows) {
                    if (rows.length > lastRowIndex.value) {
                        rows = rows.slice(0, lastRowIndex.value)
                    }
                } else {
                    rows = rows.slice(firstRowIndex.value, lastRowIndex.value)
                }
            }

            return rows
        })

        const additionalClasses = computed(() => {
            const classes = []

            if (hasDraggableRows.value === true) {
                classes.push('dl-table--draggable-rows')
            }

            if (hasDraggableColumns.value === true) {
                classes.push('dl-table--draggable-columns')
            }

            return classes
        })

        const displayPagination = computed(
            () => !(props.hidePagination || nothingToDisplay.value)
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
        } = useTableRowSelection(
            props as unknown as DlTableProps,
            emit,
            computedRows,
            getRowKey as ComputedRef<(val: string | DlTableRow) => any>
        )

        const { colList, computedCols, computedColsMap, computedColspan } =
            useTableColumnSelection(
                props as unknown as DlTableProps,
                computedPagination,
                hasSelectionMode,
                hasDraggableRows
            )

        const { columnToSort, computedSortMethod, sort } = useTableSort(
            props as unknown as DlTableProps,
            computedPagination,
            colList,
            setPagination
        )

        const headerSelectedValue = computed(() =>
            someRowsSelected.value === true ? null : allRowsSelected.value
        )

        const selectionCheckboxIndeterminateVal = computed(
            () =>
                multipleSelection.value === true &&
                computedRows.value.length > 0 &&
                computedRows.value.length < props.rows.length
        )

        function onMultipleSelectionSet(val: boolean) {
            if (someRowsSelected.value === true) {
                val = false
            }

            updateSelection(
                computedRows.value.map(getRowKey.value as any),
                computedRows.value,
                val
            )
        }

        const hasTopSelectionMode = computed(() => {
            return (
                hasSelectionMode.value === true && rowsSelectedNumber.value > 0
            )
        })

        const hasBotomSelectionBanner = computed(() => {
            return (
                props.hideSelectedBanner !== true &&
                hasSelectionMode.value === true &&
                rowsSelectedNumber.value > 0
            )
        })

        const {
            firstRowIndex,
            lastRowIndex,
            isFirstPage,
            isLastPage,
            pagesNumber,
            computedRowsNumber,
            firstPage,
            prevPage,
            nextPage,
            lastPage
        } = useTablePagination(
            vm,
            computedPagination,
            setPagination,
            filteredSortedRowsNumber
        )

        function getHeaderScope(data: Record<string, any>) {
            Object.assign(data, {
                cols: computedCols.value,
                sort,
                colsMap: computedColsMap.value,
                color: props.color,
                dense: props.dense
            })

            if (multipleSelection.value === true) {
                injectProp(
                    data,
                    'selected',
                    () => headerSelectedValue.value,
                    onMultipleSelectionSet
                )
            }

            return data
        }

        // Virtual scroll functionality

        const virtProps = computed(() => {
            const acc: Record<string, any> = {}

            commonVirtPropsList.forEach((p) => {
                acc[p] = (props as Record<string, any>)[p]
            })

            if (!acc.virtualScrollItemSize) {
                acc.virtualScrollItemSize = props.dense === true ? 30 : 40
            }

            return acc
        })

        const marginalsScope = computed(() => ({
            pagination: paginationState.value,
            pagesNumber: pagesNumber.value,
            isFirstPage: isFirstPage.value,
            isLastPage: isLastPage.value,
            firstPage,
            prevPage,
            nextPage,
            lastPage
        }))

        function getCellValue(
            col: Record<string, any>,
            row: Record<string, any>
        ) {
            const val =
                typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field]
            return col.format !== void 0 ? col.format(val, row) : val
        }

        function resetVirtualScroll() {
            if (hasVirtScroll.value === true) {
                virtScrollRef.value.reset()
            }
        }

        function scrollTo(toIndex: string | number, edge?: string) {
            if (virtScrollRef.value !== null) {
                virtScrollRef.value.scrollTo(toIndex, edge)
                return
            }

            toIndex = parseInt(toIndex as string, 10)
            const rowEl = rootRef.value.querySelector(
                `tbody tr:nth-of-type(${toIndex + 1})`
            )

            if (rowEl !== null) {
                const scrollTarget = rootRef.value.querySelector(
                    '.dl-table__middle.scroll'
                )
                const offsetTop =
                    rowEl.offsetTop -
                    (props.virtualScrollStickySizeStart as number)
                const direction =
                    offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase'

                scrollTarget.scrollTop = offsetTop

                emit('virtual-scroll', {
                    index: toIndex,
                    from: 0,
                    to: innerPagination.value.rowsPerPage - 1,
                    direction
                })
            }
        }

        function onVScroll(info: ScrollDetails) {
            emit('virtual-scroll', info)
        }

        //

        const onThClick = (evt: MouseEvent, name: string) => {
            emit('th-click', evt, computedRows.value, name)
        }

        const onTrClick = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            emit('row-click', evt, row, pageIndex)
        }

        const onTrDblClick = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            emit('row-dblclick', evt, row, pageIndex)
        }

        const onTrContextMenu = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            emit('row-contextmenu', evt, row, pageIndex)
        }

        function injectBodyCommonScope(data: Record<string, any>) {
            Object.assign(data, {
                cols: computedCols.value,
                colsMap: computedColsMap.value,
                sort,
                rowIndex: firstRowIndex.value + data.pageIndex,
                color: props.color,
                dense: props.dense,
                noHover: props.noHover
            })

            if (hasSelectionMode.value === true) {
                injectProp(
                    data,
                    'selected',
                    () => isRowSelected(data.key),
                    (adding: boolean, evt: any) => {
                        updateSelection([data.key], [data.row], adding, evt)
                    }
                )
            }

            injectProp(
                data,
                'expand',
                () => isRowExpanded(data.key),
                (adding) => {
                    updateExpanded(data.key, adding)
                }
            )
        }

        function getBodyScope(data: Record<string, any>) {
            injectBodyCommonScope(data)

            data.cols = data.cols.map((col: DlTableColumn) =>
                Object.defineProperty({ ...col }, 'value', {
                    get: () => getCellValue(col, data.row),
                    enumerable: true
                })
            )

            return data
        }

        function getBodyCellScope(data: Record<string, any>) {
            injectBodyCommonScope(data)
            injectProp(data, 'value', () => getCellValue(data.col, data.row))

            return data
        }

        function getBodySelectionScope(data: Record<string, any>) {
            injectBodyCommonScope(data)
            return data
        }

        const hasLoadingSlot = computed(() => slots['loading'] !== void 0)

        const paginationState = computed(() => {
            return {
                ...computedPagination.value,
                'update:rowsPerPage': (rowsPerPage: number) =>
                    setPagination({ rowsPerPage }),
                'update:modelValue': (page: number) => setPagination({ page }),
                modelValue: computedPagination.value.page,
                totalItems: computedRowsNumber.value
            }
        })

        // expose public methods and needed computed props
        Object.assign(vm.proxy, {
            resetVirtualScroll,
            scrollTo,
            setExpanded,
            sort,
            firstPage,
            prevPage,
            nextPage,
            lastPage
        })

        return {
            uuid: `dl-table-${v4()}`,
            rootRef,
            containerClass,
            computedRows,
            computedCols,
            computedColspan,
            getRowKey,
            additionalClasses,
            getHeaderScope,
            virtScrollRef,
            hasVirtScroll,
            virtProps,
            onVScroll,
            hasSlotByName,
            hasDraggableRows,
            hasDraggableColumns,
            marginalsScope,
            titleClasses,
            bottomClasses,
            hasTopSlots,
            nothingToDisplay,
            noDataMessage,
            paginationState,
            hasTopSelectionMode,
            hasBotomSelectionBanner,
            rowsSelectedNumber,
            singleSelection,
            multipleSelection,
            headerSelectedValue,
            selectionCheckboxIndeterminateVal,
            onMultipleSelectionSet,
            getBodyScope,
            isRowSelected,
            getCellValue,
            getBodyCellScope,
            hasSelectionMode,
            getBodySelectionScope,
            hasAnyAction,
            updateSelection,
            setPagination,
            hasLoadingSlot,
            displayPagination,
            onTrClick,
            onTrDblClick,
            onThClick,
            onTrContextMenu,
            hasPaginationSlot
        }
    }
})
</script>

<style scoped src="./styles/dl-table-styles.scss" lang="scss" />
