export type TableProps = {
    columns: TableColumn[]
    rows: TableRow[]
    visibleColumns: string[]
    filter: Filter
    filterMethod: FilterMethod
    sortMethod: SortMethod
    selected: string[]
    expanded: string[]
    columnSortOrder: 'asc' | 'des'
    [key: string]: any
}

export type TableRow = {
    [key: string]: any
}

export type Filter = string | Record<string, any>

export type TableColumn = {
    name: string
    label: string
    field: string | ((row: TableRow) => string)
    required?: boolean
    align?: 'right' | 'left' | 'center'
    sortable?: boolean
    sort?: (a: any, b: any, rowA: TableRow, rowB: TableRow) => number
    sortOrder?: 'asc' | 'des'
    format?: (val: any, row: TableRow) => any
    style?: string | ((row: TableRow) => string)
    classes?: string | ((row: TableRow) => string)
    headerStyle?: string
    headerClasses?: string
}

export type FilterMethod = (
    rows: TableRow[],
    terms: Filter,
    cols: TableColumn[],
    getCellValue: (col: TableColumn, row: TableRow) => any
) => TableRow[]

export type SortMethod = (
    rows: TableRow[],
    sortBy: string,
    descending: boolean
) => TableRow[]

export type Pagination = {
    page: number
    rowsPerPage: number
    rowsNumber?: number
    sortBy?: string | null
    descending?: boolean
}

export type RequestProp = {
    pagination: Pagination
    filter?: FilterMethod
    getCellValue?: (col: TableColumn, row: TableRow) => any
}

export type SelectionDetails = {
    rows: TableRow[]
    keys: string[]
    added: boolean
    evt: Event
}

export type ScrollPosition = {
    index: number
    from: number
    to: number
    direction: 'increase' | 'decrease'
}

export interface EnhancedCol extends TableColumn {
    iconClass: string
    thClass: string
    tdStyle: ((row: TableRow) => string) | (() => any)
    tdClass: (row: TableRow) => string
}

export type VirtualScroll = {
    [key: string]: any
    reset: () => void
    scrollTo: (toIndex: number | string, edge?: number | string) => void
}

export type TypographyProps = {
    variant?: string
    size?: string
    uppercase?: boolean
    bold?: boolean
    color?: string
}
