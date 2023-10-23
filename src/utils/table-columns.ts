import { cloneDeep } from 'lodash'
import { DlTableColumn } from '../types'
import { browseNestedNodes } from './browse-nested-nodes'
import { swapNodes } from './swap-nodes'

const DEFAULT_COL_WIDTH = 10

export function setColumnVerticalBorder(
    table: HTMLTableElement,
    index: string
) {
    browseNestedNodes(
        table,
        (el) => index && el.dataset.colIndex === index, // if
        (el) => {
            el.classList.add('vertical-border') // then
        }
    )
}

export function removeTableVerticalBorders(table: HTMLElement) {
    browseNestedNodes(
        table,
        (el) => !!el.dataset.colIndex, // if
        (el) => {
            el.classList.remove('vertical-border') //then
        }
    )
}

export function calculateColIndexOffset(table: HTMLTableElement) {
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
export function getColIndex(el: Node) {
    if (!el) return
    return Array.from(el.parentElement.children).indexOf(el as HTMLElement)
}

export function getTableColumn(
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

export function getTreeTableColumn(
    table: HTMLTableElement,
    columnIndex: number
): HTMLTableElement {
    const th = table.querySelector('thead').children[0].children[
        columnIndex
    ] as HTMLElement
    const thColIndex = th.dataset.colIndex
    const newTable = table.cloneNode(true) as HTMLTableElement
    const width = th.getBoundingClientRect().width
    browseNestedNodes(
        newTable,
        (el) => el.dataset.colIndex && el.dataset.colIndex !== thColIndex, // if
        (el) => {
            el.parentNode?.removeChild(el) // then
        },
        (el) => !!el.dataset.colIndex, // else if
        (el) => {
            el.style.width = `${width}px` // then
            el.classList.remove('vertical-border')
        }
    )
    newTable.style.width = `${width}px`
    newTable.style.overflow = 'hidden'
    return newTable
}

export function swapTableColumns(
    table: HTMLTableElement,
    sourceIndex: number,
    targetIndex: number
): void {
    const rows = table.rows

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const cells = row.cells

        const tempCell = cells[sourceIndex].cloneNode(true) as HTMLElement
        cells[sourceIndex].parentNode!.replaceChild(
            cells[targetIndex].cloneNode(true),
            cells[sourceIndex]
        )
        cells[targetIndex].parentNode!.replaceChild(
            tempCell,
            cells[targetIndex]
        )
    }
}

export function swapTreeTableColumns(
    table: HTMLTableElement,
    sourceIndex: number,
    targeIndex: number
): void {
    browseNestedNodes(
        table,
        (el) =>
            (el.tagName === 'TH' || el.tagName === 'TD') &&
            getColIndex(el) === targeIndex, // if
        (targetEl) => {
            const parent = targetEl.parentElement
            swapNodes(targetEl, parent.children[sourceIndex] as HTMLElement) // then
        }
    )
}

export function getMouseLimits(width: number, sensitivityOffset: number) {
    const end = width - sensitivityOffset
    return {
        start: width - end,
        end
    }
}

export function justifyMouseInsideTargetCell(
    event: MouseEvent,
    target: HTMLElement,
    newIndex: number,
    oldIndex: number,
    sourceCellWidth: number
) {
    if (!target) return false

    const direction = newIndex > oldIndex ? 'right' : 'left'
    const { width, x } = target.getBoundingClientRect()
    const mouseOffsetInside = event.clientX - x

    return (
        (direction === 'left' && mouseOffsetInside <= sourceCellWidth) ||
        (direction === 'right' && width - mouseOffsetInside <= sourceCellWidth)
    )
}

function fitWidthToContent(el: HTMLElement, colWidth: number) {
    if (el.tagName !== 'TH') return colWidth
    const textNode = Array.from(el.querySelector('.inner-th').childNodes).find(
        (node) => node.nodeType === 3
    )
    const fontSize = parseInt(window.getComputedStyle(el).fontSize)
    const width = (textNode.nodeValue.length * fontSize) / 2
    return width > 100 ? width : 100
}

export function setAllColumnWidths(
    table: HTMLElement,
    columns: DlTableColumn[],
    fitAllColumns: boolean
) {
    const hasWidth = columns.some((col) => col.hasOwnProperty('width'))
    if (!hasWidth) return
    // table.style.tableLayout = fitAllColumns ? 'auto' : 'fixed'
    columns.forEach((col, i) => {
        browseNestedNodes(
            table,
            (el) =>
                (el.tagName === 'TH' || el.tagName === 'TD') &&
                parseInt(el.dataset.colIndex) === i,
            (targetEl) => {
                const width = fitWidthToContent(targetEl, col.width)
                targetEl.style.width = `${width ?? DEFAULT_COL_WIDTH}px` // then
            }
        )
    })
}

export function getColumnsWithUpdatedWidth(
    table: HTMLTableElement,
    columns: DlTableColumn[]
) {
    const thArray = Array.from(
        table.querySelector('thead').querySelectorAll('th')
    ).filter((th) => !!th.dataset.colIndex)
    if (thArray.length !== columns.length) return columns

    const newColumns = cloneDeep(columns)
    thArray.forEach((th, i) => {
        newColumns[i].width = th.getBoundingClientRect().width
    })
    return newColumns
}
