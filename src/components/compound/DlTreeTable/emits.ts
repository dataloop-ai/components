import { useTableRowExpandEmits } from '../DlTable/hooks/tableRowExpand'
import { useTreeTableRowSelectionEmits } from './utils/treeTableRowSelection'

export const emits = [
    'request',
    'virtual-scroll',
    'row-reorder',
    'col-reorder',
    'row-click',
    'th-click',
    'row-dblclick',
    'row-contextmenu',
    'rowDragged',
    ...useTableRowExpandEmits,
    ...useTreeTableRowSelectionEmits
]
