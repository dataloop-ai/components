<template>
    <DlTable
        ref="dlTableRef"
        :selected="selectedData"
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
        :hide-pagination="hidePagination"
        :is-empty="isEmpty"
        :empty-state-props="emptyStateProps"
        :no-data-label="noDataLabel"
        @row-click="emitRowClick"
        @th-click="emitThClick"
        @update:selected="updateSelected"
        @rowDragged="rowDragged"
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
        <template #table-body="props">
            <template v-if="virtualScroll && !isEmpty">
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
                            rowIndex: props.index
                        })
                    "
                    :bind-body-cell-scope="
                        dlTableRef.getBodyCellScope({
                            key: getRowKey(props.item),
                            row: props.item,
                            rowIndex: props.index
                        })
                    "
                    :color="color"
                    :computed-cols="dlTableRef.computedCols"
                    :slot-name="dlTableRef.slotNames"
                    :computed-rows="computedRows"
                    :model-value="isRowSelected(rowKey, getRowKey(props.item))"
                    @update:model-value="
                        (adding, evt) =>
                            updateSelectionHierarchy(adding, evt, props.item)
                    "
                    @rowClick="
                        dlTableRef.onTrClick($event, props.item, props.index)
                    "
                    @rowDoubleClick="
                        dlTableRef.onTrDblClick($event, props.item, props.index)
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
                >
                    <template
                        v-for="templateCol in dlTableRef.computedCols"
                        #[getSlotByName(templateCol.name)]
                    >
                        <slot
                            :name="getSlotByName(templateCol.name)"
                            v-bind="
                                dlTableRef.getBodyCellScope({
                                    key: getRowKey(props.item),
                                    row: props.item,
                                    rowIndex: props.index
                                })
                            "
                        />
                    </template>
                </DlTrTreeView>
            </template>
            <template v-else>
                <template v-if="dlTableRef && !isEmpty">
                    <!--
                    <pre>
                        {{ computedRows }}
                    </pre>
                    -->
                    <DlTrTreeView
                        v-for="(row, rowIndex) in computedRows"
                        :key="JSON.stringify(row)"
                        :row="row"
                        :row-key="rowKey"
                        :is-row-selected="
                            isRowSelected(rowKey, getRowKey(row))
                                ? 'selected'
                                : ''
                        "
                        :has-any-action="dlTableRef.hasAnyAction"
                        :no-hover="dlTableRef.noHover"
                        :row-index="rowIndex"
                        :has-draggable-rows="dlTableRef.hasDraggableRows"
                        :has-selection-mode="dlTableRef.hasSelectionMode"
                        :bind-body-selection="
                            dlTableRef.getBodySelectionScope({
                                key: getRowKey(row),
                                row,
                                rowIndex
                            })
                        "
                        :bind-body-cell-scope="
                            dlTableRef.getBodyCellScope({
                                key: getRowKey(row),
                                row,
                                rowIndex
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
                        @rowClick="dlTableRef.onTrClick($event, row, rowIndex)"
                        @rowDoubleClick="
                            dlTableRef.onTrDblClick($event, row, rowIndex)
                        "
                        @rowContextMenu="
                            dlTableRef.onTrContextMenu($event, row, rowIndex)
                        "
                        @updateExpandedRow="
                            updateExpandedRow(!row.expanded, getRowKey(row))
                        "
                        @mousedown="onMousedown(row)"
                        @mouseup="onMouseup(row)"
                    >
                        <template
                            v-for="templateCol in dlTableRef.computedCols"
                            #[getSlotByName(templateCol.name)]
                        >
                            <slot
                                :name="getSlotByName(templateCol.name)"
                                v-bind="
                                    dlTableRef.getBodySelectionScope({
                                        key: getRowKey(row),
                                        row,
                                        rowIndex
                                    })
                                "
                            />
                        </template>
                    </DlTrTreeView>
                </template>
            </template>
        </template>
        <template #no-data>
            <slot name="no-data" />
        </template>
    </DlTable>
</template>

<script lang="ts">
import {
    computed,
    ComputedRef,
    defineComponent,
    isVue2,
    set,
    ref,
    onMounted,
    toRefs,
    watch,
    getCurrentInstance
} from 'vue-demi'
import { DlTable } from '../../../components'
import DlTrTreeView from './views/DlTrTreeView.vue'
import { cloneDeep } from 'lodash'
import { DlTableProps, DlTableRow } from '../DlTable/types'
import { useTreeTableRowSelection } from './utils/treeTableRowSelection'
import { getFromChildren } from './utils/getFromChildren'
import DlCheckbox from '../../essential/DlCheckbox/DlCheckbox.vue'
import { props } from './props'
import { emits } from './emits'

export default defineComponent({
    name: 'DlTreeTable',
    components: {
        DlTable,
        DlTrTreeView,
        DlCheckbox
    },
    props,
    emits,
    setup(props, { emit, slots }) {
        const vm = getCurrentInstance()
        const dlTableRef = ref(null)
        const selectedData = ref([])
        const vScroll = ref(false)
        const borderState = ref([])
        const denseState = ref([])
        const resizableState = ref([])
        const { rows } = toRefs(props)

        watch(
            rows,
            (newRows) => {
                // console.log('rows have changed')
                tableRows.value = newRows
                // vm.proxy.$forceUpdate()
            },
            {
                deep: true,
                flush: 'post'
            }
        )

        const tableRows = ref(cloneDeep(props.rows))
        const tableColumns = ref(props.columns)
        const hasFlatTreeData = true

        const hasEmptyStateProps = computed(
            () => Object.keys(props.emptyStateProps).length > 0
        )

        const computedRows = computed(() =>
            dlTableRef.value?.computedRows ? dlTableRef.value?.computedRows : []
        )

        watch(
            computedRows,
            (value) => {
                // console.log('watch DlTreeTable computedRows value: ', value)
            },
            {
                deep: true,
                flush: 'post'
            }
        )

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
                                set(r, 'expanded', isExpanded)
                            } else {
                                r.expanded = isExpanded
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
            selectedData.value = payload
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

        const hasSlotByName = (name: string) => !!slots[name]

        const getSlotByName = (name: string) => {
            if (hasSlotByName(`body-cell-${name}`)) {
                return `body-cell-${name}`
            }
        }

        const isMousemove = ref(false)
        const isMousedown = ref(false)

        const onMousedown = (row: any) => {
            isMousedown.value = true
            // console.log('onMousedown: ', row)
        }
        const onMouseup = (event: any) => {
            isMousedown.value = false
            // console.log('onMouseup: ', event)
        }
        const onMousemove = (row: any) => {
            isMousemove.value = true
            // console.log('onMousemove: ', row)
        }

        onMounted(() => {
            // document.addEventListener('mouseup', onMouseup)
            // document.getElementsByClassName('dl-table').addEventListener('resize', (event) => console.log('resize: ', event))
        })

        const rowDragged = (data: any) => {
            // console.log('DlTreeTable rowDragged event: ', data)
            emit('rowDragged', data)
        }
        return {
            onMousedown,
            onMouseup,
            onMousemove,
            dlTableRef,
            isRowSelected,
            hasFlatTreeData,
            vScroll,
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
            rowDragged
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
