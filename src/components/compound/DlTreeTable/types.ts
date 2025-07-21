import { DlTableRow } from '../DlTable/types'

export interface RowExpandEventData {
    row: DlTableRow
    rowKey: string
    isExpanded: boolean
    level: number
    hasChildren: boolean
}
