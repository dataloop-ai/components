import { ref, computed, watchEffect } from 'vue-demi'
import { DlTableRow } from '../../types'

export function useNestedTableFilter(
    rows: DlTableRow[],
    filerCriteria: (item: DlTableRow) => boolean
) {
    const nestedRows = ref<DlTableRow[]>(rows)
    const criteria = ref(filerCriteria)

    const nestedSearch = (
        array: DlTableRow[],
        criteria: (item: DlTableRow) => boolean
    ): DlTableRow[] => {
        const result = []
        const stack = [...array]
        while (stack.length) {
            const item = stack.pop()
            if (criteria(item)) {
                result.push(item)
            }
            if (item.children) {
                stack.push(...item.children)
            }
        }
        return result
    }

    const filteredRows = computed(() => {
        return nestedSearch(nestedRows.value, criteria.value)
    })

    watchEffect(() => {
        nestedSearch(nestedRows.value, criteria.value)
    })

    return {
        filteredRows
    }
}
