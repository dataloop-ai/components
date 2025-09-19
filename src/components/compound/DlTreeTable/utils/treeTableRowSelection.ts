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

export const useTreeTableRowSelectionEmits = ['selection', 'selected-items']

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
        selectedItemsNested.value = []
    }

    function getParentIds(childId: string): string[] {
        const rows = computedRows.value as DlTableRow[]
        const roots = Array.isArray(rows) ? rows : [rows]
        const stack = roots.map((n) => [n, []])

        while (stack.length) {
            const [node, path]: [DlTableRow, string[]] = stack.pop() as [
                DlTableRow,
                string[]
            ]
            if (node.id === childId) return path as string[]
            const children = (node as DlTableRow).children
            if (Array.isArray(children) && children.length) {
                for (let i = 0; i < children.length; i++) {
                    const c = children[i]
                    if (c) stack.push([c, path.concat(node.id)])
                }
            }
        }
        return []
    }

    function isDescendantOf(
        rows: DlTableRow[],
        parentId: string,
        targets: string[]
    ): boolean {
        if (!Array.isArray(rows)) rows = [rows]

        const targetSet = new Set(Array.isArray(targets) ? targets : [targets])
        targetSet.delete(parentId)
        if (targetSet.size === 0) return false

        const stack = rows.slice()
        let parent = null
        while (stack.length) {
            const node = stack.pop()
            if (node && node.id === parentId) {
                parent = node
                break
            }
            if (node && node.children && node.children.length)
                stack.push(...node.children)
        }
        if (!parent) return false

        const sub = (parent.children && parent.children.slice()) || []
        while (sub.length) {
            const n = sub.pop()
            if (targetSet.has(n.id)) return true
            if (n && n.children && n.children.length) sub.push(...n.children)
        }
        return false
    }

    function updateSelection(
        updatedKeys: string[],
        rows: (string | DlTableRow)[],
        added: boolean,
        evt?: (event: string, val: any) => void
    ) {
        const keys = added
            ? updatedKeys
            : [...getParentIds(updatedKeys[0]), ...updatedKeys]
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

        const { selectedItems } = convertToNestedObject(
            payload,
            getRowKey.value
        )
        selectedItemsNested.value = selectedItems

        emit('selected-items', selectedItems)
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
            if (
                isDescendantOf(
                    computedRows.value,
                    rowKeyValue,
                    originalRows.map((item) => (item as DlTableRow).id)
                )
            ) {
                return 'partial'
            }
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

    function getAllRows(rows: DlTableRow[]): DlTableRow[] {
        const allRows: DlTableRow[] = []
        for (const row of rows) {
            allRows.push(row)
            if (row.children && row.children.length > 0) {
                allRows.push(...getAllRows(row.children))
            }
        }
        return allRows
    }

    function selectAllRows(select: boolean) {
        if (select) {
            const allRows = getAllRows(computedRows.value)
            const allKeys = allRows.map(getRowKey.value)
            updateSelection(allKeys, allRows, true)
        } else {
            clearSelection()
            selectedItemsNested.value = []
            emit('selected-items', [])
        }
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
        updateSelection,
        selectAllRows
    }
}
