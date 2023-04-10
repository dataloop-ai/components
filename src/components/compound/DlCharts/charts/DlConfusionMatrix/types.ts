export interface DlConfusionMatrixCell {
    value: number
    unnormalizedValue: number
    xLabel: string | DlConfusionMatrixCellLabel
    yLabel: string | DlConfusionMatrixCellLabel
    x: number
    y: number
}

export interface DlConfusionMatrixCellLabel {
    title: string
    image: string
}

export interface DlConfusionMatrixBrushState {
    min: number
    max: number
}
