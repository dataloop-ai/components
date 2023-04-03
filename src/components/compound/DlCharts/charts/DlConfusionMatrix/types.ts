export interface MatrixCell {
    value: number
    unnormalizedValue: number
    xLabel: string | Label
    yLabel: string | Label
    x: number
    y: number
}

export interface Label {
    title: string
    image: string
}

export interface BrushState {
    min: number
    max: number
}
