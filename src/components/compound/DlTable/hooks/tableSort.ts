import { computed, ComputedRef } from 'vue-demi'

import { sortDate } from '../../../../utils/sort'
import { isNumber, isDate, isObject } from '../../../../utils/is'
import {
    DlTableProps,
    DlTableColumn,
    DlTableRow,
    DlTableSortMethod
} from '../types'
import { TablePagination } from './tablePagination'
import { getFieldValue } from '../utils/getCellValue'
import { isUndefined } from 'lodash'

export const useTableSortProps = {
    sortMethod: Function,
    binaryStateSort: Boolean,
    columnSortOrder: {
        type: String,
        validator: (v: string) => v === 'asc' || v === 'des',
        default: 'asc'
    }
}

let collator: Intl.Collator = null
const getCollator = () => {
    if (!collator) {
        collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        })
    }
    return collator
}

const isNil = (v: any) => v === null || isUndefined(v)

function compareValues(A: any, B: any) {
    if (isNumber(A) && isNumber(B)) return A - B
    if (isDate(A) && isDate(B)) return sortDate(A, B)
    if (typeof A === 'boolean' && typeof B === 'boolean') {
        return Number(A) - Number(B)
    }
    return getCollator().compare(String(A), String(B))
}

/**
 * Sorts in place and returns `data`. Reads each row's value once
 * (decorate-sort-undecorate) through the same accessor the cell displays.
 * Nulls go last in both directions unless `col.nullsPosition` says otherwise
 * ('comparator' hands nulls to `col.sort`). Ties keep their original order.
 */
export function sortRows(
    data: DlTableRow[],
    col: DlTableColumn,
    descending: boolean
) {
    const dir = descending ? -1 : 1
    const nulls = col.nullsPosition ?? 'last'
    const decorated = data.map((row, index) => ({
        row,
        index,
        value: getFieldValue(col, row)
    }))

    decorated.sort((a, b) => {
        const A = a.value
        const B = b.value
        if (nulls !== 'comparator') {
            const aNil = isNil(A)
            const bNil = isNil(B)
            if (aNil || bNil) {
                if (aNil && bNil) return a.index - b.index
                return (aNil ? 1 : -1) * (nulls === 'first' ? -1 : 1)
            }
        }
        const result = col.sort
            ? col.sort(A, B, a.row, b.row)
            : compareValues(A, B)
        return result * dir || a.index - b.index
    })

    for (let i = 0; i < decorated.length; i++) {
        data[i] = decorated[i].row
    }
    return data
}

export function useTableSort(
    props: DlTableProps,
    computedPagination: ComputedRef<TablePagination>,
    colList: ComputedRef<DlTableColumn[]>,
    setPagination: Function
) {
    const columnToSort = computed(() => {
        const { sortBy } = computedPagination.value

        return sortBy
            ? colList.value.find((def) => def.name === sortBy) || null
            : null
    })

    const computedSortMethod = computed(() => {
        if (props.sortMethod) {
            return props.sortMethod
        }

        const sortMethod: DlTableSortMethod = (data, sortBy, descending) => {
            const col = colList.value.find((def) => def.name === sortBy)
            if (isUndefined(col) || isUndefined(col.field)) {
                return data
            }
            return sortRows(data, col, descending === true)
        }

        return sortMethod
    })

    function sort(col: string | DlTableColumn) {
        let sortOrder: DlTableProps['columnSortOrder'] = props.columnSortOrder

        if (isObject(col) === true) {
            if ((col as DlTableColumn).sortOrder) {
                sortOrder = (col as DlTableColumn).sortOrder
            }

            col = (col as DlTableColumn).name
        } else {
            const def = colList.value.find((def) => def.name === col)
            if (def && def.sortOrder) {
                sortOrder = def.sortOrder
            }
        }

        let { sortBy, descending } = computedPagination.value

        if (sortBy !== col) {
            sortBy = col as string
            descending = sortOrder === 'des'
        } else if (props.binaryStateSort === true) {
            descending = !descending
        } else if (descending === true) {
            if (sortOrder === 'asc') {
                sortBy = null
            } else {
                descending = false
            }
        } else {
            // ascending
            if (sortOrder === 'asc') {
                descending = true
            } else {
                sortBy = null
            }
        }

        setPagination({ sortBy, descending, page: 1 })
    }

    return {
        columnToSort,
        computedSortMethod,
        sort
    }
}
