import { computed, ComputedRef, nextTick, ref } from 'vue-demi'
import { RecordStringAny } from '../types'

type scrollType = {
    to: number
    ref: any
    index: number
    from: number
    direction: string
}

export function useTableVirtualScroll(
    allRows: RecordStringAny[],
    infiniteLoading: boolean
) {
    const PAGE_SIZE = 50
    const LAST_PAGE_NUMBER = Math.ceil(allRows.length / PAGE_SIZE)
    const nextPageNumber = ref(2)
    const loading = ref(false)

    const rows = computed(() =>
        allRows.slice(0, PAGE_SIZE * (nextPageNumber.value - 1))
    )

    const LAST_INDEX = rows.value.length - 1
    const isNotLoading = computed(() => infiniteLoading === false)
    const isNotLastPage = computed(
        () => nextPageNumber.value < LAST_PAGE_NUMBER
    )

    const scroll = (virtualScrollData: scrollType) => {
        if (
            isNotLoading.value &&
            isNotLastPage.value &&
            virtualScrollData.to === LAST_INDEX
        ) {
            loading.value = true

            setTimeout(() => {
                nextPageNumber.value++
                nextTick(() => {
                    virtualScrollData.ref.refresh()
                    loading.value = false
                })
            }, 500)
        }
    }

    return {
        loading,
        rows,
        scroll
    }
}
