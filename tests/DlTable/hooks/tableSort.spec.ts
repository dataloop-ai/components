import { ComputedRef, Ref } from 'vue'
import { mountComposition } from 'vue-composition-test-utils'
import { TablePagination } from '../../../src/components/DlTable/hooks/tablePagination'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    useTableSortProps,
    useTableSort
} from '../../../src/components/DlTable/hooks/tableSort'
import { TableColumn, TableProps } from '../../../src/components/DlTable/types'

describe('useTableSortProps', () => {
    it('should validate the "columnSortOrder" prop', () => {
        expect(useTableSortProps.columnSortOrder.validator('des')).toBe(true)
    })
})

const props = {
    columnSortOrder: 'asc',
    sortMethod: void 0
} as unknown as TableProps

const pagination: TablePagination = {
    sortBy: 'field',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 50,
    maxPages: 5
}

const colList: TableColumn[] = []

const setPagination = vi.fn()

describe('useTableSort', () => {
    beforeEach(() => {
        setPagination.mockClear()
    })

    const wrapper = mountComposition(() =>
        useTableSort(
            props,
            { value: pagination } as ComputedRef<TablePagination>,
            { value: colList } as ComputedRef<TableColumn[]>,
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
