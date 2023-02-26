import { computed, ComputedRef } from 'vue-demi'
import { TableProps, TableRow } from '../types'

export const useTableRowSelectionProps = {
    selection: {
        type: String,
        default: 'none',
        validator: (v: string) => ['single', 'multiple', 'none'].includes(v)
    },
    selected: {
        type: Array,
        default: () => [] as (string | TableRow)[]
    }
}

export const useTableRowSelectionEmits = ['update:selected', 'selection']

export function useTableRowSelection(
    props: TableProps,
    emit: (event: string, val: any) => void,
    computedRows: ComputedRef<TableRow[]>,
    getRowKey: ComputedRef<(val: string | TableRow) => any>
) {
    const selectedKeys = computed(() => {
        return props.selected
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

    const rowsSelectedNumber = computed(() => props.selected.length)

    function isRowSelected(key: string) {
        return selectedKeys.value[key] === true
    }

    function clearSelection() {
        emit('update:selected', [])
    }

    function updateSelection(
        keys: string[],
        rows: (string | TableRow)[],
        added: boolean,
        evt?: (event: string, val: any) => void
    ) {
        emit('selection', { rows, added, keys, evt })

        const payload =
            singleSelection.value === true
                ? added === true
                    ? rows
                    : []
                : added === true
                ? props.selected.concat(rows as string[])
                : props.selected.filter(
                      (row) => keys.includes(getRowKey.value(row)) === false
                  )

        emit('update:selected', payload)
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
