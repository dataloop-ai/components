// 25-30,48-50,56-58,65-91
import { computed } from 'vue'
import { mountComposition } from 'vue-composition-test-utils'
import { useTableColumnSelection } from '../../../src/components/DlTable/hooks/tableColumnSelection'
import { TablePagination } from '../../../src/components/DlTable/hooks/tablePagination'

const COLUMNS = [
    { name: 'name', label: 'Dessert name', field: 'name' },
    { name: 'fat', label: 'Fat (g)', field: 'fat' }
]

const FIRST_ROW_COLUMN = 'color: red'

const ROWS = [
    {
        name: 'Frozen Yogurt',
        fat: 6,
        selected: [] as string[],
        style: FIRST_ROW_COLUMN
    },
    { name: 'Ice cream ', fat: 9, selected: [] as string[] },
    { name: 'Eclair', fat: 16, selected: [] as string[] }
]

const paginationRef = computed(() => ({}))
const hasSelectionMode = computed(() => false)
const hasDraggableRows = computed(() => false)

describe('use-table-column-selection', () => {
    it('should get current value when trigger method', () => {
        const wrapper = mountComposition(() =>
            useTableColumnSelection(
                {
                    columns: COLUMNS,
                    rows: ROWS
                } as any,
                paginationRef,
                hasSelectionMode,
                hasDraggableRows
            )
        )

        expect(wrapper.result.current?.computedCols.value.length).toBe(
            COLUMNS.length
        )
    })

    it('should return the proper computed values', () => {
        const COLSPAN = 6
        const EXPECTED_COL_LIST = [
            {
                name: 'name',
                label: 'Dessert name',
                field: 'name'
            },
            {
                name: 'fat',
                label: 'Fat (g)',
                field: 'fat'
            }
        ]

        const wrapper = mountComposition(() =>
            useTableColumnSelection(
                {
                    columns: COLUMNS,
                    rows: ROWS,
                    tableColspan: COLSPAN
                } as any,
                paginationRef,
                hasSelectionMode,
                hasDraggableRows
            )
        )

        expect(wrapper.result.current?.computedColspan.value).toBe(COLSPAN)
        expect(wrapper.result.current?.computedCols.value[0].thClass).toBe(
            'text-right'
        )
    })
})
