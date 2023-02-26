import { computed, ComputedRef } from 'vue-demi'

import { isNumber } from '../../../utils/is'
import { TableProps, TableColumn, TableRow } from '../types'
import { TablePagination } from './tablePagination'

export const useTableColumnSelectionProps = {
    visibleColumns: Array
}

export function useTableColumnSelection(
    props: TableProps,
    computedPagination: ComputedRef<TablePagination>,
    hasSelectionMode: ComputedRef<boolean>,
    hasDraggableRows: ComputedRef<boolean>
) {
    const colList = computed(() => {
        if (props.columns !== void 0) {
            return props.columns
        }

        // we infer columns from first row
        const row = props.rows[0]

        return (
            row !== void 0
                ? Object.keys(row).map((name) => ({
                      name,
                      label: name.toUpperCase(),
                      field: name,
                      align: isNumber(row[name]) ? 'right' : 'left',
                      sortable: true
                  }))
                : []
        ) as TableColumn[]
    })

    const computedCols = computed(() => {
        const { sortBy, descending } = computedPagination.value

        const cols =
            props.visibleColumns !== void 0
                ? colList.value.filter(
                      (col) =>
                          col.required === true ||
                          props.visibleColumns.includes(col.name) === true
                  )
                : colList.value

        const updatedCols = cols.map((col) => {
            const align = col.align || 'right'
            const alignClass = `text-${align}`

            return {
                ...col,
                align,
                iconClass: `dl-table__sort-icon dl-table__sort-icon--${align}`,
                thClass:
                    alignClass +
                    (col.headerClasses !== void 0
                        ? ' ' + col.headerClasses
                        : '') +
                    (col.sortable === true ? ' sortable' : '') +
                    (col.name === sortBy
                        ? ` sorted ${descending === true ? 'sort-desc' : ''}`
                        : ''),

                tdStyle:
                    col.style !== void 0
                        ? typeof col.style !== 'function'
                            ? () => col.style
                            : col.style
                        : () => '',

                tdClass:
                    col.classes !== void 0
                        ? typeof col.classes !== 'function'
                            ? () => alignClass + ' ' + col.classes
                            : (row: TableRow) =>
                                  alignClass +
                                  ' ' +
                                  (col.classes as Function)(row)
                        : () => alignClass
            }
        })

        return updatedCols
    })

    const computedColsMap = computed(() => {
        const names: Record<string, TableColumn> = {}
        computedCols.value.forEach((col) => {
            names[col.name] = col
        })
        return names
    })

    const computedColspan = computed(() => {
        return props.tableColspan !== void 0
            ? props.tableColspan
            : computedCols.value.length +
                  (hasSelectionMode.value === true ? 1 : 0) +
                  (hasDraggableRows.value === true ? 1 : 0)
    })

    return {
        colList,
        computedCols,
        computedColsMap,
        computedColspan
    }
}
