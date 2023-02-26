import { mountComposition } from 'vue-composition-test-utils'
import useAnchor from '../../src/hooks/use-anchor'

test('should get current value when trigger method', function () {
    const wrapper = mountComposition(() =>
        useAnchor({ configureAnchorEl: jest.fn() })
    )
    expect(wrapper.result.current!.anchorEl.value).toEqual(null)
    expect(typeof wrapper.result.current!.canShow).toBe('function')
    expect(wrapper.result.current!.anchorEvents).toEqual({})
})
