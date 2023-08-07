import { cloneDeep } from 'lodash'

function leastCommonMultiple(arr: number[]) {
    if (!arr || !arr.length) {
        return
    }

    const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)
    return arr.reduce(lcm)
}

function buildNewLayoutOrder(
    layout: (string | number)[],
    matrix: (string | number)[][]
) {
    const template: (string | number)[][] = []
    let index = 0

    for (const row of matrix) {
        const templateRow: (string | number)[] = []
        for (const cell of row) {
            templateRow.push(layout[index])
            index++
        }
        template.push(templateRow)
    }

    return template
}

export function getGridTemplate(layout: (string | number)[][]) {
    if (!layout) {
        return
    }

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

export function swapElementsInMatrix(
    oldLayout: (string | number)[][],
    sourceEl: HTMLElement,
    targetEl: HTMLElement
) {
    if (!sourceEl || !targetEl) {
        return oldLayout
    }
    const newLayout = cloneDeep(oldLayout).flat(1)

    const sourceIndex = newLayout.indexOf(sourceEl.dataset.id)
    const targetIndex = newLayout.indexOf(targetEl.dataset.id)
    newLayout.splice(sourceIndex, 1)
    newLayout.splice(targetIndex, 0, sourceEl.dataset.id)

    return buildNewLayoutOrder(newLayout, oldLayout)
}
