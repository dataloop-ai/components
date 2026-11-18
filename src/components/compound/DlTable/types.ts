import { DlTextTransformOptions } from '../../shared/types'

export type TableStickyPosition = 'first' | 'last' | 'both' | ''

export interface SortingMovement {
    lastId: string
    direction: 'up' | 'down'
}

export type DlTableProps = {
    columns: DlTableColumn[]
    rows: DlTableRow[]
    visibleColumns: string[]
    filter: DlTableFilter
    filterMethod: DlTableFilterMethod
    sortMethod: DlTableSortMethod
    selected: string[]
    expanded: string[]
    columnSortOrder: 'asc' | 'des'
    [key: string]: any
}

export type DlTableRow = {
    [key: string]: any
    children?: DlTableRow[]
}

export type DlTableFilter = string | Record<string, any>

export type DlTableColumn = {
    name: string
    label: string
    field?: string | ((row: DlTableRow) => string | number)
    required?: boolean
    align?: 'right' | 'left' | 'center'
    sortable?: boolean
    /** header tooltip explaining why the column is not sortable */
    sortDisabledReason?: string
    sort?: (a: any, b: any, rowA: DlTableRow, rowB: DlTableRow) => number
    sortOrder?: 'asc' | 'des'
    /**
     * Where empty (null/undefined) values go when sorting, in both directions.
     * 'comparator' passes them to `sort` instead. Default: 'last'
     */
    nullsPosition?: 'first' | 'last' | 'comparator'
    format?: (val: any, row: DlTableRow) => any
    style?: string | ((row: DlTableRow) => string)
    classes?: string | ((row: DlTableRow) => string)
    headerStyle?: string
    headerClasses?: string
    textTransform?: DlTextTransformOptions
    /** number (px) or any CSS length */
    width?: number | string
    /** minimum width in px; defaults to the table `columnMinWidth` */
    minWidth?: number
    /** maximum width in px; defaults to the table `columnMaxWidth` */
    maxWidth?: number
    /**
     * fixed: keeps its width; constrained (default) / flex: starts at its
     * content width and takes a share of the spare space
     */
    widthMode?: 'fixed' | 'flex' | 'constrained'
    /** never narrower than other columns when there is spare space */
    primary?: boolean
    /** pin to the start or end edge while scrolling horizontally */
    pinned?: 'start' | 'end'
    hint?: string
    sticky?: boolean
    ignoreTooltip?: boolean
}

export type DlTableFilterMethod = (
    rows: DlTableRow[],
    terms: DlTableFilter,
    cols: DlTableColumn[],
    getCellValue: (col: DlTableColumn, row: DlTableRow) => any
) => DlTableRow[]

export type DlTableSortMethod = (
    rows: DlTableRow[],
    sortBy: string,
    descending: boolean
) => DlTableRow[]

import { TablePagination } from './hooks/tablePagination'

export type DlTablePagination = TablePagination

export type DlTableRequestProp = {
    pagination: DlTablePagination
    filter?: DlTableFilterMethod
    getCellValue?: (col: DlTableColumn, row: DlTableRow) => any
}

export type DlTableSelectionDetails = {
    rows: DlTableRow[]
    keys: string[]
    added: boolean
    evt: Event
}

export type DlTableScrollPosition = {
    index: number
    from: number
    to: number
    direction: 'increase' | 'decrease'
}

export interface DlTableEnhancedCol extends DlTableColumn {
    iconClass: string
    thClass: string
    tdStyle: ((row: DlTableRow) => string) | (() => any)
    tdClass: (row: DlTableRow) => string
}

export type DlTableVirtualScrollType = {
    [key: string]: any
    reset: () => void
    scrollTo: (toIndex: number | string, edge?: number | string) => void
}

export type DlTableTypographyProps = {
    variant?: string
    size?: string
    uppercase?: boolean
    bold?: boolean
    color?: string
}
