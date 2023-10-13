import { getElementAbove } from './get-element-above'
import { removeAllChildNodes } from './remove-child-nodes'
import {
    calculateColIndexOffset,
    getColIndex,
    getTableColumn,
    getTreeTableColumn,
    justifyMouseInsideTargetCell,
    removeTableVerticalBorders,
    swapTableColumns,
    swapTreeTableColumns
} from './table-columns'
import { isVue2, watch } from 'vue-demi'

export function applyDraggableColumns(
    table: HTMLTableElement,
    vm?: any,
    draggableClone?: HTMLDivElement
) {
    const isTreeTable = vm.props.isTreeTable
    let originalColIndex: number = null
    let sourceColIndex: number = null
    let targetColIndex: number = null
    let sourceCellWidth: number = null

    const colIndexOffset = calculateColIndexOffset(table)

    watch(
        () => vm.props.columns,
        () => {
            const vnodeEl = isVue2 ? vm.vnode.elm : vm.vnode.el
            if (!vnodeEl) return
            table = vnodeEl.querySelector('table')
            draggableClone = document.querySelector('.dl-table__drag')
            const thead = table.querySelector('thead')
            if (!thead) return
            thead.addEventListener('mousedown', handleMousedown)
        },
        {
            flush: 'post',
            immediate: true
        }
    )

    function handleMousedown(event: MouseEvent) {
        if (!vm.proxy.hasDraggableColumns || vm.proxy.getIsResizing()) return
        vm.proxy.setIsDragging(true)
        removeTableVerticalBorders(table)
        const eventTarget = event.target as HTMLElement
        sourceCellWidth = eventTarget.getBoundingClientRect().width
        draggableClone.appendChild(generateColumnClone(eventTarget))
        handleMousemove(event)
        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
    }

    function handleMouseup() {
        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup)
        removeAllChildNodes(draggableClone)
        vm.proxy.setIsDragging(false)
        vm.proxy.reorderColumns(
            originalColIndex - colIndexOffset,
            targetColIndex - colIndexOffset
        )
        sourceColIndex = null
    }

    function handleMousemove(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        const closestCell =
            getElementAbove(eventTarget, 'dl-th') ||
            getElementAbove(eventTarget, 'dl-td')

        draggableClone.style.top = `${event.clientY + 20}px`
        draggableClone.style.left = `${
            event.clientX - draggableClone.getBoundingClientRect().width / 2
        }px`
        const newTargetColIndex = getColIndex(closestCell)

        if (
            newTargetColIndex === undefined ||
            !justifyMouseInsideTargetCell(
                event,
                closestCell,
                newTargetColIndex,
                sourceColIndex,
                sourceCellWidth
            )
        )
            return

        if (
            newTargetColIndex !== targetColIndex &&
            newTargetColIndex !== sourceColIndex
        ) {
            if (isTreeTable) {
                swapTreeTableColumns(table, sourceColIndex, newTargetColIndex)
            } else {
                swapTableColumns(table, sourceColIndex, newTargetColIndex)
            }
            sourceColIndex = newTargetColIndex
            targetColIndex = newTargetColIndex
        }
    }

    function generateColumnClone(eventTarget: HTMLElement) {
        const targetTh = getElementAbove(eventTarget, 'dl-th')
        const colIndex = getColIndex(targetTh)
        sourceColIndex = colIndex
        originalColIndex = colIndex
        return isTreeTable
            ? getTreeTableColumn(table, sourceColIndex)
            : getTableColumn(table, sourceColIndex)
    }
}
