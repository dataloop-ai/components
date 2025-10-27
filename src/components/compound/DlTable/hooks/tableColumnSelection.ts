import { computed, ComputedRef, PropType, Ref } from 'vue-demi'

import { isNumber } from '../../../../utils/is'
import { DlTableProps, DlTableColumn, DlTableRow } from '../types'
import { TablePagination } from './tablePagination'

export const useTableColumnSelectionProps = {
    visibleColumns: {
        type: Array as PropType<string[]>,
        required: false,
        default: null as any
    }
}

export function useTableColumnSelection(
    props: DlTableProps,
    computedPagination: ComputedRef<TablePagination>,
    hasSelectionMode: ComputedRef<boolean>,
    hasDraggableRows: ComputedRef<boolean>,
    visibleColumnsState: Ref
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
        const cols =
            visibleColumnsState?.value && visibleColumnsState?.value?.length
                ? colList.value.filter(
                      (col) =>
                          col.required === true ||
                          visibleColumnsState.value.includes(col.name) === true
                  )
                : colList.value

        const updatedCols = cols.map((col) => {
            const align = col.align || 'left'
            const alignClass = ` text-${align}`

            const transform: string = col.textTransform || 'default'
            const textTransformClass: string = ` dl-text-transform--${transform}`

            const headerClass: string = col.headerClasses
                ? ` ${col.headerClasses}`
                : ''
            const sortableClass: string =
                col.sortable === true ? ' sortable' : ''
            const sortOrderClass: string =
                col.name === sortBy
                    ? ` sorted ${descending === true ? 'sort-desc' : ''}`
                    : ''

            return {
                ...col,
                align,
                iconClass: `dl-table__sort-icon dl-table__sort-icon--${align}`,
                thClass:
                    alignClass + headerClass + sortableClass + sortOrderClass,
                tdStyle: assignTdStyles(col),
                tdClass: assignTdClasses(col, alignClass, textTransformClass)
            }
        })

        return updatedCols
    })

    const assignTdStyles = (col: any) => {
        if (!col.style) {
            return () => ''
        }

        if (typeof col.style !== 'function') {
            return () => col.style
        }

        return col.style
    }

    const assignTdClasses = (
        col: any,
        alignClass: string,
        textTransformClass: string
    ) => {
        if (!col.classes) {
            return () => alignClass + textTransformClass
        }

        if (typeof col.classes !== 'function') {
            return () => alignClass + ' ' + col.classes + textTransformClass
        }

        return (row: DlTableRow) =>
            alignClass +
            textTransformClass +
            ' ' +
            (col.classes as Function)(row)
    }

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
                  1 +
                  (props.isTreeTable ? 1 : 0)
    })

    return {
        colList,
        computedCols,
        computedColsMap,
        computedColspan
    }
}
