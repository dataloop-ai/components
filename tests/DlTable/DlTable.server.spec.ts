import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    {
        name: 'status',
        label: 'Status',
        field: 'status',
        sortable: false,
        sortDisabledReason: 'The server cannot sort by status'
    }
]
// one page of a larger result, in the order the server returned it
const PAGE = [
    { name: 'Zeta', status: 'b' },
    { name: 'Alpha', status: 'a' },
    { name: 'Mike', status: 'c' }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

const mountTable = async (
    props: Record<string, any> = {},
    options: any = {}
) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: PAGE, rowKey: 'name', ...props },
        attachTo: document.body,
        ...options
    })
    wrappers.push(wrapper)
    await wrapper.vm.$nextTick()
    return wrapper
}

const names = (wrapper: any) =>
    wrapper
        .findAll('tbody.dl-virtual-scroll__content > tr.dl-tr')
        .map((tr: any) => tr.find('td[data-col-index="0"]').text())

const flush = async (wrapper: any) => {
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
}

describe('SORT-03: automatic server mode (rowsNumber > rows.length)', () => {
    it('keeps the server order after a sort click and emits request once', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        await flush(wrapper)
        expect(names(wrapper)).toEqual(['Zeta', 'Alpha', 'Mike'])
        const requests = wrapper.emitted('request') as any[][]
        expect(requests).toHaveLength(1)
        expect(requests[0][0].pagination).toMatchObject({
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 3
        })
    })

    it('does not slice the page passed by the server', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3, page: 2 }
        })
        expect(names(wrapper)).toEqual(['Zeta', 'Alpha', 'Mike'])
    })

    it('does not filter on the client and requests with the filter', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        await wrapper.setProps({ filter: 'alp' })
        await flush(wrapper)
        expect(names(wrapper)).toEqual(['Zeta', 'Alpha', 'Mike'])
        const requests = wrapper.emitted('request') as any[][]
        expect(requests).toHaveLength(1)
        expect(requests[0][0].filter).toBe('alp')
    })

    it('requests when the page changes', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        wrapper.vm.nextPage()
        await flush(wrapper)
        expect(
            (wrapper.emitted('request') as any[][])[0][0].pagination.page
        ).toBe(2)
    })

    it('does not request when the parent feeds pagination back', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        await wrapper.setProps({
            pagination: { rowsNumber: 45, rowsPerPage: 3, page: 2 }
        })
        await flush(wrapper)
        expect(wrapper.emitted('request')).toBeUndefined()
    })

    it('still sorts and slices on the client when rowsNumber equals rows.length', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 3, rowsPerPage: 2 }
        })
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        await flush(wrapper)
        expect(names(wrapper)).toEqual(['Alpha', 'Mike'])
        expect(wrapper.emitted('request')).toBeUndefined()
    })

    it('stays in client mode with the initial rowsNumber: 0', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 0, rowsPerPage: 5 }
        })
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        await flush(wrapper)
        expect(names(wrapper)).toEqual(['Alpha', 'Mike', 'Zeta'])
        expect(wrapper.emitted('request')).toBeUndefined()
    })

    it('still emits update:pagination in server mode', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        await wrapper.find('thead th[data-col-index="0"]').trigger('click')
        // @ts-ignore
        await window.delay(150)
        const updates = wrapper.emitted('update:pagination') as any[][]
        expect(updates[updates.length - 1][0]).toMatchObject({ sortBy: 'name' })
    })
})

describe('SORT-04: non-sortable columns', () => {
    it('does not sort or request when a non-sortable header is clicked', async () => {
        const wrapper = await mountTable({
            pagination: { rowsNumber: 30, rowsPerPage: 3 }
        })
        await wrapper.find('thead th[data-col-index="1"]').trigger('click')
        await flush(wrapper)
        expect(wrapper.emitted('request')).toBeUndefined()
        expect(wrapper.vm.computedPagination.sortBy).toBeFalsy()
    })

    it('shows the reason as the header tooltip', async () => {
        const wrapper = await mountTable()
        const th = wrapper.findAllComponents({ name: 'DlTh' })[1]
        expect(th.vm.sortDisabledReason).toBe(
            'The server cannot sort by status'
        )
        expect(th.findComponent({ name: 'DlTooltip' }).exists()).toBe(true)
    })
})

describe('DEBT-04: controlled pagination', () => {
    it('shows the page set by the parent after a user page change', async () => {
        const rows = Array.from({ length: 20 }, (_, i) => ({
            name: `r${i}`,
            status: 'x'
        }))
        const wrapper = await mountTable({
            rows,
            pagination: { rowsPerPage: 5, page: 1 }
        })
        wrapper.vm.nextPage()
        await flush(wrapper)
        expect(wrapper.vm.computedPagination.page).toBe(2)
        await wrapper.setProps({ pagination: { rowsPerPage: 5, page: 3 } })
        await flush(wrapper)
        expect(wrapper.vm.computedPagination.page).toBe(3)
        expect(names(wrapper)[0]).toBe('r10')
    })
})

describe('PERF-06: virtual scroll with expandable rows', () => {
    it('keeps virtual scrolling when an expandable slot is provided', async () => {
        const rows = Array.from({ length: 500 }, (_, i) => ({
            name: `r${i}`,
            status: 'x'
        }))
        const wrapper = await mountTable(
            { rows, virtualScroll: true, expandableRows: true },
            {
                slots: {
                    'body-cell-expandable-content':
                        '<div class="exp">details</div>'
                }
            }
        )
        expect(wrapper.vm.hasVirtScroll).toBe(true)
        await wrapper.find('.dl-virtual-scroll').trigger('scroll')
        // @ts-ignore
        await window.delay(150)
        const rendered = wrapper.findAll(
            'tbody.dl-virtual-scroll__content > tr.dl-tr'
        ).length
        expect(rendered).toBeGreaterThan(0)
        expect(rendered).toBeLessThan(500)
    })

    it('renders the expanded content inside the virtual list', async () => {
        const rows = Array.from({ length: 50 }, (_, i) => ({
            name: `r${i}`,
            status: 'x'
        }))
        const wrapper = await mountTable(
            { rows, virtualScroll: true, expandableRows: true },
            {
                slots: {
                    'body-cell-expandable-content':
                        '<div class="exp">details</div>'
                }
            }
        )
        await wrapper.find('.dl-virtual-scroll').trigger('scroll')
        // @ts-ignore
        await window.delay(150)
        await wrapper
            .find('tbody.dl-virtual-scroll__content > tr.dl-tr .dl-icon')
            .trigger('click')
        expect(
            wrapper.find('tr.dl-virtual-scroll--with-prev .exp').exists()
        ).toBe(true)
    })
})
