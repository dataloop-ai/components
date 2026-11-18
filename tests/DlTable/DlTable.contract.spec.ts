import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
    { name: 'fat', label: 'Fat', field: 'fat' }
]

const ROWS = [
    { name: 'Frozen Yogurt', calories: 159, fat: 6 },
    { name: 'Eclair', calories: 262, fat: 16 },
    { name: 'Cupcake', calories: 305, fat: 3.7 },
    { name: 'Donut', calories: 452, fat: 25 }
]

const wrappers: any[] = []
const mountTable = (props: Record<string, any> = {}, options: any = {}) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'name', ...props },
        attachTo: document.body,
        ...options
    })
    wrappers.push(wrapper)
    return wrapper
}

const mountReady = async (
    props: Record<string, any> = {},
    options: any = {}
) => {
    const wrapper = mountTable(props, options)
    // jsdom has no layout: the virtual slice is only computed on a scroll event
    const scroller = wrapper.find('.dl-virtual-scroll')
    if (scroller.exists()) await scroller.trigger('scroll')
    // @ts-ignore
    await window.delay(150)
    await wrapper.vm.$nextTick()
    return wrapper
}

const bodyRows = (wrapper: any) =>
    wrapper.findAll('tbody.dl-virtual-scroll__content > tr.dl-tr')

const firstColumnTexts = (wrapper: any) =>
    bodyRows(wrapper).map((tr: any) => tr.find('td[data-col-index="0"]').text())

afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

describe('DlTable DOM contract (consumers and Playwright rely on it)', () => {
    for (const virtualScroll of [false, true]) {
        describe(virtualScroll ? 'virtual branch' : 'normal branch', () => {
            it('renders table.dl-table inside .dl-table__middle', () => {
                const wrapper = mountTable({ virtualScroll })
                expect(
                    wrapper.find('.dl-table__middle table.dl-table').exists()
                ).toBe(true)
                if (!virtualScroll) {
                    expect(
                        wrapper.find('.dl-table__middle.scroll').exists()
                    ).toBe(true)
                }
            })

            it('renders header cells with data-col-index and inner-th structure', () => {
                const wrapper = mountTable({ virtualScroll })
                const ths = wrapper.findAll('thead th[data-col-index]')
                expect(
                    ths.map((th: any) => th.attributes('data-col-index'))
                ).toEqual(['0', '1', '2'])
                const th = ths[0]
                expect(th.classes()).toContain('dl-th')
                expect(th.find('.inner-th-wrapper .inner-th').exists()).toBe(
                    true
                )
                expect(th.find('.th-icons').exists()).toBe(true)
                expect(th.text()).toContain('Name')
            })

            it('renders body rows as tbody.dl-virtual-scroll__content > tr.dl-tr with td[data-col-index]', async () => {
                const wrapper = await mountReady({ virtualScroll })
                const rows = bodyRows(wrapper)
                expect(rows.length).toBeGreaterThan(0)
                const cells = rows[0].findAll('td.dl-td')
                expect(
                    cells.map((td: any) => td.attributes('data-col-index'))
                ).toEqual(['0', '1', '2'])
            })

            it('renders the multiple-selection header checkbox wrapper', () => {
                const wrapper = mountTable({
                    virtualScroll,
                    selection: 'multiple'
                })
                expect(
                    wrapper.find('th.dl-table--col-checkbox-wrapper').exists()
                ).toBe(true)
            })

            it('keeps the native table roles (no role="grid" by default)', async () => {
                const wrapper = await mountReady({ virtualScroll })
                expect(
                    wrapper.find('table.dl-table').attributes('role')
                ).not.toBe('grid')
                expect(
                    wrapper.find('td.dl-td').attributes('role')
                ).toBeUndefined()
            })
        })
    }
})

describe('DlTable client-side behaviour (characterisation)', () => {
    it('sorts rows on the client when a sortable header is clicked', async () => {
        const wrapper = mountTable()
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        expect(firstColumnTexts(wrapper)).toEqual([
            'Cupcake',
            'Donut',
            'Eclair',
            'Frozen Yogurt'
        ])
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        expect(firstColumnTexts(wrapper)).toEqual([
            'Frozen Yogurt',
            'Eclair',
            'Donut',
            'Cupcake'
        ])
    })

    it('emits update:pagination with the new sort', async () => {
        const wrapper = mountTable()
        await wrapper.find('thead th[data-col-index="1"]').trigger('click')
        // @ts-ignore
        await window.delay(150)
        const events = wrapper.emitted('update:pagination') as any[][]
        expect(events[events.length - 1][0]).toMatchObject({
            sortBy: 'calories',
            descending: false,
            page: 1
        })
    })

    it('slices rows by rowsPerPage', () => {
        const wrapper = mountTable({ pagination: { rowsPerPage: 2 } })
        expect(firstColumnTexts(wrapper)).toEqual(['Frozen Yogurt', 'Eclair'])
    })

    it('filters rows by the filter prop', () => {
        const wrapper = mountTable({ filter: 'ec' })
        expect(firstColumnTexts(wrapper)).toEqual(['Eclair'])
    })

    it('emits update:selected when a row checkbox is toggled', async () => {
        const wrapper = mountTable({ selection: 'multiple', selected: [] })
        await bodyRows(wrapper)[1].find('label.container').trigger('click')
        const events = wrapper.emitted('update:selected') as any[][]
        expect(events[events.length - 1][0]).toEqual([ROWS[1]])
    })

    it('deselects a selected row', async () => {
        const wrapper = mountTable({
            selection: 'multiple',
            selected: [ROWS[0], ROWS[1]]
        })
        await bodyRows(wrapper)[0].find('label.container').trigger('click')
        const events = wrapper.emitted('update:selected') as any[][]
        expect(events[events.length - 1][0]).toEqual([ROWS[1]])
    })

    it('emits row-click with the row', async () => {
        const wrapper = mountTable()
        await bodyRows(wrapper)[2].trigger('click')
        // @ts-ignore
        await window.delay(60)
        const events = wrapper.emitted('row-click') as any[][]
        expect(events[0][1]).toEqual(ROWS[2])
    })

    it('emits row-dblclick and not row-click on double click', async () => {
        const wrapper = mountTable({}, { attrs: { onRowDblclick: () => {} } })
        const tr = bodyRows(wrapper)[0]
        await tr.trigger('click')
        await tr.trigger('dblclick')
        // @ts-ignore
        await window.delay(60)
        expect((wrapper.emitted('row-dblclick') as any[][])[0][1]).toEqual(
            ROWS[0]
        )
        expect(wrapper.emitted('row-click')).toBeUndefined()
    })

    it('renders only the visible columns', () => {
        const wrapper = mountTable({ visibleColumns: ['name', 'fat'] })
        const labels = wrapper
            .findAll('thead th[data-col-index]')
            .map((th: any) => th.text())
        expect(labels).toEqual(['Name', 'Fat'])
    })

    it('renders the expandable content when a row is expanded', async () => {
        const wrapper = mountTable(
            { expandableRows: true },
            {
                slots: {
                    'body-cell-expandable-content':
                        '<div class="exp">details</div>'
                }
            }
        )
        expect(wrapper.find('.exp').exists()).toBe(false)
        await bodyRows(wrapper)[0].find('.dl-icon').trigger('click')
        expect(wrapper.find('.exp').exists()).toBe(true)
    })
})
