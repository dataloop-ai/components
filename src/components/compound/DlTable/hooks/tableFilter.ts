import { computed, watch, nextTick } from 'vue-demi'
import {
    DlTableFilterMethod,
    DlTableRow,
    DlTableFilter,
    DlTableColumn
} from '../types'
import { stateManager } from '../../../../StateManager'

export const useTableFilterProps = {
    filter: [String, Object],
    filterMethod: Function
}

type CellValueFn = (col: DlTableColumn, row: DlTableRow) => any

const SEPARATOR = '\u0000'

const toHaystack = (val: any) => {
    const str = val + ''
    return str === 'undefined' || str === 'null' ? '' : str.toLowerCase()
}

/**
 * One lowercase string per row holding every visible column value.
 * Values are separated so a term never matches across two columns.
 */
export function buildSearchIndex(
    rows: DlTableRow[],
    cols: DlTableColumn[],
    cellValue: CellValueFn
) {
    return rows.map((row) =>
        cols.map((col) => toHaystack(cellValue(col, row))).join(SEPARATOR)
    )
}

const warnObjectFilter = () =>
    stateManager.logger.warn(
        'DlTable: an object `filter` needs a custom `filterMethod`; the filter was ignored'
    )

export function useTableFilter(
    props: any,
    setPagination: Function,
    getRows?: () => DlTableRow[],
    getCols?: () => DlTableColumn[],
    cellValue?: CellValueFn
) {
    const computedFilterMethod = computed(() => {
        if (props.filterMethod) {
            return props.filterMethod
        }

        const tableFilter: DlTableFilterMethod = (
            rows: DlTableRow[],
            filterTerms: DlTableFilter,
            cols: DlTableColumn[],
            cellValue: CellValueFn
        ) => {
            if (filterTerms && typeof filterTerms !== 'string') {
                warnObjectFilter()
                return rows
            }
            const lowerTerms = filterTerms ? filterTerms.toLowerCase() : ''
            return rows.filter((row) =>
                cols.some(
                    (col) =>
                        toHaystack(cellValue(col, row)).indexOf(lowerTerms) !==
                        -1
                )
            )
        }

        return tableFilter
    })

    // rebuilt only when rows, visible columns or a displayed value change,
    // not on every keystroke
    const searchIndex = computed(() =>
        buildSearchIndex(getRows(), getCols(), cellValue)
    )

    function filterRows(filterTerms: DlTableFilter): DlTableRow[] {
        const rows = getRows()
        if (props.filterMethod) {
            return computedFilterMethod.value(
                rows,
                filterTerms,
                getCols(),
                cellValue
            )
        }
        if (typeof filterTerms !== 'string') {
            warnObjectFilter()
            return rows
        }
        const lowerTerms = filterTerms.toLowerCase()
        const index = searchIndex.value
        return rows.filter((_, i) => index[i].indexOf(lowerTerms) !== -1)
    }

    watch(
        () => props.filter,
        () => {
            nextTick(() => {
                setPagination({ page: 1 }, true)
            })
        },
        { deep: true }
    )

    return { computedFilterMethod, filterRows }
}
