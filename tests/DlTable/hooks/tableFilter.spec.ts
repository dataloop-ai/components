import { mountComposition } from 'vue-composition-test-utils'
import { useTableFilter } from '../../../src/components/compound/DlTable/hooks/tableFilter'
import { describe, it, expect, vi } from 'vitest'

const COLUMNS = [
    { name: 'name', label: 'Dessert name', field: 'name' },
    { name: 'fat', label: 'Fat (g)', field: 'fat' }
]

const ROWS = [
    { name: 'Frozen Yogurt', fat: 6, selected: [] as string[] },
    { name: 'Ice cream ', fat: 9, selected: [] as string[] },
    { name: 'Eclair', fat: 16, selected: [] as string[] }
]

function getCellValue(col: Record<string, any>, row: Record<string, any>) {
    console.log(row[col.field])

    return row[col.field]
}

const setPaginationMock = vi.fn().mockImplementation(() => {})
const filterMethodMock = vi.fn().mockImplementation(() => {})

describe('use-table-filter', () => {
    it('should filter the rows', function () {
        const wrapper = mountComposition(() =>
            useTableFilter(
                {
                    filterMethod: undefined
                },
                setPaginationMock
            )
        )

        const { computedFilterMethod } = wrapper.result.current!

        const newRows = computedFilterMethod.value(
            ROWS,
            'ec',
            COLUMNS,
            getCellValue
        )

        expect(newRows).toEqual([{ name: 'Eclair', fat: 16, selected: [] }])
    })

    it('should return a function in computed value', function () {
        const wrapper = mountComposition(() =>
            useTableFilter(
                {
                    filterMethod: filterMethodMock,
                    filter: ''
                },
                setPaginationMock
            )
        )

        expect(typeof wrapper.result.current!.computedFilterMethod.value).toBe(
            'function'
        )
    })
})
