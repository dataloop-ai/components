import { browseNestedNodes } from './browse-nested-nodes'

export function setColumnVerticalBorder(
    table: HTMLTableElement,
    index: string
) {
    browseNestedNodes(
        table,
        (el) => index && el.dataset.colIndex === index,
        (el) => {
            el.classList.add('vertical-border')
        }
    )
}

export function removeTableVerticalBorders(table: HTMLElement) {
    browseNestedNodes(
        table,
        (el) => !!el.dataset.colIndex,
        (el) => {
            el.classList.remove('vertical-border')
        }
    )
}

export function getColIndex(el: Node) {
    if (!el) return
    return Array.from(el.parentElement.children).indexOf(el as HTMLElement)
}
