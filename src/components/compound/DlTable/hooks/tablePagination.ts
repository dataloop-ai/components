import { isNumber } from 'lodash'
import {
    ref,
    computed,
    watch,
    nextTick,
    Ref,
    ComputedRef,
    PropType
} from 'vue-demi'

export type TablePagination = {
    sortBy?: string
    descending?: boolean
    page?: number
    rowsPerPage?: number
    rowsNumber?: number
    maxPages?: number
}

function samePagination(oldPag: TablePagination, newPag: TablePagination) {
    for (const prop in newPag) {
        if (
            newPag[prop as keyof TablePagination] !==
            oldPag[prop as keyof TablePagination]
        ) {
            return false
        }
    }
    return true
}

function fixPagination(p: TablePagination) {
    if (p.page < 1) {
        p.page = 1
    }
    if (isNumber(p.rowsPerPage) && p.rowsPerPage < 1) {
        p.rowsPerPage = 0
    }
    return p
}

export const useTablePaginationProps = {
    pagination: Object as PropType<TablePagination>,
    rowsPerPageOptions: {
        type: Array,
        default: () => [5, 7, 10, 15, 20, 25, 50, 100]
    },

    'onUpdate:pagination': [Function, Array]
}

export function useTablePaginationState(
    vm: Record<string, any>,
    getCellValue: Function
) {
    const { props, emit } = vm

    const innerPagination = ref(
        Object.assign(
            {
                sortBy: null,
                descending: false,
                page: 1,
                rowsPerPage: props.virtualScroll
                    ? 0
                    : props.rowsPerPageOptions.length > 0
                    ? props.rowsPerPageOptions[0]
                    : 5,
                min: 1,
                maxPages: 0,
                boundaryNumbers: true,
                boundaryLinks: true,
                directionLinks: true,
                withQuickNavigation: true,
                itemsName: 'Rows',
                withLegend: true,
                withRowsPerPage: true,
                rowsPerPageOptions: props.virtualScroll
                    ? [0]
                    : props.rowsPerPageOptions
            },
            props.pagination
        )
    )

    watch(
        () => props.pagination,
        (pag) => {
            innerPagination.value = Object.assign(innerPagination.value, pag)
        },
        { deep: true }
    )

    const computedPagination = computed(() => {
        const pag = props['onUpdate:pagination']
            ? {
                  ...innerPagination.value,
                  ...props.pagination
              }
            : innerPagination.value

        return fixPagination(pag)
    })

    function requestServerInteraction(prop: Record<string, any> = {}) {
        nextTick(() => {
            emit('request', {
                pagination: prop.pagination || computedPagination.value,
                filter: prop.filter || props.filter,
                getCellValue
            })
        })
    }

    function setPagination(val: Record<string, any>) {
        const newPagination = fixPagination({
            ...computedPagination.value,
            ...val
        })

        if (samePagination(computedPagination.value, newPagination)) {
            return
        }

        if (props.pagination && props['onUpdate:pagination']) {
            emit('update:pagination', newPagination)
        } else {
            innerPagination.value = newPagination
        }
    }

    return {
        innerPagination,
        computedPagination,

        requestServerInteraction,
        setPagination
    }
}

export function useTablePagination(
    vm: Record<string, any>,
    computedPagination: ComputedRef<TablePagination>,
    setPagination: Function,
    filteredSortedRowsNumber: Ref<number>
) {
    const { props, emit } = vm

    const computedRowsNumber = computed(
        () =>
            computedPagination.value?.rowsNumber ??
            filteredSortedRowsNumber.value
    )

    const firstRowIndex = computed(() => {
        const { page, rowsPerPage } = computedPagination.value
        return (page - 1) * rowsPerPage
    })

    const lastRowIndex = computed(() => {
        const { page, rowsPerPage } = computedPagination.value
        return page * rowsPerPage
    })

    const isFirstPage = computed(() => computedPagination.value.page === 1)

    const pagesNumber = computed(() =>
        computedPagination.value.rowsPerPage === 0
            ? 1
            : Math.max(
                  1,
                  Math.ceil(
                      computedRowsNumber.value /
                          computedPagination.value.rowsPerPage
                  )
              )
    )

    const isLastPage = computed(() =>
        lastRowIndex.value === 0
            ? true
            : computedPagination.value.page >= pagesNumber.value
    )

    function firstPage() {
        setPagination({ page: 1 })
    }

    function prevPage() {
        const { page } = computedPagination.value
        if (page > 1) {
            setPagination({ page: page - 1 })
        }
    }

    function nextPage() {
        const { page, rowsPerPage } = computedPagination.value
        if (
            lastRowIndex.value > 0 &&
            page * rowsPerPage < computedRowsNumber.value
        ) {
            setPagination({ page: page + 1 })
        }
    }

    function lastPage() {
        setPagination({ page: pagesNumber.value })
    }

    watch(pagesNumber, (lastPage, oldLastPage) => {
        if (lastPage === oldLastPage) {
            return
        }

        const currentPage = computedPagination.value.page
        if (lastPage && !currentPage) {
            setPagination({ page: 1 })
        } else if (lastPage < currentPage) {
            setPagination({ page: lastPage })
        }
    })

    if (props['onUpdate:pagination']) {
        emit('update:pagination', { ...computedPagination.value })
    }

    return {
        firstRowIndex,
        lastRowIndex,
        isFirstPage,
        isLastPage,
        pagesNumber,
        computedRowsNumber,
        firstPage,
        prevPage,
        nextPage,
        lastPage
    }
}
