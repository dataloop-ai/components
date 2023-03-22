import { ComputedRef } from 'vue'
import { mountComposition } from 'vue-composition-test-utils'
import {
    useTableRowSelection,
    useTableRowSelectionProps
} from '../../../src/components/DlTable/hooks/tableRowSelection'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TableProps, TableRow } from '../../../src/components/DlTable/types'

describe('useTableRowSelectionProps', () => {
    it('should validate the "selection" prop', () => {
        expect(useTableRowSelectionProps.selection.validator('single')).toBe(
            true
        )
    })

    it('should set the default value for "selected" prop', () => {
        expect(useTableRowSelectionProps.selected.default()).toEqual([])
    })
})

const props = {
    selected: ['key'],
    selection: 'none'
} as unknown as TableProps

const rows: TableRow[] = [{ key: 'value', test: 'value' }, { test: 'value' }]
const emitFn = vi.fn()
const getRowKey = () => 'key'

describe('useTableRowSelection', () => {
    const wrapper = mountComposition(() =>
        useTableRowSelection(
            props,
            emitFn,
            { value: rows } as ComputedRef<TableRow[]>,
            { value: getRowKey } as unknown as ComputedRef<
                (val: string | TableRow) => any
            >
        )
    )

    beforeEach(() => {
        emitFn.mockClear()
    })

    const {
        hasSelectionMode,
        singleSelection,
        multipleSelection,
        allRowsSelected,
        someRowsSelected,
        rowsSelectedNumber,

        isRowSelected,
        clearSelection,
        updateSelection
    } = wrapper.result.current!

    it('should return expected props & methods', () => {
        expect(typeof hasSelectionMode.value).toBe('boolean')
        expect(typeof singleSelection.value).toBe('boolean')
        expect(typeof multipleSelection.value).toBe('boolean')
        expect(typeof allRowsSelected.value).toBe('boolean')
        expect(typeof someRowsSelected.value).toBe('boolean')
        expect(typeof rowsSelectedNumber.value).toBe('number')
        expect(typeof isRowSelected).toBe('function')
        expect(typeof clearSelection).toBe('function')
        expect(typeof updateSelection).toBe('function')
    })

    it('should return true if row is selected', () => {
        expect(isRowSelected('key')).toBe(true)
    })

    it('should emit "update:selection" event with empty array', () => {
        clearSelection()
        expect(emitFn).toHaveBeenCalledWith('update:selected', [])
    })

    it('should emit "selection" event with the new state', () => {
        updateSelection(['test'], rows, true, emitFn)
        expect(emitFn).toHaveBeenNthCalledWith(1, 'selection', {
            rows,
            added: true,
            keys: ['test'],
            evt: emitFn
        })
        expect(emitFn).toHaveBeenNthCalledWith(
            2,
            'update:selected',
            expect.objectContaining({})
        )
    })
})
