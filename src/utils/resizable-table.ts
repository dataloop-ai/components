import { browseNestedNodes } from './browse-nested-nodes'
import { isVue2, watch } from 'vue-demi'
import {
    calculateColIndexOffset,
    getColIndex,
    getColumnsWithUpdatedWidth,
    getMouseLimits,
    removeTableVerticalBorders,
    setColumnVerticalBorder
} from './table-columns'

const MIN_CELL_WIDTH = 40
const RESIZE_SENSITIVITY_OFFSET = 20

export function applyResizableColumns(table: HTMLTableElement, vm: any) {
    let mousePosition: 'start' | 'end' | 'default' = 'default'
    let targetIndex: number = null

    watch(
        [
            () => vm.proxy.getIsDragging(),
            () => vm.proxy.getVisibleColumnsState()
        ],
        () => {
            const vnodeEl = isVue2 ? vm.vnode.elm : vm.vnode.el
            table = vnodeEl?.querySelector('table')
            const thArray = Array.from(
                table?.querySelector('thead')?.querySelector('tr').children ||
                    []
            ) as HTMLElement[]

            thArray.forEach((th) => {
                th.addEventListener('mouseenter', handleMouseenter)
                th.addEventListener('mouseleave', handleMouseleave)
            })
        },
        { immediate: true, flush: 'post' }
    )

    function handleMouseleave(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        eventTarget.removeEventListener('mousemove', handleMousemove)
        removeTableVerticalBorders(table)
    }

    function handleMouseenter(event: MouseEvent) {
        if (!vm.props.resizable || vm.proxy.getIsDragging()) return
        const eventTarget = event.target as HTMLElement
        const targetColIndex = eventTarget.dataset.colIndex
        eventTarget.addEventListener('mousemove', handleMousemove)
        setColumnVerticalBorder(table, targetColIndex)
    }

    function handleMousemove(event: MouseEvent) {
        if (vm.proxy.getIsDragging()) return
        const eventTarget = event.target as HTMLElement
        const { width, x } = eventTarget.getBoundingClientRect()
        const mouseOffsetInside = event.clientX - x
        const { start, end } = getMouseLimits(width, RESIZE_SENSITIVITY_OFFSET)
        const addListener =
            mouseOffsetInside <= start || mouseOffsetInside >= end
        mousePosition = addListener
            ? mouseOffsetInside <= start
                ? 'start'
                : 'end'
            : 'default'
        if (addListener) {
            eventTarget.addEventListener('mousedown', initColumnResize)
            eventTarget.style.cursor = 'ew-resize'
            vm.proxy.setIsResizing(true)
        } else {
            eventTarget.removeEventListener('mousedown', initColumnResize)
            eventTarget.style.cursor = 'default'
            vm.proxy.setIsResizing(false)
        }
    }

    function initColumnResize(event: MouseEvent) {
        const th = event.target as HTMLElement
        if (th.tagName !== 'TH') return
        targetIndex = getColIndex(th)
        if (targetIndex - calculateColIndexOffset(table) === 0) return
        if (mousePosition === 'start') targetIndex--
        window.addEventListener('mousemove', resizeColumn)
        window.addEventListener('mouseup', stopResizing)
    }

    function stopResizing() {
        window.removeEventListener('mousemove', resizeColumn)
        window.removeEventListener('mouseup', stopResizing)
        removeTableVerticalBorders(table)
        const newColumns = getColumnsWithUpdatedWidth(table, vm.props.columns)
        vm.proxy.updateColumns(newColumns)
    }

    function resizeColumn(event: MouseEvent) {
        if (targetIndex < 0) return
        const firstRow = table.rows[0]
        const { x } = firstRow.children[targetIndex].getBoundingClientRect()
        const fromStartToMouse = event.clientX - x
        browseNestedNodes(
            table,
            (el) =>
                (el.tagName === 'TH' || el.tagName === 'TD') &&
                targetIndex &&
                getColIndex(el) === targetIndex &&
                fromStartToMouse >= MIN_CELL_WIDTH, // if
            (el) => {
                el.style.width = `${fromStartToMouse}px` // then
            }
        )
    }
}
