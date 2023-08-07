export interface DlGridLayout {
    name: string
    value: (number | string)[][]
}

export enum DlGridMode {
    GRID = 'grid',
    FLEX = 'flex',
    LAYOUT = 'layout'
}
