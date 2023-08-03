import { PropType } from 'vue-demi'
import { DlEmptyStateProps } from '../../basic/DlEmptyState/types'
import { useTableActionsProps } from '../DlTable/hooks/tableActions'
import { commonVirtScrollProps } from '../../shared/DlVirtualScroll/useVirtualScroll'
import { useTableRowExpandProps } from '../DlTable/hooks/tableRowExpand'
import { useTablePaginationProps } from '../DlTable/hooks/tablePagination'
import { useTableFilterProps } from '../DlTable/hooks/tableFilter'
import { useTableSortProps } from '../DlTable/hooks/tableSort'
import { useTableColumnSelectionProps } from '../DlTable/hooks/tableColumnSelection'
import { useTableRowSelectionProps } from '../DlTable/hooks/tableRowSelection'

export const props = {
    columns: { type: Array, default: () => [] as Record<string, any>[] },
    rows: {
        type: Array,
        default: () => [] as Record<string, any>[]
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
    loading: {
        type: Boolean,
        default: false
    },
    dense: {
        type: Boolean,
        default: false
    },
    resizable: {
        type: Boolean,
        default: false
    },
    hideNoData: {
        type: Boolean,
        default: false
    },
    hideHeader: {
        type: Boolean,
        default: false
    },
    hideBottom: {
        type: Boolean,
        default: false
    },
    virtualScroll: {
        type: Boolean,
        default: false
    },
    hidePagination: {
        type: Boolean,
        default: false
    },
    hideSelectedBanner: {
        type: Boolean,
        default: false
    },
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
        default: () => ({} as DlEmptyStateProps)
    },
    scrollDebounce: {
        type: Number,
        default: 100
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
