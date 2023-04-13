import { DlConfusionMatrixCell, DlConfusionMatrixLabel } from '../../types'

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
    matrix: number[][] | DlConfusionMatrixCell[][],
    labels: string[] | DlConfusionMatrixLabel[]
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

export function getGradationValues(
    matrix: number[][] | DlConfusionMatrixCell[][],
    step = 5
) {
    let max = Number.MIN_VALUE
    let min = Number.MAX_VALUE
    matrix.forEach((row) => {
        row.forEach((cell) => {
            const cellValue = typeof cell === 'object' ? cell.value : cell
            if (cellValue > max) max = cellValue
            if (cellValue < min) min = cellValue
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

export function flattenConfusionMatrix(
    matrix: number[][] | DlConfusionMatrixCell[][],
    labelStrings: string[] | DlConfusionMatrixLabel[]
) {
    return normalizeMatrix(
        matrix.flatMap(
            (row: number[] | DlConfusionMatrixCell[], rowIndex: number) => {
                return row.map(
                    (
                        cell: number | DlConfusionMatrixCell,
                        cellIndex: number
                    ) => {
                        const isObject = typeof cell === 'object'
                        const value = isObject ? cell.value : cell
                        return {
                            value,
                            unnormalizedValue: value,
                            xLabel: labelStrings[rowIndex],
                            yLabel: labelStrings[cellIndex],
                            x: rowIndex,
                            y: cellIndex,
                            link: isObject ? cell.link : ''
                        }
                    }
                )
            }
        )
    )
}
