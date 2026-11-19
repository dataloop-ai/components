import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'a', label: 'A', field: 'a', sortable: true },
    { name: 'b', label: 'B', field: 'b', sortable: true },
    { name: 'c', label: 'C', field: 'c', hiddenByDefault: true }
]
const ROWS = [
    { id: 1, a: 'x', b: 2, c: 'c1' },
    { id: 2, a: 'y', b: 1, c: 'c2' }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

const mountTable = async (props: Record<string, any> = {}) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'id', ...props },
        attachTo: document.body
    })
    wrappers.push(wrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    return wrapper
}

const labels = (wrapper: any) =>
    wrapper
        .findAll('.dl-table__middle thead th[data-col-index]')
        .map((th: any) => th.text())

const styleOf = (wrapper: any) =>
    document.head.querySelector(
        `style[data-dl-table-style="${wrapper.attributes('data-dl-table-id')}"]`
    )?.textContent ?? ''

describe('SETTINGS-01: table state', () => {
    it('hides hiddenByDefault columns when visibleColumns is not given', async () => {
        const wrapper = await mountTable()
        expect(labels(wrapper)).toEqual(['A', 'B'])
    })

    it('restores order, visibility, widths and sort from a stored state', async () => {
        const state = {
            version: 1,
            order: ['c', 'b', 'a', 'unknown'],
            hidden: ['a'],
            widths: { b: 150, unknown: 10 },
            sort: { sortBy: 'b', descending: true }
        }
        const wrapper = await mountTable({ state })
        expect(labels(wrapper)).toEqual(['C', 'B'])
        expect(styleOf(wrapper)).toContain('width:150px !important')
        expect(wrapper.vm.computedPagination.sortBy).toBe('b')
        expect(wrapper.vm.computedPagination.descending).toBe(true)
    })

    it('emits update:state after a user change, and the state round-trips', async () => {
        const wrapper = await mountTable({ draggable: 'columns' })
        await wrapper.find('thead th[data-col-index="1"]').trigger('click')
        wrapper.vm.reorderColumns(0, 1)
        await wrapper.vm.$nextTick()
        const states = wrapper.emitted('update:state') as any[][]
        const last = states[states.length - 1][0]
        expect(last).toMatchObject({
            version: 1,
            order: ['b', 'a', 'c'],
            hidden: ['c'],
            sort: { sortBy: 'b', descending: false }
        })
        // feeding it back after a "reload" gives the same table
        const reloaded = await mountTable({
            state: JSON.parse(JSON.stringify(last))
        })
        expect(labels(reloaded)).toEqual(['B', 'A'])
        expect(reloaded.vm.computedPagination.sortBy).toBe('b')
    })

    it('does not emit update:state on mount', async () => {
        const wrapper = await mountTable()
        expect(wrapper.emitted('update:state')).toBeUndefined()
    })
})

describe('ROW-01: row actions', () => {
    const slots = { 'body-cell-row-actions': '<button class="act">⋮</button>' }

    it('hides the actions until hover or focus in hover mode', async () => {
        const wrapper = mount(DlTable as any, {
            props: {
                columns: COLUMNS,
                rows: ROWS,
                rowKey: 'id',
                rowActionsMode: 'hover',
                rowActionsWidth: 72
            },
            slots,
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await wrapper.vm.$nextTick()
        const css = styleOf(wrapper)
        expect(css).toContain('td.dl-table-visible-column>*{opacity:0}')
        expect(css).toContain(
            ':focus-within>td.dl-table-visible-column>*{opacity:1}'
        )
        expect(css).toContain('.dl-table-visible-column{width:72px')
        expect(wrapper.find('td.dl-table-visible-column .act').exists()).toBe(
            true
        )
    })

    it('always shows the actions by default', async () => {
        const wrapper = mount(DlTable as any, {
            props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' },
            slots,
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).not.toContain('opacity:0')
    })
})

describe('DEBT-05: style tokens', () => {
    it('routes the cell padding through --dl-table-cell-padding-x', async () => {
        const wrapper = await mountTable({ columnSpacing: '12px' })
        // jsdom drops var() inside the padding shorthand; check what the cell receives
        const td = wrapper.findAllComponents({ name: 'DlTd' })[0]
        expect(td.props('padding')).toBe(
            '0 var(--dl-table-cell-padding-x, 12px)'
        )
    })
})
