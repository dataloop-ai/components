import { ref, computed, watchEffect } from 'vue'
import { DlTableRow } from '../../types'

export function useNestedTableFilter(
    rows: DlTableRow[],
    filerCriteria: (item: DlTableRow) => boolean
) {
    const nestedRows = ref<DlTableRow[]>(rows)
    const criteria = ref(filerCriteria)

    const recursiveSearch = (
        array: DlTableRow[],
        criteria: (item: DlTableRow) => boolean
    ): DlTableRow[] => {
        return array.reduce((result: DlTableRow[], item: DlTableRow) => {
            if (criteria(item)) {
                result.push(item)
            }
            if (item.children) {
                result.push(...recursiveSearch(item.children, criteria))
            }
            return result
        }, [])
    }

    const filteredRows = computed(() => {
        return recursiveSearch(nestedRows.value, criteria.value)
    })

    watchEffect(() => {
        recursiveSearch(nestedRows.value, criteria.value)
    })

    return {
        filteredRows
    }
}
