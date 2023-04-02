import { mountComposition } from 'vue-composition-test-utils'
import { useTableRowExpand } from '../../../src/components/compound/DlTable/hooks/tableRowExpand'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const emitFn = vi.fn()

describe('useTableRowExpand', () => {
    const wrapper = mountComposition(() =>
        useTableRowExpand({ expanded: false }, emitFn)
    )

    beforeEach(() => {
        emitFn.mockClear()
    })

    const { isRowExpanded, setExpanded, updateExpanded } =
        wrapper.result.current!

    it('should return the expected properties & methods', () => {
        expect(typeof isRowExpanded).toBe('function')
        expect(typeof setExpanded).toBe('function')
        expect(typeof updateExpanded).toBe('function')
    })

    describe('updateExpanded', () => {
        it('should add element to target & emit "update:expanded"', () => {
            updateExpanded('key', true)
            expect(emitFn).toHaveBeenCalledWith('update:expanded', ['key'])
        })

        it('should remove element from target & update the inner state', () => {
            const localwrapper = mountComposition(() =>
                useTableRowExpand({ expanded: void 0 }, emitFn)
            )
            localwrapper.result.current!.updateExpanded('key', true)
            localwrapper.result.current!.updateExpanded('key', false)
            expect(emitFn).not.toHaveBeenCalled()
        })
    })
})
