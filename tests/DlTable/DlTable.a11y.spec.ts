import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'a', label: 'A', field: 'a', sortable: true },
    { name: 'b', label: 'B', field: 'b' },
    { name: 'c', label: 'C', field: 'c' }
]
const ROWS = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`
}))

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

const mountTable = async (
    props: Record<string, any> = {},
    options: any = {}
) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'id', ...props },
        attachTo: document.body,
        ...options
    })
    wrappers.push(wrapper)
    const scroller = wrapper.find('.dl-virtual-scroll')
    if (scroller.exists()) await scroller.trigger('scroll')
    // @ts-ignore
    await window.delay(150)
    await wrapper.vm.$nextTick()
    return wrapper
}

const key = (el: Element, k: string, init: Record<string, any> = {}) =>
    el.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            bubbles: true,
            cancelable: true,
            ...init
        })
    )

const bodyCell = (wrapper: any, row: number, col: number) =>
    wrapper
        .findAll('tbody.dl-virtual-scroll__content > tr.dl-tr')
        [row].findAll('td[data-col-index]')[col].element as HTMLElement

describe('A11Y-01: semantics', () => {
    it('keeps native roles and sets no row index on a fully rendered table', async () => {
        const wrapper = await mountTable()
        const table = wrapper.find('table.dl-table')
        expect(table.attributes('role')).toBeUndefined()
        expect(table.attributes('aria-rowcount')).toBeUndefined()
        expect(
            wrapper.find('tbody tr.dl-tr').attributes('aria-rowindex')
        ).toBeUndefined()
    })

    it('sets role="grid" only with the gridRole prop', async () => {
        const wrapper = await mountTable({ gridRole: true })
        expect(wrapper.find('table.dl-table').attributes('role')).toBe('grid')
    })

    it('exposes row count and row index in virtual mode', async () => {
        const rows = Array.from({ length: 300 }, (_, i) => ({
            id: i,
            a: `a${i}`,
            b: '',
            c: ''
        }))
        const wrapper = await mountTable({ rows, virtualScroll: true })
        expect(wrapper.find('table.dl-table').attributes('aria-rowcount')).toBe(
            '301'
        )
        expect(
            wrapper
                .find('tbody.dl-virtual-scroll__content > tr.dl-tr')
                .attributes('aria-rowindex')
        ).toBe('2')
    })

    it('exposes row count and row index in server mode', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 50, rowsPerPage: 5, page: 3 }
        })
        expect(wrapper.find('table.dl-table').attributes('aria-rowcount')).toBe(
            '51'
        )
        expect(wrapper.find('tbody tr.dl-tr').attributes('aria-rowindex')).toBe(
            '12'
        )
    })

    it('marks selected rows with aria-selected', async () => {
        const wrapper = await mountTable({
            selection: 'multiple',
            selected: [ROWS[1]]
        })
        const trs = wrapper.findAll('tbody tr.dl-tr')
        expect(trs[0].attributes('aria-selected')).toBe('false')
        expect(trs[1].attributes('aria-selected')).toBe('true')
    })

    it('makes the expand toggle a keyboard button with aria-expanded', async () => {
        const wrapper = await mountTable(
            { expandableRows: true },
            {
                slots: {
                    'body-cell-expandable-content': '<div class="exp">x</div>'
                }
            }
        )
        const toggle = wrapper.find('tbody tr.dl-tr [role="button"]')
        expect(toggle.attributes('aria-expanded')).toBe('false')
        await toggle.trigger('keydown', { key: 'Enter' })
        expect(wrapper.find('.exp').exists()).toBe(true)
        expect(
            wrapper
                .find('tbody tr.dl-tr [role="button"]')
                .attributes('aria-expanded')
        ).toBe('true')
    })
})

describe('A11Y-02: keyboard navigation (on by default)', () => {
    it('makes the first body cell the tab entry point', async () => {
        const wrapper = await mountTable()
        expect(bodyCell(wrapper, 0, 0).tabIndex).toBe(0)
        expect(bodyCell(wrapper, 1, 0).getAttribute('tabindex')).toBeNull()
    })

    it('moves focus with the arrow keys and keeps one tab stop', async () => {
        const wrapper = await mountTable()
        const start = bodyCell(wrapper, 0, 0)
        start.focus()
        key(start, 'ArrowRight')
        expect(document.activeElement).toBe(bodyCell(wrapper, 0, 1))
        key(document.activeElement, 'ArrowDown')
        expect(document.activeElement).toBe(bodyCell(wrapper, 1, 1))
        key(document.activeElement, 'ArrowLeft')
        expect(document.activeElement).toBe(bodyCell(wrapper, 1, 0))
        key(document.activeElement, 'End')
        expect(document.activeElement).toBe(bodyCell(wrapper, 1, 2))
        expect(start.tabIndex).toBe(-1)
        const stops = wrapper
            .findAll('[data-dl-roving]')
            .filter((w: any) => (w.element as HTMLElement).tabIndex === 0)
        expect(stops).toHaveLength(1)
    })

    it('moves from the first body row up into the header', async () => {
        const wrapper = await mountTable()
        const start = bodyCell(wrapper, 0, 0)
        start.focus()
        key(start, 'ArrowUp')
        expect(document.activeElement).toBe(
            wrapper.find('thead th[data-col-index="0"]').element
        )
    })

    it('never intercepts keys typed in an input inside a cell', async () => {
        const wrapper = await mountTable(
            {},
            { slots: { 'body-cell-b': '<input class="edit" />' } }
        )
        const input = wrapper.find('input.edit').element as HTMLInputElement
        input.focus()
        const evt = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true,
            cancelable: true
        })
        input.dispatchEvent(evt)
        expect(evt.defaultPrevented).toBe(false)
        expect(document.activeElement).toBe(input)
    })

    it('can be turned off with no-grid-navigation', async () => {
        const wrapper = await mountTable({ noGridNavigation: true })
        const start = bodyCell(wrapper, 0, 0)
        expect(start.getAttribute('tabindex')).toBeNull()
        start.tabIndex = 0
        start.focus()
        key(start, 'ArrowRight')
        expect(document.activeElement).toBe(start)
    })
})

describe('SEL-03: range and keyboard selection', () => {
    it('selects a range with Shift+click on the checkboxes', async () => {
        const wrapper = await mountTable({
            selection: 'multiple',
            selected: []
        })
        const boxes = wrapper.findAll('tbody tr.dl-tr label.container')
        await boxes[1].trigger('click')
        await wrapper.setProps({ selected: [ROWS[1]] })
        await boxes[3].trigger('click', { shiftKey: true })
        const events = wrapper.emitted('update:selected') as any[][]
        expect(events[events.length - 1][0].map((r: any) => r.id)).toEqual([
            1, 2, 3
        ])
    })

    it('toggles the focused row with Space', async () => {
        const wrapper = await mountTable({
            selection: 'multiple',
            selected: []
        })
        const cell = bodyCell(wrapper, 2, 0)
        cell.focus()
        key(cell, ' ')
        const events = wrapper.emitted('update:selected') as any[][]
        expect(events[events.length - 1][0]).toEqual([ROWS[2]])
    })
})

describe('RESIZE-03: keyboard resize and reset', () => {
    const styleOf = (wrapper: any) =>
        document.head.querySelector(
            `style[data-dl-table-style="${wrapper.attributes(
                'data-dl-table-id'
            )}"]`
        )?.textContent ?? ''

    it('resizes a header by 8px with Alt+Arrow and 32px with Shift', async () => {
        const wrapper = await mountTable({
            resizable: true,
            columns: COLUMNS.map((c) => ({ ...c, width: 100 }))
        })
        const th = wrapper.find('thead th[data-col-index="0"]')
            .element as HTMLElement
        th.focus()
        key(th, 'ArrowRight', { altKey: true })
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).toContain(
            '[data-col-index="0"]{width:108px !important'
        )
        key(th, 'ArrowLeft', { altKey: true, shiftKey: true })
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).toContain(
            '[data-col-index="0"]{width:76px !important'
        )
        const events = wrapper.emitted('update:column-widths') as any[][]
        expect(events[events.length - 1][0]).toEqual({ a: 76 })
    })

    it('ignores Alt+Arrow when the table is not resizable', async () => {
        const wrapper = await mountTable({ resizable: false })
        const th = wrapper.find('thead th[data-col-index="0"]')
            .element as HTMLElement
        th.focus()
        key(th, 'ArrowRight', { altKey: true })
        expect(wrapper.emitted('update:column-widths')).toBeUndefined()
    })

    it('fits a column to its content on double-click of its boundary', async () => {
        const wrapper = await mountTable({ resizable: true })
        const th = wrapper.find('thead th[data-col-index="0"]')
            .element as HTMLElement
        th.getBoundingClientRect = () =>
            ({
                left: 0,
                right: 100,
                width: 100,
                top: 0,
                bottom: 34,
                height: 34,
                x: 0,
                y: 0,
                toJSON: () => ({})
            } as DOMRect)
        th.dispatchEvent(
            new MouseEvent('dblclick', { bubbles: true, clientX: 98 })
        )
        await wrapper.vm.$nextTick()
        const events = wrapper.emitted('update:column-widths') as any[][]
        expect(Object.keys(events[0][0])).toEqual(['a'])
        expect(styleOf(wrapper)).toMatch(
            /\[data-col-index="0"\]\{width:\d+px !important/
        )
    })
})
