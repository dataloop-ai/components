import { useTableRowExpandEmits } from '../hooks/tableRowExpand'
import { useTableRowSelectionEmits } from '../hooks/tableRowSelection'

export const emits = [
    'request',
    'virtual-scroll',
    'row-reorder',
    'col-reorder',
    /** @deprecated use `update:column-widths` (resize) or `col-reorder` (drag) */
    'col-update',
    /** name -> width in px of every column the user resized */
    'update:column-widths',
    'row-click',
    'th-click',
    'row-dblclick',
    'row-contextmenu',
    'update:pagination',
    'scroll-to-bottom',
    'scroll-to-top',
    ...useTableRowExpandEmits,
    ...useTableRowSelectionEmits
]
