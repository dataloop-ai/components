import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { DlTable, DlTd } from '../../src/components'

const makeColumns = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
        name: `c${i}`,
        label: `C${i}`,
        field: `c${i}`
    }))

const makeRows = (n: number, cols: number) =>
    Array.from({ length: n }, (_, r) => {
        const row: Record<string, any> = { id: r }
        for (let i = 0; i < cols; i++) row[`c${i}`] = `${r}-${i}`
        return row
    })

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
    vi.restoreAllMocks()
})

const countObservers = (rows: number, cols = 15) => {
    const OriginalRO = window.ResizeObserver
    let created = 0
    window.ResizeObserver = class extends OriginalRO {
        constructor(cb: ResizeObserverCallback) {
            super(cb)
            created++
        }
    } as any
    try {
        wrappers.push(
            mount(DlTable as any, {
                props: {
                    columns: makeColumns(cols),
                    rows: makeRows(rows, cols),
                    rowKey: 'id',
                    pagination: { rowsPerPage: rows }
                }
            })
        )
    } finally {
        window.ResizeObserver = OriginalRO
    }
    return created
}

describe('PERF-01: no ResizeObserver per body cell', () => {
    it('creates the same number of observers for 1 and 100 rows', () => {
        const withOneRow = countObservers(1)
        const withHundredRows = countObservers(100)
        expect(withHundredRows).toBe(withOneRow)
    })
})

describe('PERF-01: lazy truncation tooltip', () => {
    const mountCell = () => {
        const wrapper = mount(DlTd as any, {
            slots: { default: 'a very long text' },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        return wrapper
    }

    it('shows no tooltip for a cell that is not truncated', async () => {
        const wrapper = mountCell()
        await wrapper.trigger('pointerenter')
        expect(wrapper.vm.hasEllipsis).toBe(false)
    })

    it('shows the tooltip once a truncated cell is hovered', async () => {
        const wrapper = mountCell()
        const el = wrapper.element as HTMLElement
        vi.spyOn(el, 'offsetWidth', 'get').mockReturnValue(50)
        vi.spyOn(el, 'scrollWidth', 'get').mockReturnValue(200)
        expect(wrapper.vm.hasEllipsis).toBe(false)
        await wrapper.trigger('pointerenter')
        expect(wrapper.vm.hasEllipsis).toBe(true)
        expect(wrapper.findComponent({ name: 'DlTooltip' }).exists()).toBe(true)
    })
})
