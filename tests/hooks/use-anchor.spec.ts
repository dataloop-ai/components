import { mountComposition } from 'vue-composition-test-utils'
import useAnchor from '../../src/hooks/use-anchor'
import { test, it, expect, vi } from 'vitest'

test('should get current value when trigger method', function () {
    const wrapper = mountComposition(() =>
        useAnchor({ configureAnchorEl: vi.fn() })
    )
    expect(wrapper.result.current!.anchorEl.value).toEqual(null)
    expect(typeof wrapper.result.current!.canShow).toBe('function')
    expect(wrapper.result.current!.anchorEvents).toEqual({})
})
