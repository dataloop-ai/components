import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { DlTreeTable } from '../../src/components'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'calories', label: 'Calories', field: 'calories' }
]

const ROWS = [
    {
        id: '1',
        name: 'Frozen Yogurt',
        calories: 159,
        isExpanded: true,
        children: [{ id: '1-1', name: 'Eclair', calories: 262 }]
    },
    { id: '2', name: 'Donut', calories: 452 }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
})

const mountTree = async (props: Record<string, any> = {}) => {
    const wrapper = mount(DlTreeTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'id', ...props },
        attachTo: document.body
    })
    wrappers.push(wrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    return wrapper
}

describe('DlTreeTable DOM contract', () => {
    it('renders header cells with data-col-index', async () => {
        const wrapper = await mountTree()
        const ths = wrapper.findAll('thead th[data-col-index]')
        expect(ths.map((th: any) => th.attributes('data-col-index'))).toEqual([
            '0',
            '1'
        ])
    })

    it('renders nested body cells with data-col-index', async () => {
        const wrapper = await mountTree()
        const cells = wrapper.findAll(
            'table.nested-table td[data-col-index="0"]'
        )
        const texts = cells.map((td: any) => td.text())
        expect(texts).toEqual(
            expect.arrayContaining(['Frozen Yogurt', 'Donut'])
        )
    })
})
