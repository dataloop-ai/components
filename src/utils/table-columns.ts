import { browseNestedNodes } from './browse-nested-nodes'

/**
 * Detached copy of one column (header and body cells) of `table`, used as the
 * floating preview while a column is dragged.
 */
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
        }
    )
    newTable.style.width = `${width}px`
    newTable.style.overflow = 'hidden'
    return newTable
}
