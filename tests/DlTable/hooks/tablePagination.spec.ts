import { ComputedRef, Ref } from 'vue'
import { mountComposition, nextTick } from 'vue-composition-test-utils'
import {
    useTablePaginationState,
    useTablePagination,
    TablePagination
} from '../../../src/components/DlTable/hooks/tablePagination'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const pagination = {
    sortBy: 'field',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 50,
    maxPages: 5
}

const emitFn = vi.fn()
const getCellValue = vi.fn()

const vm = {
    props: {
        rowsPerPageOptions: [10, 25, 100],
        pagination,
        'onUpdate:pagination': vi.fn(),
        filter: () => 'value'
    },
    emit: emitFn
}

describe('useTablePaginationState', () => {
    beforeEach(() => {
        emitFn.mockClear()
    })

    const wrapper = mountComposition(() =>
        useTablePaginationState(vm, getCellValue)
    )

    const {
        innerPagination,
        computedPagination,
        requestServerInteraction,
        setPagination
    } = wrapper.result.current!

    it('should return the expected pagination state', () => {
        expect(typeof innerPagination).toBe('object')
        expect(typeof computedPagination).toBe('object')
        expect(typeof requestServerInteraction).toBe('function')
        expect(typeof setPagination).toBe('function')
    })

    describe('setPagination', () => {
        describe('when the same pagination is provided', () => {
            it('should not emit the "update:pagination" event', () => {
                const newPagination = { ...pagination }
                setPagination(newPagination)
                expect(emitFn).not.toHaveBeenCalled()
            })
        })

        describe('otherwise', () => {
            it('should fix the wrong pagination params and emit the "update:pagination" event', () => {
                const newPagination = {
                    ...pagination,
                    page: -1,
                    maxPages: 8,
                    rowsPerPage: -20
                }
                setPagination(newPagination)
                expect(emitFn).toHaveBeenCalledWith('update:pagination', {
                    boundaryLinks: true,
                    boundaryNumbers: true,
                    descending: false,
                    directionLinks: true,
                    itemsName: 'Rows',
                    maxPages: 8,
                    min: 1,
                    page: 1,
                    rowsNumber: 50,
                    rowsPerPage: 0,
                    sortBy: 'field',
                    withLegend: true,
                    withQuickNavigation: true,
                    withRowsPerPage: true
                })
            })
        })

        describe('when pagination event is not provided', () => {
            const localWrapper = mountComposition(() =>
                useTablePaginationState(
                    {
                        ...vm,
                        props: { ...vm.props, 'onUpdate:pagination': undefined }
                    },
                    getCellValue
                )
            )

            it('should set the inner pagination with new pagination', () => {
                const { innerPagination, setPagination } =
                    localWrapper.result.current!
                setPagination({ ...pagination, page: 6 })

                expect(innerPagination.value.page).toBe(6)
            })
        })
    })

    describe('requestServerInteraction', () => {
        it('should emit the "request" event', async () => {
            requestServerInteraction({})
            await nextTick(() => {})
            expect(emitFn).toHaveBeenCalledWith(
                'request',
                expect.objectContaining({})
            )
        })
    })
})

describe('useTablePagination', () => {
    const computedPagination = {
        value: { page: 1, rowsPerPage: 10 }
    } as ComputedRef<TablePagination>

    const wrapper = mountComposition(() =>
        useTablePagination(vm, computedPagination, vi.fn(), {
            value: 10
        } as Ref<number>)
    )

    const {
        firstRowIndex,
        lastRowIndex,
        isFirstPage,
        isLastPage,
        pagesNumber,
        computedRowsNumber
    } = wrapper.result.current!

    it('should return the expected pagination props', () => {
        expect(typeof firstRowIndex.value).toBe('number')
        expect(typeof lastRowIndex.value).toBe('number')
        expect(typeof isFirstPage.value).toBe('boolean')
        expect(typeof isLastPage.value).toBe('boolean')
        expect(typeof pagesNumber.value).toBe('number')
        expect(typeof computedRowsNumber.value).toBe('number')
    })

    describe('lastRowIndex', () => {
        it('should depend on page & rowsPerPage', () => {
            expect(lastRowIndex.value).toBe(10) // page * rowsPerPage
        })
    })
})
