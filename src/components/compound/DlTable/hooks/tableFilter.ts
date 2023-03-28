import { computed, watch, nextTick } from 'vue-demi'
import { TableProps, FilterMethod } from '../types'

export const useTableFilterProps = {
    filter: [String, Object],
    filterMethod: Function
}

export function useTableFilter(props: any, setPagination: Function) {
    const computedFilterMethod = computed(
        () =>
            (props.filterMethod !== void 0
                ? props.filterMethod
                : (rows, filterTerms, cols, cellValue) => {
                      const lowerTerms = filterTerms
                          ? filterTerms.toLowerCase()
                          : ''
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
                  }) as FilterMethod
    )

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
