import { ComputedRef, Ref } from 'vue'
import { mountComposition } from 'vue-composition-test-utils'
import { TablePagination } from '../../../src/components/compound/DlTable/hooks/tablePagination'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    useTableSortProps,
    useTableSort
} from '../../../src/components/compound/DlTable/hooks/tableSort'
import {
    DlTableColumn,
    DlTableProps
} from '../../../src/components/compound/DlTable/types'

describe('useTableSortProps', () => {
    it('should validate the "columnSortOrder" prop', () => {
        expect(useTableSortProps.columnSortOrder.validator('des')).toBe(true)
    })
})

const props = {
    columnSortOrder: 'asc',
    sortMethod: null
} as unknown as DlTableProps

const pagination: TablePagination = {
    sortBy: 'field',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 50,
    maxDisplayRange: 7
}

const colList: DlTableColumn[] = []

const setPagination = vi.fn()

describe('useTableSort', () => {
    beforeEach(() => {
        setPagination.mockClear()
    })

    const wrapper = mountComposition(() =>
        useTableSort(
            props,
            { value: pagination } as ComputedRef<TablePagination>,
            { value: colList } as ComputedRef<DlTableColumn[]>,
            setPagination
        )
    )

    const { columnToSort, computedSortMethod, sort } = wrapper.result.current!

    it('should return the expected props & methods', () => {
        expect(typeof columnToSort.value).toBe('object')
        expect(typeof computedSortMethod.value).toBe('function')
        expect(typeof sort).toBe('function')
    })
})
