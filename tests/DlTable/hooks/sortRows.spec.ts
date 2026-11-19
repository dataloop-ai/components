import { describe, it, expect, vi } from 'vitest'
import { sortRows } from '../../../src/components/compound/DlTable/hooks/tableSort'
import * as cellValue from '../../../src/components/compound/DlTable/utils/getCellValue'

const names = (rows: any[]) => rows.map((r) => r.id)

describe('sortRows (SORT-01)', () => {
    it('sorts nested field paths through the display accessor', () => {
        const rows = [
            { id: 'a', meta: { user: 'carol' } },
            { id: 'b', meta: { user: 'alice' } },
            { id: 'c', meta: { user: 'bob' } }
        ]
        const col = { name: 'u', label: 'u', field: 'meta.user' }
        expect(names(sortRows(rows.slice(), col, false))).toEqual([
            'b',
            'c',
            'a'
        ])
        expect(names(sortRows(rows.slice(), col, true))).toEqual([
            'a',
            'c',
            'b'
        ])
    })

    it('still sorts keys that literally contain a dot', () => {
        const rows = [
            { id: 'a', 'x.y': 2 },
            { id: 'b', 'x.y': 1 }
        ]
        const col = { name: 'x', label: 'x', field: 'x.y' }
        expect(names(sortRows(rows, col, false))).toEqual(['b', 'a'])
    })

    it('puts several null values last in both directions, keeping their order', () => {
        const rows = [
            { id: 'n1', v: null },
            { id: 'a', v: 3 },
            { id: 'n2', v: undefined },
            { id: 'b', v: 1 },
            { id: 'n3', v: null }
        ]
        const col = { name: 'v', label: 'v', field: 'v' }
        expect(names(sortRows(rows.slice(), col, false))).toEqual([
            'b',
            'a',
            'n1',
            'n2',
            'n3'
        ])
        expect(names(sortRows(rows.slice(), col, true))).toEqual([
            'a',
            'b',
            'n1',
            'n2',
            'n3'
        ])
    })

    it('honours nullsPosition: first', () => {
        const rows = [
            { id: 'a', v: 2 },
            { id: 'n', v: null },
            { id: 'b', v: 1 }
        ]
        const col = {
            name: 'v',
            label: 'v',
            field: 'v',
            nullsPosition: 'first' as const
        }
        expect(names(sortRows(rows.slice(), col, false))).toEqual([
            'n',
            'b',
            'a'
        ])
        expect(names(sortRows(rows.slice(), col, true))).toEqual([
            'n',
            'a',
            'b'
        ])
    })

    it("hands nulls to the column comparator with nullsPosition: 'comparator'", () => {
        const sort = vi.fn((a: any, b: any) => (a ?? -1) - (b ?? -1))
        const rows = [
            { id: 'a', v: 2 },
            { id: 'n', v: null }
        ]
        const col = {
            name: 'v',
            label: 'v',
            field: 'v',
            sort,
            nullsPosition: 'comparator' as const
        }
        expect(names(sortRows(rows, col, false))).toEqual(['n', 'a'])
        expect(sort).toHaveBeenCalled()
    })

    it('uses natural, accent- and case-insensitive string order', () => {
        const rows = [
            { id: 'item10', v: 'item10' },
            { id: 'item2', v: 'item2' },
            { id: 'Éclair', v: 'Éclair' },
            { id: 'donut', v: 'donut' }
        ]
        const col = { name: 'v', label: 'v', field: 'v' }
        expect(names(sortRows(rows, col, false))).toEqual([
            'donut',
            'Éclair',
            'item2',
            'item10'
        ])
    })

    it('is stable for ties', () => {
        const rows = [
            { id: 1, v: 'b' },
            { id: 2, v: 'a' },
            { id: 3, v: 'b' },
            { id: 4, v: 'a' }
        ]
        const col = { name: 'v', label: 'v', field: 'v' }
        expect(names(sortRows(rows.slice(), col, false))).toEqual([2, 4, 1, 3])
        expect(names(sortRows(rows.slice(), col, true))).toEqual([1, 3, 2, 4])
    })

    it('sorts numbers, dates and booleans by value', () => {
        const col = { name: 'v', label: 'v', field: 'v' }
        expect(
            names(
                sortRows(
                    [
                        { id: 'a', v: 10 },
                        { id: 'b', v: 9 }
                    ],
                    col,
                    false
                )
            )
        ).toEqual(['b', 'a'])
        expect(
            names(
                sortRows(
                    [
                        { id: 'a', v: new Date('2024-02-01') },
                        { id: 'b', v: new Date('2024-01-01') }
                    ],
                    col,
                    false
                )
            )
        ).toEqual(['b', 'a'])
        expect(
            names(
                sortRows(
                    [
                        { id: 'a', v: true },
                        { id: 'b', v: false }
                    ],
                    col,
                    false
                )
            )
        ).toEqual(['b', 'a'])
    })

    it('sorts with a function field', () => {
        const rows = [
            { id: 'a', n: 2 },
            { id: 'b', n: 1 }
        ]
        const col = { name: 'v', label: 'v', field: (row: any) => row.n }
        expect(names(sortRows(rows, col, false))).toEqual(['b', 'a'])
    })
})

describe('sortRows (SORT-02)', () => {
    it('reads each row value exactly once', () => {
        const spy = vi.spyOn(cellValue, 'getFieldValue')
        const rows = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            v: (i * 7919) % 1000
        }))
        sortRows(rows, { name: 'v', label: 'v', field: 'v' }, false)
        expect(spy).toHaveBeenCalledTimes(1000)
        spy.mockRestore()
    })
})
