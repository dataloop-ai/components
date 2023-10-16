import { computed, ComputedRef, ref } from 'vue-demi'
import { DlTableProps, DlTableRow } from '../../DlTable/types'
import { convertToNestedObject } from './convertToNestedObject'

type booleanStringPartial = boolean | 'partial'

export const useTreeTableRowSelectionProps = {
    selection: {
        type: String,
        default: 'none',
        validator: (v: string) => ['single', 'multiple', 'none'].includes(v)
    },
    selected: {
        type: Array,
        default: () => [] as (string | DlTableRow)[]
    }
}

export const useTreeTableRowSelectionEmits = ['selection', 'selected-iitems']

export function useTreeTableRowSelection(
    props: DlTableProps,
    emit: (event: string, val: any) => void,
    computedRows: ComputedRef<DlTableRow[]>,
    getRowKey: ComputedRef<(val: string | DlTableRow) => any>
) {
    const selectedRows = ref<(string | DlTableRow)[]>([])
    const selectedItemsNested = ref([])

    const selectedKeys = computed(() => {
        return selectedRows.value
            .map(getRowKey.value)
            .reduce((acc, key: string) => {
                acc[key] = true

                return acc
            }, {} as Record<string, boolean>)
    })

    const hasSelectionMode = computed(() => {
        return props.selection !== 'none'
    })

    const singleSelection = computed(() => {
        return props.selection === 'single'
    })

    const multipleSelection = computed(() => {
        return props.selection === 'multiple'
    })

    const allRowsSelected = computed(() => {
        return (
            computedRows.value.length > 0 &&
            computedRows.value.every(
                (row) => selectedKeys.value[getRowKey.value(row)] === true
            )
        )
    })

    const someRowsSelected = computed(() => {
        return (
            allRowsSelected.value !== true &&
            computedRows.value.some(
                (row) => selectedKeys.value[getRowKey.value(row)] === true
            )
        )
    })

    const rowsSelectedNumber = computed(() => selectedRows.value.length)

    function getRowByKey(rowKey: string) {
        selectedItemsNested.value.findIndex((item) => item[rowKey] === rowKey)
    }

    function clearSelection() {
        selectedRows.value = []
    }

    function updateSelection(
        keys: string[],
        rows: (string | DlTableRow)[],
        added: boolean,
        evt?: (event: string, val: any) => void
    ) {
        emit('selection', { rows, added, keys, evt })

        /*
        const payload =
            singleSelection.value === true
                ? added === true
                    ? rows
                    : []
                : added === true
                ? props.selected.concat(rows as string[])
                : props.selected.filter(
                      (row) => keys.includes(getRowKey.value(row)) === false
                  )*/

        let payload: any
        if (singleSelection.value === true) {
            if (added === true) {
                payload = rows
            } else {
                payload = []
            }
        } else {
            if (added === true) {
                payload = selectedRows.value.concat(rows as string[])
            } else {
                payload = selectedRows.value.filter(
                    (row) => !keys.includes(getRowKey.value(row))
                )
            }
        }

        selectedRows.value = payload

        const { selectedItems } = convertToNestedObject(payload)
        selectedItemsNested.value = selectedItems

        emit('selectedItems', selectedItems)
    }

    function isIncludedInSelectedNestedItems(
        row: any,
        rowKey: string
    ): boolean {
        const index = selectedItemsNested.value.findIndex(
            (item) => item[rowKey] === row[rowKey]
        )

        return index > -1
    }

    function isRowSelected(
        rowKey: string | Function,
        rowKeyValue: string
    ): booleanStringPartial {
        let getOriginalRowByRowKey: any
        let getSelectedRowByRowKey: Record<string, any>

        if (typeof rowKey === 'string') {
            const originalRows = selectedRows.value.filter((item) =>
                isIncludedInSelectedNestedItems(item, rowKey)
            )
            getOriginalRowByRowKey = originalRows.find(
                (originalItem: any) => originalItem[rowKey] === rowKeyValue
            )
            getSelectedRowByRowKey = selectedItemsNested.value.find(
                (selectedItem: any) => {
                    if (getOriginalRowByRowKey) {
                        return (
                            selectedItem[rowKey] ===
                            getOriginalRowByRowKey[rowKey]
                        )
                    }
                    return false
                }
            )
        }
        if (getSelectedRowByRowKey && getOriginalRowByRowKey) {
            if (
                getOriginalRowByRowKey.children?.length !==
                getSelectedRowByRowKey.children?.length
            ) {
                return 'partial'
            }
        }

        return selectedKeys.value[rowKeyValue] === true
    }

    return {
        hasSelectionMode,
        singleSelection,
        multipleSelection,
        allRowsSelected,
        someRowsSelected,
        rowsSelectedNumber,
        isRowSelected,
        clearSelection,
        updateSelection
    }
}
