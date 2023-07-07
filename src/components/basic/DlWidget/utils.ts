import { cloneDeep } from 'lodash'
import { DlGridSideType } from '../DlGrid/types'

export function leastCommonMultiple(arr: number[]) {
    if (!arr) return
    const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)
    return arr.reduce(lcm)
}

export function getGridTemplate(layout: number[][]) {
    if (!layout) return
    const flatLayout = layout.map((el) => el.length)
    const template = []
    const lcm = leastCommonMultiple(flatLayout)
    for (let i = 0; i < flatLayout.length; i++) {
        const columns = flatLayout[i]
        let columnTrack = 1
        for (let j = 0; j < columns; j++) {
            let gridSpan = lcm / columns
            template.push(`${columnTrack} / ${gridSpan + columnTrack}`)
            columnTrack += gridSpan
            gridSpan += gridSpan
        }
    }
    return template
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
    layout: number[][],
    sourceIndex: any,
    targetIndex: any,
    side: DlGridSideType,
    maxElements: number
) {
    const newLayout = cloneDeep(layout)

    const removedElement = newLayout[sourceIndex.row].splice(
        sourceIndex.column,
        1
    )
    newLayout[targetIndex.row].splice(
        side === 'right' ? targetIndex.column + 1 : targetIndex.column,
        0,
        removedElement[0]
    )

    return isTooLarge(newLayout, maxElements)
        ? moveElementsToNextIndex(newLayout, maxElements)
        : newLayout
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
