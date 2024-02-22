import { cloneDeep } from 'lodash'
import { DlTableColumn, TableStickyPosition } from '../types'
import { browseNestedNodes } from './browse-nested-nodes'
import { swapNodes } from './swap-nodes'

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
        (el) =>
            (el.dataset.colIndex && el.dataset.colIndex !== thColIndex) ||
            el.classList.contains('dl-virtual-scroll__padding'), // if
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

function getIconWidth(el: HTMLElement) {
    const iconEl = el.querySelector('.th-icons')
    const sortEl = el.querySelector('.th-sort-icon')
    return (iconEl?.scrollWidth ?? 0) + (sortEl?.scrollWidth ?? 0)
}

function addStickyPosition(
    element: HTMLElement,
    position: TableStickyPosition,
    index: number,
    totalElements: number,
    hasEditableColumns?: boolean
) {
    if (position === 'both')
        position =
            index === 0 ? 'first' : index === totalElements - 1 ? 'last' : ''
    element.style.left = position === 'first' ? '0' : ''
    if (position === 'last') {
        if (hasEditableColumns) {
            element.style.right = '20px'
        } else {
            element.style.right = '0'
        }
    }
}

export function setAllColumnWidths(
    table: HTMLElement,
    columns: DlTableColumn[],
    stickyColumns: TableStickyPosition,
    fitAllColumns: boolean,
    hasEditableColumns?: boolean
) {
    columns.forEach((col, i) => {
        browseNestedNodes(
            table,
            (el) =>
                (el.tagName === 'TH' || el.tagName === 'TD') &&
                parseInt(el.dataset.colIndex) === i,
            (targetEl) => {
                if (!fitAllColumns && targetEl.tagName === 'TH') {
                    // Calculate the width for the column
                    const width =
                        targetEl.querySelector('.inner-th').scrollWidth +
                        getIconWidth(targetEl) +
                        35
                    const calculatedWidth = (targetEl.style.width =
                        typeof col.width === 'number' || !col.width
                            ? `${width}px`
                            : col.width)
                    // Set the width of the column
                    targetEl.style.minWidth = calculatedWidth
                    targetEl.style.maxWidth = calculatedWidth
                } else if (targetEl.tagName === 'TH') {
                    // Adjust the maximum width for TH elements
                    const innerTh = targetEl.querySelector(
                        '.inner-th'
                    ) as HTMLElement
                    innerTh.style.maxWidth = '80%'
                }

                if (stickyColumns && (i === 0 || i === columns.length - 1)) {
                    // Add sticky column class and position for sticky columns
                    targetEl.classList.add('sticky-col')
                    addStickyPosition(
                        targetEl,
                        stickyColumns,
                        i,
                        columns.length,
                        hasEditableColumns
                    )
                }
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
