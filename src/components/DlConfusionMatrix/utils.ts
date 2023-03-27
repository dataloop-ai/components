import { MatrixCell } from './types'

export function validateMatrix(matrix: number[][], labels: string[]) {
    let validation = true
    if (matrix.length !== labels.length) return false
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length !== matrix.length) validation = false
    }
    return validation
}

export function normalizeMatrix(flatMatrix: MatrixCell[]) {
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
        gradationValues.push(amount + range)
        amount += range
    }
    return gradationValues.reverse()
}
