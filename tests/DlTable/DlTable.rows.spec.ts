import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'kcal', label: 'Kcal', field: 'kcal', sortable: true }
]
const ROWS = [
    { name: 'Alpha', kcal: 3 },
    { name: 'Beta', kcal: 1 }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

const mountReady = async (
    props: Record<string, any> = {},
    options: any = {}
) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'name', ...props },
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

const TOTAL = '<tr class="total"><td colspan="2">Total</td></tr>'

describe('DEBT-01 drift fixes', () => {
    for (const virtualScroll of [false, true]) {
        it(`expanding a row does not emit row-click (${
            virtualScroll ? 'virtual' : 'normal'
        })`, async () => {
            const wrapper = await mountReady(
                { virtualScroll, expandableRows: true },
                {
                    slots: {
                        'body-cell-expandable-content':
                            '<div class="exp">x</div>'
                    }
                }
            )
            await wrapper.find('tbody tr.dl-tr .dl-icon').trigger('click')
            // @ts-ignore
            await window.delay(60)
            expect(wrapper.find('.exp').exists()).toBe(true)
            expect(wrapper.emitted('row-click')).toBeUndefined()
        })
    }
})

describe('ROW-02: top and bottom rows in both modes', () => {
    for (const virtualScroll of [false, true]) {
        const mode = virtualScroll ? 'virtual' : 'normal'

        it(`renders the bottom-row slot (${mode})`, async () => {
            const wrapper = await mountReady(
                { virtualScroll },
                { slots: { 'bottom-row': TOTAL } }
            )
            expect(wrapper.find('tr.total').exists()).toBe(true)
        })

        it(`renders the top-row slot (${mode})`, async () => {
            const wrapper = await mountReady(
                { virtualScroll },
                {
                    slots: {
                        'top-row':
                            '<tr class="top"><td colspan="2">Top</td></tr>'
                    }
                }
            )
            expect(wrapper.find('tr.top').exists()).toBe(true)
        })

        it(`puts a sticky bottom row in its own pinned tbody (${mode})`, async () => {
            const wrapper = await mountReady(
                { virtualScroll, stickyBottomRow: true },
                { slots: { 'bottom-row': TOTAL } }
            )
            const tbody = wrapper.find('tbody.dl-table__bottom-row--sticky')
            expect(tbody.exists()).toBe(true)
            expect(tbody.find('tr.total').exists()).toBe(true)
            expect(wrapper.findAll('tr.total')).toHaveLength(1)
        })
    }

    it('keeps the normal-mode bottom row inside the body by default', async () => {
        const wrapper = await mountReady({}, { slots: { 'bottom-row': TOTAL } })
        expect(
            wrapper.find('tbody.dl-virtual-scroll__content tr.total').exists()
        ).toBe(true)
    })
})

describe('SORT-05: header follows the sort state without a remount', () => {
    it('updates class and aria-sort when the sort changes', async () => {
        const wrapper = await mountReady()
        const th = () => wrapper.find('thead th[data-col-index="1"]')
        expect(th().attributes('aria-sort')).toBe('none')
        const element = th().element
        await th().trigger('click')
        expect(th().element).toBe(element)
        expect(th().classes()).toContain('sorted')
        expect(th().attributes('aria-sort')).toBe('ascending')
        await th().trigger('click')
        expect(th().classes()).toContain('sort-desc')
        expect(th().attributes('aria-sort')).toBe('descending')
    })

    it('makes sortable headers focusable and sorts with Enter', async () => {
        const wrapper = await mountReady()
        const th = wrapper.find('thead th[data-col-index="0"]')
        expect(th.attributes('tabindex')).toBe('0')
        await th.trigger('keydown', { key: 'Enter' })
        expect(wrapper.vm.computedPagination.sortBy).toBe('name')
    })

    it('does not make non-sortable headers focusable', async () => {
        const wrapper = await mountReady({
            columns: [{ name: 'name', label: 'Name', field: 'name' }]
        })
        const th = wrapper.find('thead th[data-col-index="0"]')
        expect(th.attributes('tabindex')).toBeUndefined()
        expect(th.attributes('aria-sort')).toBeUndefined()
    })
})
