import { ref, computed, watchEffect } from 'vue'
import { DlTableRow } from '../../types'

export function useNestedTableFilter(
    items: DlTableRow[],
    filerCriteria: (item: DlTableRow) => boolean
) {
    const nestedItems = ref<DlTableRow[]>(items)
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
        return recursiveSearch(nestedItems.value, criteria.value)
    })

    watchEffect(() => {
        recursiveSearch(nestedItems.value, criteria.value)
    })

    return {
        filteredRows,
        setCriteria: (newCriteria: (item: DlTableRow) => boolean) => {
            criteria.value = newCriteria
        },
        setItems: (newItems: DlTableRow[]) => {
            nestedItems.value = newItems
        }
    }
}
