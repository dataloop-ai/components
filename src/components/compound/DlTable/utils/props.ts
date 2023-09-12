import { PropType } from 'vue-demi'
import { DlEmptyStateProps } from '../../../basic/DlEmptyState/types'
import { useTableActionsProps } from '../hooks/tableActions'
import { commonVirtScrollProps } from '../../../shared/DlVirtualScroll/useVirtualScroll'
import { useTableRowExpandProps } from '../hooks/tableRowExpand'
import { useTablePaginationProps } from '../hooks/tablePagination'
import { useTableFilterProps } from '../hooks/tableFilter'
import { useTableSortProps } from '../hooks/tableSort'
import { useTableColumnSelectionProps } from '../hooks/tableColumnSelection'
import { useTableRowSelectionProps } from '../hooks/tableRowSelection'
import { DlTableColumn, DlTableRow } from '../types'

export const props = {
    columns: {
        type: Array as PropType<DlTableColumn[]>,
        default: () => [] as DlTableColumn[]
    },
    rows: {
        type: Array as PropType<DlTableRow[]>,
        default: () => [] as DlTableRow[]
    },
    rowKey: {
        type: [String, Function],
        default: 'id'
    },
    bordered: Boolean,
    separator: {
        type: String,
        default: 'horizontal',
        validator: (v: string) =>
            ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    draggable: {
        type: String,
        default: 'none',
        validator: (v: string) =>
            ['rows', 'columns', 'none', 'both'].includes(v)
    },
    title: { type: String, default: '' },
    color: {
        type: String,
        default: 'dl-color-darker'
    },
    loading: Boolean,
    dense: Boolean,
    resizable: Boolean,
    hideNoData: Boolean,
    hideHeader: Boolean,
    hideBottom: Boolean,
    virtualScroll: Boolean,
    hidePagination: Boolean,
    hideSelectedBanner: Boolean,
    selectedRowsLabel: {
        type: Function,
        default: (val: number) => `${val} records selected`
    },
    loadingLabel: {
        type: String,
        default: 'Loading...'
    },
    noResultsLabel: {
        type: String,
        default: 'There are no results to display'
    },
    noDataLabel: {
        type: String,
        default: 'No data available'
    },
    virtualScrollTarget: {
        type: Object as PropType<HTMLElement>,
        default: null as unknown as PropType<HTMLElement>
    },
    titleClass: {
        type: [String, Array, Object],
        default: null as unknown as PropType<any[]>
    },
    tableStyle: {
        type: [String, Array, Object],
        default: null as unknown as PropType<any[]>
    },
    tableClass: {
        type: [String, Array, Object],
        default: null as unknown as PropType<any[]>
    },
    tableHeaderStyle: {
        type: [String, Array, Object],
        default: null as unknown as PropType<any[]>
    },
    tableHeaderClass: {
        type: [String, Array, Object],
        default: null as unknown as PropType<any[]>
    },
    noHover: Boolean,
    isEmpty: Boolean,
    emptyStateProps: {
        type: Object as PropType<DlEmptyStateProps>,
        default: () =>
            ({
                title: '',
                subtitle: 'No data to show yet',
                icon: 'icon-dl-dataset-filled'
            } as unknown as PropType<DlEmptyStateProps>)
    },
    scrollDebounce: {
        type: Number,
        default: 100
    },
    flatTreeData: {
        type: Boolean,
        default: false
    },
    ...useTableActionsProps,
    ...commonVirtScrollProps,
    ...useTableRowExpandProps,
    ...useTablePaginationProps,
    ...useTableFilterProps,
    ...useTableSortProps,
    ...useTableColumnSelectionProps,
    ...useTableRowSelectionProps
}
