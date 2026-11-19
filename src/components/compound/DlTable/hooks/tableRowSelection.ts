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
    const selectedKeys = computed(
        () => new Set<any>(props.selected.map(getRowKey.value))
    )

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
            computedRows.value.every((row) =>
                selectedKeys.value.has(getRowKey.value(row))
            )
    )

    const someRowsSelected = computed(() => {
        if (allRowsSelected.value === true) return false
        const stack = computedRows.value.slice()
        while (stack.length) {
            const row = stack.pop()
            if (selectedKeys.value.has(getRowKey.value(row))) return true
            if (row.children && row.children.length) {
                stack.push(...row.children)
            }
        }
        return false
    })
    const rowsSelectedNumber = computed(() => props.selected.length)

    function isRowSelected(key: string) {
        return selectedKeys.value.has(key)
    }

    function addRows(rows: (string | DlTableRow)[]) {
        const seen = new Set(selectedKeys.value)
        const added = rows.filter((row) => {
            const key = getRowKey.value(row)
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
        return props.selected.concat(added as string[])
    }

    function removeKeys(keys: string[]) {
        const toRemove = new Set(keys)
        return props.selected.filter(
            (row) => !toRemove.has(getRowKey.value(row))
        )
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
                ? addRows(rows)
                : removeKeys(keys)

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
