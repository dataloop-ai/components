import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { DlTable } from '../../src/components'

const COLUMNS = [
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'calories', label: 'Calories', field: 'calories' },
    { name: 'fat', label: 'Fat', field: 'fat' }
]
const ROWS = [
    { name: 'Frozen Yogurt', calories: 159, fat: 6 },
    { name: 'Eclair', calories: 262, fat: 16 }
]

const wrappers: any[] = []
afterEach(() => {
    while (wrappers.length) wrappers.pop().unmount()
    vi.restoreAllMocks()
})

const mountTable = async (
    props: Record<string, any> = {},
    options: any = {}
) => {
    const wrapper = mount(DlTable as any, {
        props: { columns: COLUMNS, rows: ROWS, rowKey: 'name', ...props },
        attachTo: document.body,
        ...options
    })
    wrappers.push(wrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    return wrapper
}

const tableId = (wrapper: any) => wrapper.attributes('data-dl-table-id')
const styleOf = (wrapper: any) =>
    document.head.querySelector(
        `style[data-dl-table-style="${tableId(wrapper)}"]`
    )?.textContent ?? ''

const pointer = (type: string, init: Record<string, any> = {}) =>
    new MouseEvent(type, { bubbles: true, cancelable: true, ...init })

/** th boundaries at 0-100, 100-200, 200-300 */
const mockHeaderRects = (wrapper: any) => {
    wrapper
        .findAll('thead th[data-col-index]')
        .forEach((th: any, i: number) => {
            vi.spyOn(th.element, 'getBoundingClientRect').mockReturnValue({
                left: i * 100,
                right: (i + 1) * 100,
                width: 100,
                top: 0,
                bottom: 34,
                height: 34,
                x: i * 100,
                y: 0,
                toJSON: () => ({})
            } as DOMRect)
        })
}

describe('per-table stylesheet (DEBT-03, DEBT-02)', () => {
    it('creates one style element per table and removes it on unmount', async () => {
        const wrapper = await mountTable()
        const id = tableId(wrapper)
        expect(id).toMatch(/^dl-table-/)
        expect(
            document.head.querySelectorAll(`style[data-dl-table-style="${id}"]`)
        ).toHaveLength(1)
        wrapper.unmount()
        wrappers.pop()
        expect(
            document.head.querySelector(`style[data-dl-table-style="${id}"]`)
        ).toBeNull()
    })

    it('writes no width/min-width/left inline styles on body cells', async () => {
        const wrapper = await mountTable({
            stickyColumns: 'first',
            resizable: true
        })
        wrapper
            .findAll('td[data-col-index], th[data-col-index]')
            .forEach((cell: any) => {
                const style = (cell.element as HTMLElement).style
                expect(style.width).toBe('')
                expect(style.minWidth).toBe('')
                expect(style.left).toBe('')
            })
    })

    it('renders a numeric column width as px', async () => {
        const wrapper = await mountTable({
            columns: [{ ...COLUMNS[0], width: 200 }, COLUMNS[1], COLUMNS[2]]
        })
        expect(styleOf(wrapper)).toContain('[data-col-index="0"]{width:200px')
    })

    it('keeps two tables on one page independent', async () => {
        const a = await mountTable()
        const b = await mountTable()
        const before = styleOf(a)
        await b.setProps({
            columns: [{ ...COLUMNS[0], width: 321 }, COLUMNS[1]]
        })
        await b.vm.$nextTick()
        expect(styleOf(b)).toContain('321px')
        expect(styleOf(a)).toBe(before)
        expect(styleOf(a)).not.toContain('321px')
    })
})

describe('PERF-02: no global sizing event', () => {
    it('does not dispatch virtual-scroll-content-update while rendering', async () => {
        const spy = vi.spyOn(window, 'dispatchEvent')
        const wrapper = await mountTable({ virtualScroll: true })
        await wrapper.find('.dl-virtual-scroll').trigger('scroll')
        // @ts-ignore
        await window.delay(150)
        const types = spy.mock.calls.map(([evt]) => (evt as Event).type)
        expect(types).not.toContain('virtual-scroll-content-update')
    })
})

describe('LAYOUT-03: overflow instead of squeezing', () => {
    it('makes the table at least as wide as its columns', async () => {
        const wrapper = await mountTable({
            columns: COLUMNS.map((col) => ({ ...col, width: 400 }))
        })
        expect(styleOf(wrapper)).toContain(
            'width:max(100%, 1200px);max-width:none'
        )
    })
})

describe('LAYOUT-04: pinned columns', () => {
    it('pins the first column with sticky positioning', async () => {
        const wrapper = await mountTable({ stickyColumns: 'first' })
        expect(styleOf(wrapper)).toContain(
            'tr.dl-tr>[data-col-index="0"]{position:sticky;left:0px}'
        )
    })

    it('pins the utility columns together with the first column', async () => {
        const wrapper = await mountTable({
            stickyColumns: 'first',
            selection: 'multiple'
        })
        expect(styleOf(wrapper)).toContain(
            'tr.dl-tr>:nth-child(1){position:sticky;left:0px}'
        )
    })

    it('pins the last column from the end', async () => {
        const wrapper = await mountTable({ stickyColumns: 'last' })
        expect(styleOf(wrapper)).toContain(
            'tr.dl-tr>[data-col-index="2"]{position:sticky;right:0px}'
        )
    })

    it('toggles the scroll shadow class with the scroll position', async () => {
        const wrapper = await mountTable({ stickyColumns: 'first' })
        const scroller = wrapper.find('.dl-table__middle')
            .element as HTMLElement
        Object.defineProperty(scroller, 'scrollLeft', {
            value: 30,
            configurable: true
        })
        scroller.dispatchEvent(new Event('scroll'))
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('dl-table--scrolled-start')
        Object.defineProperty(scroller, 'scrollLeft', {
            value: 0,
            configurable: true
        })
        scroller.dispatchEvent(new Event('scroll'))
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).not.toContain('dl-table--scrolled-start')
    })
})

describe('LAYOUT-07: hover does not change the layout', () => {
    it('adds no border class to any cell when a header is hovered', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="1"]')
        th.element.dispatchEvent(pointer('pointerenter'))
        th.element.dispatchEvent(pointer('pointermove', { clientX: 150 }))
        await wrapper.vm.$nextTick()
        wrapper.findAll('th, td').forEach((cell: any) => {
            expect(cell.classes()).not.toContain('vertical-border')
        })
    })
})

describe('RESIZE-01/02/04: pointer resize engine', () => {
    const resize = async (wrapper: any, fromX: number, toX: number) => {
        const th = wrapper.find('thead th[data-col-index="1"]').element
        th.dispatchEvent(pointer('pointermove', { clientX: fromX }))
        await wrapper.vm.$nextTick()
        th.dispatchEvent(pointer('pointerdown', { clientX: fromX, button: 0 }))
        th.dispatchEvent(pointer('pointermove', { clientX: toX }))
        th.dispatchEvent(pointer('pointerup', { clientX: toX }))
        await wrapper.vm.$nextTick()
    }

    it('shows the resize hover only near a boundary', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="1"]').element
        th.dispatchEvent(pointer('pointermove', { clientX: 150 }))
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).not.toContain('col-resize')
        th.dispatchEvent(pointer('pointermove', { clientX: 198 }))
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).toContain('col-resize')
    })

    it('does not offer a handle on the right edge of the last column', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="2"]').element
        th.dispatchEvent(pointer('pointermove', { clientX: 298 }))
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).not.toContain('col-resize')
    })

    it('resizes the column, clamps to the limits and emits once at the end', async () => {
        const wrapper = await mountTable({
            resizable: true,
            columnMaxWidth: 150
        })
        mockHeaderRects(wrapper)
        await resize(wrapper, 198, 400)
        expect(styleOf(wrapper)).toContain(
            '[data-col-index="1"]{width:150px !important'
        )
        const events = wrapper.emitted('update:column-widths') as any[][]
        expect(events).toHaveLength(1)
        expect(events[0][0]).toEqual({ calories: 150 })
        const legacy = wrapper.emitted('col-update') as any[][]
        expect(legacy[0][0].find((c: any) => c.name === 'calories').width).toBe(
            150
        )
        expect(
            legacy[0][0].find((c: any) => c.name === 'name').width
        ).toBeUndefined()
    })

    it('resizes the previous column from the left edge of a column', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="1"]').element
        th.dispatchEvent(pointer('pointermove', { clientX: 102 }))
        th.dispatchEvent(pointer('pointerdown', { clientX: 102, button: 0 }))
        th.dispatchEvent(pointer('pointerup', { clientX: 140 }))
        await wrapper.vm.$nextTick()
        expect(
            (wrapper.emitted('update:column-widths') as any[][])[0][0]
        ).toHaveProperty('name')
    })

    it('writes at most once per animation frame while dragging', async () => {
        const frames: FrameRequestCallback[] = []
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            frames.push(cb)
            return frames.length
        })
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="1"]').element
        th.dispatchEvent(pointer('pointermove', { clientX: 198 }))
        th.dispatchEvent(pointer('pointerdown', { clientX: 198, button: 0 }))
        for (let x = 200; x < 260; x += 5) {
            th.dispatchEvent(pointer('pointermove', { clientX: x }))
        }
        expect(frames).toHaveLength(1)
    })

    it('does not resize when resizable is off', async () => {
        const wrapper = await mountTable({ resizable: false })
        mockHeaderRects(wrapper)
        await resize(wrapper, 198, 300)
        expect(wrapper.emitted('update:column-widths')).toBeUndefined()
    })

    it('adds no window listeners when resizable is toggled', async () => {
        const add = vi.spyOn(window, 'addEventListener')
        const wrapper = await mountTable({ resizable: true })
        const before = add.mock.calls.length
        await wrapper.setProps({ resizable: false })
        await wrapper.setProps({ resizable: true })
        await wrapper.setProps({ resizable: false })
        expect(add.mock.calls.length).toBe(before)
    })

    it('does not sort when a resize ends on a sortable header', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        const th = wrapper.find('thead th[data-col-index="0"]')
        th.element.dispatchEvent(pointer('pointermove', { clientX: 98 }))
        th.element.dispatchEvent(
            pointer('pointerdown', { clientX: 98, button: 0 })
        )
        th.element.dispatchEvent(pointer('pointerup', { clientX: 140 }))
        await th.trigger('click')
        expect(wrapper.vm.computedPagination.sortBy).toBeFalsy()
    })

    it('resets user widths', async () => {
        const wrapper = await mountTable({ resizable: true })
        mockHeaderRects(wrapper)
        await resize(wrapper, 198, 260)
        expect(styleOf(wrapper)).toMatch(/width:\d+px !important/)
        wrapper.vm.resetColumnWidths()
        await wrapper.vm.$nextTick()
        expect(styleOf(wrapper)).not.toMatch(/width:\d+px !important/)
    })
})
