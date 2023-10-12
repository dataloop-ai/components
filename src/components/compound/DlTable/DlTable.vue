<template>
    <div
        :id="uuid"
        :key="tableKey"
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
            type="__dltable"
            :class="tableClass"
            :style="tableStyle"
            :table-colspan="computedColspan"
            :scroll-target="virtualScrollTarget"
            :items="computedRows"
            :scroll-debounce="scrollDebounce"
            v-bind="virtProps"
            @virtual-scroll="onVScroll"
        >
            <template #before>
                <thead v-if="!isDataEmpty">
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
                                style="width: 25px; padding: 5px"
                                @mousedown="stopAndPrevent"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-with"
                                @mousedown="stopAndPrevent"
                            />
                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-with dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                                @mousedown="stopAndPrevent"
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

                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-with empty-col chevron-header"
                                :data-resizable="false"
                                style="width: 25px"
                            />

                            <slot
                                v-for="(col, colIndex) in computedCols"
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
                                    :col-index="colIndex"
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
                <slot
                    name="table-body"
                    v-bind="props"
                >
                    <template v-if="!isDataEmpty && !hasSlotBody">
                        <slot
                            v-bind="
                                getBodyScope({
                                    key: getRowKey(props.item),
                                    row: props.item,
                                    pageIndex: props.pageIndex,
                                    trClass: isRowSelected(
                                        getRowKey(props.item)
                                    )
                                        ? 'selected'
                                        : ''
                                })
                            "
                            :has-any-action="hasAnyAction"
                            name="row-body"
                        >
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
                                @click="
                                    onTrClick(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                                @dblclick="
                                    onTrDblClick(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                                @contextmenu="
                                    onTrContextMenu(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                            >
                                <td
                                    v-if="hasDraggableRows"
                                    class="dl-table__drag-icon"
                                >
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
                                                isRowSelected(
                                                    getRowKey(props.item)
                                                )
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
                                    v-for="(col, colIndex) in computedCols"
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
                                        :col-index="colIndex"
                                    >
                                        {{ getCellValue(col, props.item) }}
                                    </DlTd>
                                </slot>
                            </DlTr>
                        </slot>
                    </template>
                    <DlTr v-if="isDataEmpty">
                        <DlTd colspan="100%">
                            <div class="flex justify-center full-width">
                                <dl-empty-state v-bind="emptyStateProps">
                                    <template
                                        v-for="(_, slot) in $slots"
                                        #[slot]="emptyStateSlotProps"
                                    >
                                        <slot
                                            :name="slot"
                                            v-bind="emptyStateSlotProps"
                                        />
                                    </template>
                                </dl-empty-state>
                            </div>
                        </DlTd>
                    </DlTr>
                </slot>
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
                <thead v-if="!isDataEmpty">
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
                                style="width: 25px"
                                @mousedown="stopAndPrevent"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-with"
                                @mousedown="stopAndPrevent"
                            />

                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-with dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                                @mousedown="stopAndPrevent"
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

                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-with empty-col"
                                :data-resizable="false"
                                style="width: 25px; padding: 5px"
                            />

                            <slot
                                v-for="(col, colIndex) in computedCols"
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
                                    :col-index="colIndex"
                                    @click="onThClick($event, col.name)"
                                >
                                    {{ col.label }}
                                </DlTh>
                            </slot>
                            <DlTh
                                v-if="hasEditableColumns"
                                key="visibleColsBtn"
                            >
                                <dl-button
                                    text-color="dl-color-medium"
                                    flat
                                    icon="icon-dl-column"
                                >
                                    <dl-menu>
                                        <dl-list separator>
                                            <dl-option-group
                                                :model-value="
                                                    computedVisibleCols
                                                "
                                                :options="groupOptions"
                                                :left-label="true"
                                                max-width="250px"
                                                type="switch"
                                                class="table-options"
                                                @update:model-value="
                                                    handleVisibleColumnsUpdate
                                                "
                                            />
                                        </dl-list>
                                    </dl-menu>
                                </dl-button>
                            </DlTh>
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
                <slot
                    name="tbody"
                    v-bind="{
                        computedRows,
                        class: 'dl-virtual-scroll__content'
                    }"
                >
                    <Sortable
                        :key="tbodyKey"
                        ref="tbody"
                        tag="tbody"
                        class="nested-table dl-virtual-scroll__content"
                        v-bind="{
                            onEnd: handleSortableEvent
                        }"
                        :is-sortable="hasDraggableRows"
                        :options="{
                            group: 'nested',
                            animation: 150,
                            fallbackOnBody: true,
                            invertSwap: true,
                            swapThreshold: 0.5
                        }"
                    >
                        <slot
                            name="top-row"
                            :cols="computedCols"
                        />
                        <slot
                            name="table-body"
                            :computed-rows="computedRows"
                        >
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
                                :has-any-action="hasAnyAction"
                                name="row-body"
                            >
                                <DlTr
                                    v-if="!isDataEmpty"
                                    :key="getRowKey(row)"
                                    :has-any-action="hasAnyAction"
                                    :class="
                                        isRowSelected(getRowKey(row))
                                            ? 'selected'
                                            : hasAnyAction
                                                ? ' cursor-pointer'
                                                : ''
                                    "
                                    :no-hover="noHover"
                                    @click="onTrClick($event, row, pageIndex)"
                                    @dblclick="
                                        onTrDblClick($event, row, pageIndex)
                                    "
                                    @contextmenu="
                                        onTrContextMenu($event, row, pageIndex)
                                    "
                                >
                                    <td
                                        v-if="hasDraggableRows"
                                        style="width: 25px"
                                        class="dl-table__drag-icon"
                                    >
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
                                                    isRowSelected(
                                                        getRowKey(row)
                                                    )
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
                                    <DlTd
                                        v-for="(col, colIndex) in computedCols"
                                        :key="col.name"
                                        :class="col.tdClass(row)"
                                        :style="col.tdStyle(row)"
                                        :col-index="colIndex"
                                    >
                                        <slot
                                            v-bind="
                                                getBodyCellScope({
                                                    key: getRowKey(row),
                                                    row,
                                                    pageIndex,
                                                    col
                                                })
                                            "
                                            :name="
                                                hasSlotByName(
                                                    `body-cell-${col.name}`
                                                )
                                                    ? `body-cell-${col.name}`
                                                    : 'body-cell'
                                            "
                                        >
                                            {{ getCellValue(col, row) }}
                                        </slot>
                                    </DlTd>
                                </DlTr>
                            </slot>
                        </slot>

                        <DlTr v-if="isDataEmpty && hasEmptyStateProps">
                            <DlTd colspan="100%">
                                <div class="flex justify-center full-width">
                                    <dl-empty-state v-bind="emptyStateProps">
                                        <template
                                            v-for="(_, slot) in $slots"
                                            #[slot]="emptyStateProps"
                                        >
                                            <slot
                                                :name="slot"
                                                v-bind="emptyStateProps"
                                            />
                                        </template>
                                    </dl-empty-state>
                                </div>
                            </DlTd>
                        </DlTr>
                        <slot
                            name="bottom-row"
                            :cols="computedCols"
                        />
                    </Sortable>
                </slot>
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
                            :total-items="totalItemsCount"
                            @update:rowsPerPage="
                                (v) => updatePagination(v, 'rowsPerPage')
                            "
                            @update:model-value="
                                (v) => updatePagination(v, 'page')
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
    watch,
    getCurrentInstance,
    ComputedRef,
    onMounted,
    toRef,
    toRefs,
    nextTick
} from 'vue-demi'
import { props } from './utils/props'
import { emits } from './utils/emits'
import {
    useTablePagination,
    useTablePaginationState
} from './hooks/tablePagination'
import DlTr from './components/DlTr.vue'
import DlTh from './components/DlTh.vue'
import DlTd from './components/DlTd.vue'
import { commonVirtPropsList } from '../../shared/DlVirtualScroll/useVirtualScroll'
import DlVirtualScroll from '../../shared/DlVirtualScroll/DlVirtualScroll.vue'
import { useTableFilter } from './hooks/tableFilter'
import { useTableSort } from './hooks/tableSort'
import { useTableRowSelection } from './hooks/tableRowSelection'
import { useTableColumnSelection } from './hooks/tableColumnSelection'
import { useTableRowExpand } from './hooks/tableRowExpand'
import { useTableActions } from './hooks/tableActions'
import { applyDraggableColumns, applyResizableColumns } from '../../../utils'
import { injectProp } from '../../../utils/inject-object-prop'
import { DlTableRow, DlTableProps, DlTableColumn } from './types'
import { DlPagination } from '../DlPagination'
import {
    DlIcon,
    DlCheckbox,
    DlProgressBar,
    DlMenu,
    DlList
} from '../../essential'
import { DlButton } from '../../basic'
import DlOptionGroup from '../DlOptionGroup/DlOptionGroup.vue'
import DlEmptyState from '../../basic/DlEmptyState/DlEmptyState.vue'
import { v4 } from 'uuid'
import { stopAndPrevent, setAllColumnWidths } from '../../../utils'
import { DlVirtualScrollEvent } from '../../types'
import Sortable from '../DlSortable/SortableJS.vue'
import { SortableEvent } from 'sortablejs'
import { insertAtIndex } from './utils/insertAtIndex'

const commonVirtPropsObj = {} as Record<string, any>
commonVirtPropsList.forEach((p) => {
    commonVirtPropsObj[p] = {}
})

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
        DlCheckbox,
        DlEmptyState,
        DlButton,
        DlOptionGroup,
        DlMenu,
        DlList,
        Sortable
    },
    props,
    emits,
    setup(props, { emit, slots }) {
        const vm = getCurrentInstance()
        const {
            tableStyle,
            tableClass,
            tableHeaderStyle,
            tableHeaderClass,
            dense,
            draggable,
            virtualScroll,
            rows
        } = toRefs(props)

        const tbodyKey = ref()
        const tableKey = ref()
        const getTableKey = () => tableKey.value

        const rootRef = ref<HTMLDivElement>(null)
        const virtScrollRef = ref(null)
        const hasVirtScroll = computed<boolean>(
            () => virtualScroll.value === true
        )

        const hasEmptyStateProps = computed(() =>
            props.emptyStateProps
                ? Object.keys(props.emptyStateProps).length > 0
                : false
        )

        const isDataEmpty = computed(() => !props.rows.length)

        const groupOptions = computed(() =>
            (props.columns as DlTableColumn[]).map((item) => ({
                label: item.label,
                value: item.name
            }))
        )

        const visibleColumnsState = ref(
            (props.columns as DlTableColumn[]).map((col) => col.name)
        )

        const computedVisibleCols = computed(() =>
            computedCols.value.map((col) => col.name)
        )

        const { hasAnyAction } = useTableActions(props) // todo: does not work

        const getRowKey = computed(() =>
            typeof props.rowKey === 'function'
                ? props.rowKey
                : (row: Record<string, any>) => row[props.rowKey as string]
        )

        const isResizing = ref(false)
        const isDragging = ref(false)
        const setIsResizing = (val: boolean) => (isResizing.value = val)
        const setIsDragging = (val: boolean) => (isDragging.value = val)
        const getIsDragging = () => isDragging.value
        const getIsResizing = () => isResizing.value

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
            console.log(classNames)

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
            ['rows', 'both'].includes(draggable.value)
        )

        const hasDraggableColumns = computed(() =>
            ['columns', 'both'].includes(draggable.value)
        )

        const removeDraggableColumns = () => {}

        let tableEl: HTMLTableElement = null

        const totalItemsCount = computed(() => {
            return computedPagination.value.rowsNumber || rows.value.length
        })

        onMounted(() => {
            tableEl = document.querySelector(
                'table.dl-table'
            ) as HTMLTableElement
            nextTick(() => {
                setAllColumnWidths(tableEl, props.columns, props.fitAllColumns)
            })
            if (props.resizable === true) {
                applyResizableColumns(tableEl, vm)
            }
            if (hasDraggableColumns.value === true) {
                applyDraggableColumns(
                    tableEl,
                    vm,
                    vm.refs.dragRef as HTMLDivElement
                )
            }
        })

        watch(
            () => props.rows,
            (val) => {
                console.log(containerClass.value)
            },
            { flush: 'post' }
        )

        watch(
            hasVirtScroll,
            () => {
                tableEl = (rootRef.value as HTMLDivElement).querySelector(
                    'table.dl-table'
                ) as HTMLTableElement

                if (props.resizable) {
                    applyResizableColumns(tableEl, vm)
                }

                if (hasDraggableColumns.value === true) {
                    applyDraggableColumns(
                        tableEl,
                        vm,
                        vm.refs.dragRef as HTMLDivElement
                    )
                }
            },
            {
                flush: 'post'
            }
        )

        watch(
            () => props.resizable,
            () => {
                applyResizableColumns(tableEl, vm)
            }
        )

        watch(
            () => props.columns,
            (val) => {
                setAllColumnWidths(rootRef.value, val, props.fitAllColumns)
            },
            {
                flush: 'post'
            }
        )

        watch(
            () => (props as any).visibleColummns,
            (value) => {
                visibleColumnsState.value = value
            }
        )

        watch(
            () => props.draggable,
            () => {
                if (tableEl) {
                    if (hasDraggableColumns.value === true) {
                        applyDraggableColumns(
                            tableEl,
                            vm,
                            vm.refs.dragRef as HTMLDivElement
                        )
                    } else {
                        removeDraggableColumns()
                    }
                }
            },
            { immediate: true }
        )

        watch(
            [
                tableStyle,
                tableClass,
                tableHeaderStyle,
                tableHeaderClass,
                __containerClass
            ],
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
            [computedPagination, dense],
            () => {
                if (tableEl && props.resizable) {
                    const tableHeight = tableEl.offsetHeight || 0
                }
            },
            { deep: true, flush: 'post' }
        )

        const { computedFilterMethod } = useTableFilter(props, setPagination)

        const { isRowExpanded, setExpanded, updateExpanded } =
            useTableRowExpand(props, emit)

        const filteredSortedRows = computed(() => {
            let filtered = rows.value as DlTableRow[]

            if (filtered.length === 0) {
                return rows.value as DlTableRow[]
            }

            const { sortBy, descending } = computedPagination.value

            if (props.filter) {
                filtered = computedFilterMethod.value(
                    rows.value,
                    props.filter,
                    computedCols.value,
                    getCellValue
                )
            }

            if (columnToSort.value !== null) {
                filtered = computedSortMethod.value(
                    rows.value === filtered ? filtered.slice() : filtered,
                    sortBy,
                    descending
                )
            }

            return filtered
        })

        const filteredSortedRowsNumber = computed(
            () => filteredSortedRows.value.length
        )

        const computedRows = computed(() => {
            let filtered = filteredSortedRows.value

            const { rowsPerPage } = computedPagination.value

            if (rowsPerPage !== 0) {
                if (firstRowIndex.value === 0 && rows.value !== filtered) {
                    if (filtered.length > lastRowIndex.value) {
                        filtered = filtered.slice(0, lastRowIndex.value)
                    }
                } else {
                    if (
                        filtered.length > computedPagination.value.rowsPerPage
                    ) {
                        filtered = filtered.slice(
                            firstRowIndex.value,
                            lastRowIndex.value
                        )
                    }
                }
            }

            return filtered
        })

        const additionalClasses = computed(() => {
            const classes: string[] = []

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
                hasDraggableRows,
                visibleColumnsState
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
                computedRows.value.length < rows.value.length
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
            if (!col) {
                return
            }
            const val =
                typeof col?.field === 'function'
                    ? col?.field(row)
                    : row[col.field]
            return col?.format ? col.format(val, row) : val
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
            ) as HTMLElement

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

        function onVScroll(info: DlVirtualScrollEvent) {
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

        const hasLoadingSlot = computed(() => slots['loading'])

        const paginationState = computed(() => {
            return {
                ...computedPagination.value,
                'update:rowsPerPage': (rowsPerPage: number) =>
                    setPagination({ rowsPerPage }),
                'update:model-value': (page: number) => setPagination({ page }),
                modelValue: computedPagination.value.page,
                totalItems: computedRowsNumber.value
            }
        })
        const hasSlotBody = computed(() => !!slots['table-body'])
        const hasSlotHeaderSelection = computed(
            () => !!slots['header-selection']
        )

        const handleSortableEvent = (event: SortableEvent) => {
            const { oldIndex, newIndex } = event
            const newRows = insertAtIndex(props.rows, oldIndex, newIndex)
            tbodyKey.value = v4()
            emit('row-reorder', newRows)
        }

        const reorderColumns = (sourceIndex: number, targetIndex: number) => {
            const newColumns = insertAtIndex(
                props.columns,
                sourceIndex,
                targetIndex
            )
            tableKey.value = v4()
            emit('col-update', newColumns)
        }

        const updateColumns = (newColumns: DlTableColumn[]) => {
            emit('col-update', newColumns)
        }

        // expose public methods and needed computed props
        Object.assign(vm.proxy, {
            resetVirtualScroll,
            scrollTo,
            setExpanded,
            sort,
            firstPage,
            prevPage,
            nextPage,
            lastPage,
            updateColumns,
            reorderColumns,
            setIsResizing,
            setIsDragging,
            getIsResizing,
            getIsDragging,
            // hasDraggableColumns: hasDraggableColumns.value,
            getTableKey
        })

        const slotNames = computed(() => {
            return slots.length ? slots.map((slot: any) => slot.name) : null
        })

        const updatePagination = (value: any, key: string) => {
            return setPagination({ [`${key}`]: value })
        }

        const handleVisibleColumnsUpdate = (columns: string[]) => {
            if (columns.length < 1) return
            visibleColumnsState.value = columns
            emit('update-visible-columns', columns)
        }

        return {
            log: console.log,
            isDataEmpty,
            handleSortableEvent,
            tbodyKey,
            tableKey,
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
            hasPaginationSlot,
            slotNames,
            hasSlotBody,
            hasSlotHeaderSelection,
            stopAndPrevent,
            updatePagination,
            hasEmptyStateProps,
            groupOptions,
            visibleColumnsState,
            handleVisibleColumnsUpdate,
            computedVisibleCols,
            totalItemsCount
        }
    }
})
</script>

<style scoped lang="scss">
@import './styles/dl-table-styles.scss';

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

tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
th,
td {
    box-sizing: border-box;
}
</style>
