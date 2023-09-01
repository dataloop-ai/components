import { useTableRowExpandEmits } from '../hooks/tableRowExpand'
import { useTableRowSelectionEmits } from '../hooks/tableRowSelection'

export const emits = [
    'request',
    'virtual-scroll',
    'row-reorder',
    'col-reorder',
    'row-click',
    'th-click',
    'row-dblclick',
    'row-contextmenu',
    'update:pagination',
    ...useTableRowExpandEmits,
    ...useTableRowSelectionEmits
]
