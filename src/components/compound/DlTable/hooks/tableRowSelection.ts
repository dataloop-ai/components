import { computed, ComputedRef } from 'vue-demi'
import { DlTableProps, DlTableRow } from '../types'

export const useTableRowSelectionProps = {
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

export const useTableRowSelectionEmits = ['update:selected', 'selection']

export function useTableRowSelection(
    props: DlTableProps,
    emit: (event: string, val: any) => void,
    computedRows: ComputedRef<DlTableRow[]>,
    getRowKey: ComputedRef<(val: string | DlTableRow) => any>
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

    const someRowsSelected = computed(() => {
        if (allRowsSelected.value === true) return false
        const stack = computedRows.value.slice()
        while (stack.length) {
            const row = stack.pop()
            if (selectedKeys.value[getRowKey.value(row)] === true) return true
            if (row.children && row.children.length) {
                stack.push(...row.children)
            }
        }
        return false
    })
    const rowsSelectedNumber = computed(() => props.selected.length)

    function isRowSelected(key: string) {
        return selectedKeys.value[key] === true
    }

    function clearSelection() {
        emit('update:selected', [])
    }

    function updateSelection(
        keys: string[],
        rows: (string | DlTableRow)[],
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
