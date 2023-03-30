import { computed, ComputedRef } from 'vue-demi'

import { sortDate } from '../../../../utils/sort'
import { isNumber, isDate, isObject } from '../../../../utils/is'
import { DlTableProps, DlTableColumn, DlTableSortMethod } from '../types'
import { TablePagination } from './tablePagination'

export const useTableSortProps = {
    sortMethod: Function,
    binaryStateSort: Boolean,
    columnSortOrder: {
        type: String,
        validator: (v: string) => v === 'asc' || v === 'des',
        default: 'asc'
    }
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

    const computedSortMethod = computed(() =>
        props.sortMethod !== void 0
            ? props.sortMethod
            : (((data, sortBy, descending) => {
                  const col = colList.value.find((def) => def.name === sortBy)
                  if (col === void 0 || col.field === void 0) {
                      return data
                  }

                  const dir = descending === true ? -1 : 1
                  const val =
                      typeof col.field === 'function'
                          ? (v: string) => (col.field as Function)(v)
                          : (v: Record<string, any>) => v[col.field as string]

                  return data.sort((a: any, b: any) => {
                      let A = val(a)
                      let B = val(b)

                      if (A === null || A === void 0) {
                          return -1 * dir
                      }
                      if (B === null || B === void 0) {
                          return 1 * dir
                      }
                      if (col.sort !== void 0) {
                          return col.sort(A, B, a, b) * dir
                      }
                      if (isNumber(A) === true && isNumber(B) === true) {
                          return (A - B) * dir
                      }
                      if (isDate(A) === true && isDate(B) === true) {
                          return sortDate(A, B) * dir
                      }
                      if (typeof A === 'boolean' && typeof B === 'boolean') {
                          return (Number(A) - Number(B)) * dir
                      }

                      [A, B] = [A, B].map((s) =>
                          (s + '').toLocaleString().toLowerCase()
                      )

                      return A < B ? -1 * dir : A === B ? 0 : dir
                  })
              }) as DlTableSortMethod)
    )

    function sort(col: string | DlTableColumn) {
        let sortOrder: DlTableProps['columnSortOrder'] = props.columnSortOrder

        if (isObject(col) === true) {
            if ((col as DlTableColumn).sortOrder) {
                sortOrder = (col as DlTableColumn).sortOrder
            }

            col = (col as DlTableColumn).name
        } else {
            const def = colList.value.find((def) => def.name === col)
            if (def !== void 0 && def.sortOrder) {
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
