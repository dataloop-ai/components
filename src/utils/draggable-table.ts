import { getElementAbove } from './get-element-above'
import { removeAllChildNodes } from './remove-child-nodes'
import { browseNestedNodes } from './browse-nested-nodes'
import { swapNodes } from './swap-nodes'

export function applyDraggableColumns(
    table: HTMLTableElement,
    vm?: any,
    draggableClone?: HTMLDivElement
) {
    const isTreeTable = vm.props.isTreeTable
    let originalColIndex: number = null
    let sourceColIndex: number = null
    let targetColIndex: number = null

    const colIndexOffset = calculateColIndexOffset(table)

    const thead = table.querySelector('thead')
    thead.addEventListener('mousedown', handleMousedown)

    function handleMousedown(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        draggableClone.appendChild(generateColumnClone(eventTarget))
        handleMousemove(event)
        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
    }

    function handleMouseup() {
        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup)
        removeAllChildNodes(draggableClone)
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

    return () => {}
}

function getColIndex(el: Node) {
    if (!el) return
    return Array.from(el.parentElement.children).indexOf(el as HTMLElement)
}

function calculateColIndexOffset(table: HTMLTableElement) {
    let colIndexOffset = 0
    const innerTable = table.querySelector('.inner-table')
    Array.from((innerTable || table).querySelector('tr').children).forEach(
        (th) => {
            if (th.classList.contains('empty-col')) {
                colIndexOffset++
            }
        }
    )
    return colIndexOffset
}

function getTableColumn(
    table: HTMLTableElement,
    columnIndex: number
): HTMLTableElement {
    const rowCount = table.rows.length

    const originalColumnWidth = table.rows[0].cells[columnIndex].offsetWidth
    const originalColumnHeight = table.rows[0].offsetHeight

    const columnTable: HTMLTableElement = document.createElement('table')
    const columnTbody: HTMLTableSectionElement = document.createElement('tbody')
    columnTable.appendChild(columnTbody)

    for (let i = 0; i < rowCount; i++) {
        const row = table.rows[i]
        if (row.cells.length > columnIndex) {
            const columnRow: HTMLTableRowElement = document.createElement('tr')
            const cell: HTMLTableCellElement = row.cells[columnIndex].cloneNode(
                true
            ) as HTMLTableCellElement

            cell.style.width = originalColumnWidth + 'px'
            columnRow.style.height = originalColumnHeight + 'px'

            columnRow.appendChild(cell)
            columnTbody.appendChild(columnRow)
        }
    }

    return columnTable
}

function getTreeTableColumn(
    table: HTMLTableElement,
    columnIndex: number
): HTMLTableElement {
    const th = table.querySelector('thead').children[0].children[
        columnIndex
    ] as HTMLElement
    const thColIndex = th.dataset.colIndex
    const newTable = table.cloneNode(true) as HTMLTableElement
    const width = th.getBoundingClientRect().width * 2
    browseNestedNodes(
        newTable,
        (el) => el.dataset.colIndex && el.dataset.colIndex !== thColIndex, // if
        (el) => {
            el.parentNode?.removeChild(el) // then
        },
        (el) => !!el.dataset.colIndex, // else if
        (el) => {
            el.style.width = `${width}px` // then
        }
    )
    newTable.style.width = `${width}px`
    newTable.style.overflow = 'hidden'
    return newTable
}

function swapTableColumns(
    table: HTMLTableElement,
    columnIndex1: number,
    columnIndex2: number
): void {
    const rows = table.rows

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const cells = row.cells

        const tempCell = cells[columnIndex1].cloneNode(true) as HTMLElement
        cells[columnIndex1].parentNode!.replaceChild(
            cells[columnIndex2].cloneNode(true),
            cells[columnIndex1]
        )
        cells[columnIndex2].parentNode!.replaceChild(
            tempCell,
            cells[columnIndex2]
        )
    }
}

function swapTreeTableColumns(
    table: HTMLTableElement,
    sourceIndex: number,
    targeIndex: number
): void {
    browseNestedNodes(
        table,
        (el) =>
            (el.tagName === 'TH' || el.tagName === 'TD') &&
            getColIndex(el) === targeIndex,
        (targetEl) => {
            const parent = targetEl.parentElement
            swapNodes(targetEl, parent.children[sourceIndex] as HTMLElement)
        }
    )
}
