import { mount } from '@vue/test-utils'
import { mountComposition } from 'vue-composition-test-utils'
import { reactive } from 'vue-demi'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { DlTable } from '../../src/components'
import { useTableFilter } from '../../src/components/compound/DlTable/hooks/tableFilter'
import { useTableRowSelection } from '../../src/components/compound/DlTable/hooks/tableRowSelection'
import { stateManager } from '../../src/StateManager'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name' },
    { name: 'kind', label: 'Kind', field: 'kind' }
]
const ROWS = [
    { id: 1, name: 'Alpha', kind: 'x' },
    { id: 2, name: 'Beta', kind: 'y' },
    { id: 3, name: 'Gamma', kind: 'alp' }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
    vi.restoreAllMocks()
})

describe('FILTER-01: memoised search index', () => {
    const setup = (filterMethod?: Function) => {
        const rows = reactive(ROWS.map((r) => ({ ...r })))
        const cellValue = vi.fn((col: any, row: any) => row[col.field])
        const hook = mountComposition(() =>
            useTableFilter(
                { filterMethod },
                () => {},
                () => rows,
                () => COLUMNS as any,
                cellValue
            )
        ).result.current!
        return { rows, cellValue, hook }
    }

    it('reads cell values once for several keystrokes', () => {
        const { cellValue, hook } = setup()
        expect(hook.filterRows('a').map((r: any) => r.id)).toEqual([1, 2, 3])
        expect(hook.filterRows('al').map((r: any) => r.id)).toEqual([1, 3])
        expect(hook.filterRows('alp').map((r: any) => r.id)).toEqual([1, 3])
        expect(cellValue).toHaveBeenCalledTimes(ROWS.length * COLUMNS.length)
    })

    it('does not match across two columns', () => {
        const { hook } = setup()
        expect(hook.filterRows('betay')).toEqual([])
    })

    it('rebuilds the index when a row value changes', () => {
        const { rows, hook } = setup()
        expect(hook.filterRows('zeta')).toEqual([])
        rows[1].name = 'Zeta'
        expect(hook.filterRows('zeta').map((r: any) => r.id)).toEqual([2])
    })

    it('ignores an object filter without filterMethod instead of throwing', () => {
        const warn = vi
            .spyOn(stateManager.logger, 'warn')
            .mockImplementation(() => {})
        const { hook } = setup()
        expect(hook.filterRows({ status: 'x' } as any)).toHaveLength(3)
        expect(warn).toHaveBeenCalled()
    })

    it('passes an object filter to a custom filterMethod', () => {
        const filterMethod = vi.fn((rows: any[]) => rows.slice(0, 1))
        const { hook } = setup(filterMethod)
        expect(hook.filterRows({ status: 'x' } as any)).toHaveLength(1)
        expect(filterMethod).toHaveBeenCalled()
    })
})

describe('SEL-01: Set based selection', () => {
    const setup = (selected: any[]) => {
        const emit = vi.fn()
        const hook = mountComposition(() =>
            useTableRowSelection(
                { selected, selection: 'multiple' } as any,
                emit,
                { value: ROWS } as any,
                { value: (row: any) => row.id } as any
            )
        ).result.current!
        return { emit, hook }
    }

    it('does not add a row twice', () => {
        const { emit, hook } = setup([ROWS[0]])
        hook.updateSelection([1, 2] as any, [ROWS[0], ROWS[1], ROWS[1]], true)
        expect(emit).toHaveBeenLastCalledWith('update:selected', [
            ROWS[0],
            ROWS[1]
        ])
    })

    it('removes the given keys', () => {
        const { emit, hook } = setup(ROWS.slice())
        hook.updateSelection([1, 3] as any, [ROWS[0], ROWS[2]], false)
        expect(emit).toHaveBeenLastCalledWith('update:selected', [ROWS[1]])
    })

    it('deselects 5k of 10k rows within 50 ms', () => {
        const rows = Array.from({ length: 10000 }, (_, i) => ({ id: i }))
        const { emit, hook } = setup(rows)
        const toRemove = rows.slice(0, 5000)
        const start = performance.now()
        hook.updateSelection(toRemove.map((r) => r.id) as any, toRemove, false)
        expect(performance.now() - start).toBeLessThan(50)
        expect(emit.mock.lastCall[1]).toHaveLength(5000)
    })
})

describe('PERF-07: row-click without the 50 ms delay', () => {
    const mountTable = (attrs: Record<string, any> = {}) => {
        const wrapper = mount(DlTable as any, {
            props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' },
            attrs
        })
        wrappers.push(wrapper)
        return wrapper
    }

    it('emits row-click synchronously when nobody listens to row-dblclick', async () => {
        const wrapper = mountTable()
        await wrapper.find('tbody tr.dl-tr').trigger('click')
        expect(wrapper.emitted('row-click')).toHaveLength(1)
    })

    it('keeps the delay when a row-dblclick listener exists', async () => {
        const wrapper = mountTable({ onRowDblclick: () => {} })
        await wrapper.find('tbody tr.dl-tr').trigger('click')
        expect(wrapper.emitted('row-click')).toBeUndefined()
        // @ts-ignore
        await window.delay(60)
        expect(wrapper.emitted('row-click')).toHaveLength(1)
    })

    it('marks rows as clickable when a row-click listener exists', () => {
        const wrapper = mountTable({ onRowClick: () => {} })
        expect(wrapper.vm.hasAnyAction).toBe(true)
        expect(wrapper.find('tbody tr.dl-tr').classes()).toContain(
            'cursor-pointer'
        )
    })

    it('detects a row-dblclick listener (it used to look for onRowDoubleClick)', () => {
        const wrapper = mountTable({ onRowDblclick: () => {} })
        expect(wrapper.vm.hasAnyAction).toBe(true)
    })
})
