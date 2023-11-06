import { useNestedTableFilter } from '../../../src/components/compound/DlTreeTable/hooks/nestedTableFilter'
import { describe, it, expect, vi } from 'vitest'
import { DlTableRow } from '../../../src/components/compound/types'

const ROWS = [
    {
        name: 'Ice cream ',
        fat: 9,
        selected: [] as string[],
        children: [{ name: 'Frozen Yogurt', fat: 6, selected: [] as string[] }]
    },
    { name: 'Eclair', fat: 16, selected: [] as string[], childred: [] }
] as DlTableRow[]

const filterMethod = (row: DlTableRow) => row.name.includes('Frozen')

describe('use-table-filter', () => {
    it('should filter the rows', function () {
        const { filteredRows } = useNestedTableFilter(ROWS, filterMethod)
        expect(
            filteredRows.value.filter(
                (row) => row.name === ROWS[0].children[0].name
            )[0]
        ).toEqual(ROWS[0].children[0])
    })
})
