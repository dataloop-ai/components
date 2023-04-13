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

export function insertAfter(newNode: HTMLElement, existingNode: HTMLElement) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
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
    targetIndex: any
) {
    const newLayout = [...layout]
    const temp = newLayout[sourceIndex.row][sourceIndex.column]
    newLayout[sourceIndex.row][sourceIndex.column] =
        newLayout[targetIndex.row][targetIndex.column]
    newLayout[targetIndex.row][targetIndex.column] = temp

    return newLayout
}
