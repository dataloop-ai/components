import { computed, ComputedRef } from 'vue-demi'

import { isNumber } from '../../../../utils/is'
import { DlTableProps, DlTableColumn, DlTableRow } from '../types'
import { TablePagination } from './tablePagination'

export const useTableColumnSelectionProps = {
    visibleColumns: Array
}

export function useTableColumnSelection(
    props: DlTableProps,
    computedPagination: ComputedRef<TablePagination>,
    hasSelectionMode: ComputedRef<boolean>,
    hasDraggableRows: ComputedRef<boolean>
) {
    const colList = computed(() => {
        if (props.columns) {
            return props.columns
        }

        // we infer columns from first row
        const row = props.rows[0]
        const list: DlTableColumn[] = []
        if (row) {
            for (const key of Object.keys(row)) {
                list.push({
                    name: key,
                    label: key.toUpperCase(),
                    field: key,
                    align: isNumber(row[key]) ? 'right' : 'left',
                    sortable: true
                })
            }
        }

        return list
    })

    const computedCols = computed(() => {
        const { sortBy, descending } = computedPagination.value

        const cols = props.visibleColumns
            ? colList.value.filter(
                  (col) =>
                      col.required === true ||
                      props.visibleColumns.includes(col.name) === true
              )
            : colList.value

        const updatedCols = cols.map((col) => {
            const align = col.align || 'right'
            const alignClass = ` text-${align}`

            return {
                ...col,
                align,
                iconClass: `dl-table__sort-icon dl-table__sort-icon--${align}`,
                thClass:
                    alignClass +
                    (col.headerClasses ? ' ' + col.headerClasses : '') +
                    (col.sortable === true ? ' sortable' : '') +
                    (col.name === sortBy
                        ? ` sorted ${descending === true ? 'sort-desc' : ''}`
                        : ''),

                tdStyle: col.style
                    ? typeof col.style !== 'function'
                        ? () => col.style
                        : col.style
                    : () => '',

                tdClass: col.classes
                    ? typeof col.classes !== 'function'
                        ? () => alignClass + ' ' + col.classes
                        : (row: DlTableRow) =>
                              alignClass + ' ' + (col.classes as Function)(row)
                    : () => alignClass
            }
        })

        return updatedCols
    })

    const computedColsMap = computed(() => {
        const names: Record<string, DlTableColumn> = {}
        computedCols.value.forEach((col) => {
            names[col.name] = col
        })
        return names
    })

    const computedColspan = computed(() => {
        return props.tableColspan
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
