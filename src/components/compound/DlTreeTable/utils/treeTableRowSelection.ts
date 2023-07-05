import { computed, ComputedRef, ref } from 'vue-demi'
import { DlTableProps, DlTableRow } from '../../DlTable/types'
import { convertToNestedObject } from './convertToNestedObject'

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

export const useTreeTableRowSelectionEmits = ['selection', 'selectedItems']

export function useTreeTableRowSelection(
    props: DlTableProps,
    emit: (event: string, val: any) => void,
    computedRows: ComputedRef<DlTableRow[]>,
    getRowKey: ComputedRef<(val: string | DlTableRow) => any>
) {
    const propsSelected = ref<(string | DlTableRow)[]>([])

    const selectedKeys = computed(() => {
        return propsSelected.value
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

    const allRowsSelected = computed(
        () =>
            computedRows.value.length > 0 &&
            computedRows.value.every(
                (row) => selectedKeys.value[getRowKey.value(row)] === true
            )
    )

    const someRowsSelected = computed(
        () =>
            allRowsSelected.value !== true &&
            computedRows.value.some(
                (row) => selectedKeys.value[getRowKey.value(row)] === true
            )
    )

    const rowsSelectedNumber = computed(() => propsSelected.value.length)

    function isRowSelected(rowKey: string | Function) {
        if (typeof rowKey === 'function') {
            return false
        }
        return selectedKeys.value[rowKey] === true
    }

    function clearSelection() {
        propsSelected.value = []
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
                payload = propsSelected.value.concat(rows as string[])
            } else {
                payload = propsSelected.value.filter(
                    (row) => !keys.includes(getRowKey.value(row))
                )
            }
        }

        propsSelected.value = payload

        const { selectedItems } = convertToNestedObject(payload)

        emit('selectedItems', selectedItems)
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
