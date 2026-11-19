import { bench, describe } from 'vitest'
import { mount } from '@vue/test-utils'
import { mountComposition } from 'vue-composition-test-utils'
import { DlTable } from '../../src/components'
import { useTableSort } from '../../src/components/compound/DlTable/hooks/tableSort'
import { useTableFilter } from '../../src/components/compound/DlTable/hooks/tableFilter'
import { useTableRowSelection } from '../../src/components/compound/DlTable/hooks/tableRowSelection'
import { getCellValue } from '../../src/components/compound/DlTable/utils/getCellValue'

/**
 * PERF-08 scripting benchmarks. Run with `npm run bench`.
 * Layout/paint budgets (fps, forced layouts, long tasks) need a real browser:
 * see the "Performance" story in DlTable.stories.ts and docs in the PR.
 */

const COL_COUNT = 20
const columns = Array.from({ length: COL_COUNT }, (_, i) => ({
    name: `c${i}`,
    label: `Column ${i}`,
    field: i % 2 ? `c${i}` : `nested.c${i}`,
    sortable: true
}))

const makeRows = (n: number) =>
    Array.from({ length: n }, (_, r) => {
        const row: Record<string, any> = { id: r, nested: {} }
        for (let i = 0; i < COL_COUNT; i++) {
            const value =
                i % 3 === 0 ? (r * 7919) % 10007 : `item${(r * 31) % 977}`
            if (i % 2) row[`c${i}`] = value
            else row.nested[`c${i}`] = value
        }
        return row
    })

const rows10k = makeRows(10000)
const rows100 = makeRows(100)

const pagination = {
    value: { sortBy: 'c1', descending: false, page: 1, rowsPerPage: 0 }
} as any

const sortHook = mountComposition(() =>
    useTableSort(
        { columnSortOrder: 'asc', sortMethod: null } as any,
        pagination,
        { value: columns } as any,
        () => {}
    )
).result.current!

const filterHook = mountComposition(() =>
    useTableFilter({ filterMethod: undefined }, () => {})
).result.current!

describe('client sort, 10k rows', () => {
    bench('sort by a string column', () => {
        sortHook.computedSortMethod.value(rows10k.slice(), 'c1', false)
    })
    bench('sort by a nested column', () => {
        sortHook.computedSortMethod.value(rows10k.slice(), 'c0', true)
    })
})

const indexedFilterHook = mountComposition(() =>
    useTableFilter(
        { filterMethod: undefined },
        () => {},
        () => rows10k,
        () => columns as any,
        getCellValue
    )
).result.current!
// build the search index once, as the first keystroke does
indexedFilterHook.filterRows('i')

describe('client filter keystroke, 10k rows x 20 cols', () => {
    bench('filter (default filterMethod, no index)', () => {
        filterHook.computedFilterMethod.value(
            rows10k,
            'item12',
            columns,
            getCellValue
        )
    })
    bench('filter keystroke (table path, search index)', () => {
        indexedFilterHook.filterRows('item12')
    })
})

describe('selection, 10k rows', () => {
    const selected = rows10k.slice()
    const emit = () => {}
    const selection = mountComposition(() =>
        useTableRowSelection(
            { selected, selection: 'multiple' } as any,
            emit,
            { value: rows10k } as any,
            { value: (row: any) => row.id } as any
        )
    ).result.current!
    const toRemove = rows10k.slice(0, 5000)
    const keys = toRemove.map((r) => r.id)

    bench('deselect 5k of 10k', () => {
        selection.updateSelection(keys as any, toRemove, false)
    })
})

describe('first render, 100 rows x 20 cols (not virtual)', () => {
    bench(
        'mount + unmount',
        () => {
            const wrapper = mount(DlTable as any, {
                props: {
                    columns,
                    rows: rows100,
                    rowKey: 'id',
                    pagination: { rowsPerPage: 100 }
                }
            })
            wrapper.unmount()
        },
        { iterations: 10 }
    )
})
