import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { DlTable } from '../../src/components'
import { moveName } from '../../src/components/compound/DlTable/hooks/useColumnDrag'

const COLUMNS = [
    { name: 'a', label: 'A', field: 'a' },
    { name: 'b', label: 'B', field: 'b' },
    { name: 'c', label: 'C', field: 'c' }
]
const ROWS = [
    { id: 1, a: 'a1', b: 'b1', c: 'c1' },
    { id: 2, a: 'a2', b: 'b2', c: 'c2' },
    { id: 3, a: 'a3', b: 'b3', c: 'c3' }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
    vi.restoreAllMocks()
})

const mountTable = async (props: Record<string, any> = {}) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'id', ...props },
        attachTo: document.body
    })
    wrappers.push(wrapper)
    await wrapper.vm.$nextTick()
    return wrapper
}

const headerLabels = (wrapper: any) =>
    wrapper
        .findAll('.dl-table__middle thead th[data-col-index]')
        .map((th: any) => th.text())

const pointer = (type: string, init: Record<string, any> = {}) =>
    new MouseEvent(type, { bubbles: true, cancelable: true, ...init })

describe('moveName', () => {
    it('moves a name to the position of another', () => {
        expect(moveName(['a', 'b', 'c'], 'a', 'c')).toEqual(['b', 'c', 'a'])
        expect(moveName(['a', 'b', 'c'], 'c', 'a')).toEqual(['c', 'a', 'b'])
        expect(moveName(['a', 'b'], 'x', 'a')).toEqual(['a', 'b'])
    })
})

describe('PERF-05: column reorder without remount', () => {
    it('keeps the root and tbody nodes and the new order', async () => {
        const wrapper = await mountTable({ draggable: 'columns' })
        const root = wrapper.element
        const tbody = wrapper.find('tbody.dl-virtual-scroll__content').element
        wrapper.vm.reorderColumns(0, 2)
        await wrapper.vm.$nextTick()
        expect(wrapper.element).toBe(root)
        expect(wrapper.find('tbody.dl-virtual-scroll__content').element).toBe(
            tbody
        )
        expect(headerLabels(wrapper)).toEqual(['B', 'C', 'A'])
        const reorder = wrapper.emitted('col-reorder') as any[][]
        expect(reorder[0][0].map((c: any) => c.name)).toEqual(['b', 'c', 'a'])
        expect(wrapper.emitted('col-update')).toHaveLength(1)
    })

    it('keeps the scroll position of the table', async () => {
        const wrapper = await mountTable({ draggable: 'columns' })
        const scroller = wrapper.find('.dl-table__middle')
            .element as HTMLElement
        scroller.scrollLeft = 40
        wrapper.vm.reorderColumns(0, 1)
        await wrapper.vm.$nextTick()
        expect(
            (wrapper.find('.dl-table__middle').element as HTMLElement)
                .scrollLeft
        ).toBe(40)
    })

    it('follows the consumer when it passes the reordered columns back', async () => {
        const wrapper = await mountTable({ draggable: 'columns' })
        wrapper.vm.reorderColumns(0, 2)
        await wrapper.vm.$nextTick()
        const reordered = (wrapper.emitted('col-reorder') as any[][])[0][0]
        await wrapper.setProps({ columns: reordered })
        expect(headerLabels(wrapper)).toEqual(['B', 'C', 'A'])
        await wrapper.setProps({ columns: COLUMNS })
        expect(headerLabels(wrapper)).toEqual(['A', 'B', 'C'])
    })

    it('keeps hidden columns in their slot', async () => {
        const wrapper = await mountTable({
            draggable: 'columns',
            visibleColumns: ['a', 'c']
        })
        wrapper.vm.reorderColumns(0, 1)
        await wrapper.vm.$nextTick()
        const reorder = wrapper.emitted('col-reorder') as any[][]
        expect(reorder[0][0].map((c: any) => c.name)).toEqual(['c', 'b', 'a'])
    })
})

describe('column drag with the pointer', () => {
    it('previews the new order while dragging and emits on drop', async () => {
        const wrapper = await mountTable({ draggable: 'columns' })
        const ths = wrapper.findAll('thead th[data-col-index]')
        const target = ths[2].element
        ;(document as any).elementFromPoint = vi.fn(() => target)
        const source = ths[0].element
        source.dispatchEvent(
            pointer('pointerdown', { clientX: 10, clientY: 10, button: 0 })
        )
        source.dispatchEvent(
            pointer('pointermove', { clientX: 250, clientY: 10 })
        )
        await wrapper.vm.$nextTick()
        expect(headerLabels(wrapper)).toEqual(['B', 'C', 'A'])
        expect(wrapper.emitted('col-reorder')).toBeUndefined()
        // the pointer is captured on <thead>: the source <th> may be re-rendered
        wrapper
            .find('.dl-table__middle thead')
            .element.dispatchEvent(
                pointer('pointerup', { clientX: 250, clientY: 10 })
            )
        await wrapper.vm.$nextTick()
        expect(
            (wrapper.emitted('col-reorder') as any[][])[0][0].map(
                (c: any) => c.name
            )
        ).toEqual(['b', 'c', 'a'])
        // the floating clone is gone and the dropped order stays
        expect(wrapper.find('.dl-table__drag').element.children).toHaveLength(0)
        expect(headerLabels(wrapper)).toEqual(['B', 'C', 'A'])
    })

    it('treats a short press as a click (sorts, no drag)', async () => {
        const wrapper = await mountTable({
            draggable: 'columns',
            columns: COLUMNS.map((c) => ({ ...c, sortable: true }))
        })
        const th = wrapper.find('thead th[data-col-index="1"]')
        th.element.dispatchEvent(
            pointer('pointerdown', { clientX: 10, clientY: 10, button: 0 })
        )
        th.element.dispatchEvent(
            pointer('pointermove', { clientX: 12, clientY: 10 })
        )
        th.element.dispatchEvent(
            pointer('pointerup', { clientX: 12, clientY: 10 })
        )
        await th.trigger('click')
        expect(wrapper.emitted('col-reorder')).toBeUndefined()
        expect(wrapper.vm.computedPagination.sortBy).toBe('b')
    })

    it('does nothing when columns are not draggable', async () => {
        const wrapper = await mountTable({ draggable: 'none' })
        const ths = wrapper.findAll('thead th[data-col-index]')
        ;(document as any).elementFromPoint = vi.fn(() => ths[2].element)
        ths[0].element.dispatchEvent(
            pointer('pointerdown', { clientX: 10, clientY: 10, button: 0 })
        )
        ths[0].element.dispatchEvent(
            pointer('pointermove', { clientX: 250, clientY: 10 })
        )
        ths[0].element.dispatchEvent(
            pointer('pointerup', { clientX: 250, clientY: 10 })
        )
        await wrapper.vm.$nextTick()
        expect(headerLabels(wrapper)).toEqual(['A', 'B', 'C'])
    })
})

describe('PERF-05: row reorder without remount', () => {
    it('keeps the tbody node and lets Vue apply the order', async () => {
        const wrapper = await mountTable({ draggable: 'rows' })
        const tbody = wrapper.find('tbody.dl-virtual-scroll__content')
            .element as HTMLElement
        const rowsBefore = Array.from(tbody.children)
        // what SortableJS does: move the first row after the third
        const moved = rowsBefore[0]
        tbody.removeChild(moved)
        tbody.appendChild(moved)
        wrapper.vm.handleSortableEvent({
            oldIndex: 0,
            newIndex: 2,
            item: moved,
            from: tbody
        })
        // the DOM is back in the rendered order until the consumer updates rows
        expect(Array.from(tbody.children)).toEqual(rowsBefore)
        const reordered = (wrapper.emitted('row-reorder') as any[][])[0][0]
        expect(reordered.map((r: any) => r.id)).toEqual([2, 3, 1])
        await wrapper.setProps({ rows: reordered })
        expect(wrapper.find('tbody.dl-virtual-scroll__content').element).toBe(
            tbody
        )
        expect(
            wrapper
                .findAll('tbody tr.dl-tr td[data-col-index="0"]')
                .map((td: any) => td.text())
        ).toEqual(['a2', 'a3', 'a1'])
    })
})
