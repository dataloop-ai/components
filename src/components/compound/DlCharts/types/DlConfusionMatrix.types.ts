export interface DlConfusionMatrixCell {
    value: number
    unnormalizedValue: number
    xLabel: string | DlConfusionMatrixLabel
    yLabel: string | DlConfusionMatrixLabel
    x: number
    y: number
    link?: string
}

export interface DlConfusionMatrixLabel {
    title: string
    image: string
}

export interface DlConfusionMatrixBrushState {
    min: number
    max: number
}
