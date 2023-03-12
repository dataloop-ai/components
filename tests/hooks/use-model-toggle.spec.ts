import { mountComposition } from 'vue-composition-test-utils'
import { Ref } from 'vue-demi'
import useModelToggle from '../../src/hooks/use-model-toggle'
import { test, expect, vi } from 'vitest'

test('should get current value when trigger method', function () {
    const wrapper = mountComposition(() =>
        useModelToggle({
            showing: { value: true } as Ref<boolean>,
            canShow: vi.fn(),
            handleShow: vi.fn(),
            handleHide: vi.fn(),
            processOnMount: true
        })
    )
    expect(typeof wrapper.result.current!.show).toBe('function')
    expect(typeof wrapper.result.current!.hide).toBe('function')
    expect(typeof wrapper.result.current!.toggle).toBe('function')
})
