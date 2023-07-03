import { computed, watch, nextTick } from 'vue-demi'
import {
    DlTableProps,
    DlTableFilterMethod,
    DlTableRow,
    DlTableFilter,
    DlTableColumn
} from '../types'

export const useTableFilterProps = {
    filter: [String, Object],
    filterMethod: Function
}

export function useTableFilter(props: any, setPagination: Function) {
    const computedFilterMethod = computed(() => {
        if (props.filterMethod) {
            return props.filterMethod
        }

        const tableFilter: DlTableFilterMethod = (
            rows: DlTableRow[],
            filterTerms: DlTableFilter,
            cols: DlTableColumn[],
            cellValue: (col: DlTableColumn, row: DlTableRow) => any
        ) => {
            const lowerTerms = filterTerms ? filterTerms.toLowerCase() : ''
            return rows.filter((row) =>
                cols.some((col) => {
                    const val = cellValue(col, row) + ''
                    const haystack =
                        val === 'undefined' || val === 'null'
                            ? ''
                            : val.toLowerCase()
                    return haystack.indexOf(lowerTerms) !== -1
                })
            )
        }

        return tableFilter
    })

    watch(
        () => props.filter,
        () => {
            nextTick(() => {
                setPagination({ page: 1 }, true)
            })
        },
        { deep: true }
    )

    return { computedFilterMethod }
}
