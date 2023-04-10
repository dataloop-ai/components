import { DlConfusionMatrixCell, DlConfusionMatrixCellLabel } from './types'

export function getCellWidth() {
    return document.querySelector('.matrix__cell').getBoundingClientRect().width
}

export function setZoom(zoom: number, el: HTMLElement) {
    const transformOrigin = [0, 0]
    const p = ['webkit', 'moz', 'ms', 'o']
    const s = 'scale(' + zoom + ')'
    const oString =
        transformOrigin[0] * 100 + '% ' + transformOrigin[1] * 100 + '%'

    for (let i = 0; i < p.length; i++) {
        el.style[(p[i] + 'Transform') as any] = s
        el.style[(p[i] + 'TransformOrigin') as any] = oString
    }

    el.style['transform'] = s
    el.style['transformOrigin'] = oString
}

export function validateMatrix(
    matrix: number[][],
    labels: string[] | DlConfusionMatrixCellLabel[]
) {
    let validation = true
    if (matrix.length !== labels.length) return false
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length !== matrix.length) validation = false
    }
    return validation
}

export function normalizeMatrix(flatMatrix: DlConfusionMatrixCell[]) {
    const values = flatMatrix.map((cell) => cell.value)
    const largest = Math.max(...values)
    flatMatrix.forEach((cell) => {
        cell.unnormalizedValue = cell.value
        cell.value = Number((cell.value / largest).toFixed(1))
    })
    return flatMatrix
}

export function getGradationValues(matrix: number[][], step = 5) {
    let max = Number.MIN_VALUE
    let min = Number.MAX_VALUE
    matrix.forEach((row) => {
        row.forEach((cell) => {
            if (cell > max) max = cell
            if (cell < min) min = cell
        })
    })
    const range = (max - min) / step
    const gradationValues = []
    let amount = 0
    for (let i = 0; i < step; i++) {
        gradationValues.push(Number((amount + range).toFixed(1)))
        amount += range
    }
    return gradationValues.reverse()
}
