import { useTableRowExpandEmits } from '../DlTable/hooks/tableRowExpand'
import { useTreeTableRowSelectionEmits } from './utils/treeTableRowSelection'

export const emits = [
    'request',
    'virtual-scroll',
    'row-reorder',
    'col-update',
    'row-click',
    'th-click',
    'row-dblclick',
    'row-contextmenu',
    'update-visible-columns',
    ...useTableRowExpandEmits,
    ...useTreeTableRowSelectionEmits
]
