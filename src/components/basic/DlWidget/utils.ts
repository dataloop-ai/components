import { cloneDeep } from 'lodash'
import { DlGridSideType } from '../DlGrid/types'

export function getGridTemplate(layout_: string[], widgetsPerRow: number) {
    if (!layout_) return

    const layout: string[][] = []
    let index = 0

    while (index < layout_.length) {
        const row = layout_.slice(index, index + widgetsPerRow)
        layout.push(row)
        index += widgetsPerRow
    }

    return layout
}

export function getElementAbove(el: HTMLElement, className: string) {
    //@ts-ignore
    for (; el && el !== document; el = el.parentNode) {
        if (el.classList.contains(className)) {
            return el
        }
    }
}

export function addMouseEnter(className: string, method: EventListenerObject) {
    Array.from(document.getElementsByClassName(className)).forEach((widget) => {
        widget.addEventListener('mouseenter', method)
    })
}

export function removeMouseEnter(
    className: string,
    method: EventListenerObject
) {
    Array.from(document.getElementsByClassName(className)).forEach((widget) => {
        widget.removeEventListener('mouseenter', method)
    })
}

export function findIndexInMatrix(matrix: number[][], nr: number) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === nr) return { row: i, column: j }
        }
    }
}

export function swapElemensInMatrix(
    layout: string[][],
    sourceEl: HTMLElement,
    targetEl: HTMLElement,
    side: DlGridSideType,
    maxElements: number,
    gridElements: Element[]
) {
    if (!sourceEl || !targetEl) {
        return layout
    }
    const newLayout = cloneDeep(layout).flat(1)

    // Insert source element into target position and push all other elements to the 'side' value
    const sourceIndex = newLayout.indexOf(sourceEl.id)
    const targetIndex = newLayout.indexOf(targetEl.id)
    newLayout.splice(sourceIndex, 1)
    newLayout.splice(targetIndex, 0, sourceEl.id)

    // Reorder element order in the grid
    for (const element of gridElements) {
        (element as HTMLElement).style.order = newLayout
            .findIndex((w) => w === element.id)
            .toString()
        // YonDo: Maybe removce this method from here?
    }

    return getGridTemplate(newLayout, maxElements)
}

function moveElementsToNextIndex(
    template: number[][],
    maxElements: number
): number[][] {
    const clonedTemplate: number[][] = cloneDeep(template)
    let overflow: number[] = []

    for (let i = 0; i < clonedTemplate.length; i++) {
        let currentRow = clonedTemplate[i]
        if (overflow.length > 0) {
            currentRow = overflow.concat(currentRow)
            overflow = []
        }
        if (currentRow.length > maxElements) {
            overflow = currentRow.slice(maxElements)
            currentRow = currentRow.slice(0, maxElements)
        }
        clonedTemplate[i] = currentRow
        if (i + 1 < clonedTemplate.length && overflow.length > 0) {
            clonedTemplate[i + 1] = overflow.concat(clonedTemplate[i + 1])
            overflow = []
        }
    }
    return clonedTemplate
}

function isTooLarge(layout: number[][], max: number) {
    const lengths = layout.map((row) => row.length)
    const highest = Math.max(...lengths)
    return highest > max
}

export function isCustomEvent(event: Event): event is CustomEvent {
    return 'detail' in event
}
