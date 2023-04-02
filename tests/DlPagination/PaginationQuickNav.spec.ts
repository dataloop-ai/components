import { mount } from '@vue/test-utils'
import QuickNavigation from '../../src/components/compound/DlPagination/components/QuickNavigation.vue'
import { describe, it, expect } from 'vitest'

describe('QuickNavigation', () => {
    const MIN = 1
    const MAX = 10

    const wrapper = mount(QuickNavigation, {
        props: {
            min: MIN,
            max: MAX,
            modelValue: 1
        }
    })

    it('should emit update of model value after input', async () => {
        const input = wrapper.find('input')

        input.trigger('keydown', { key: '2' })
        input.trigger('keyup', { key: '2' })
        input.trigger('keydown', { key: 'Enter' })
        input.trigger('keyup', { key: 'Enter' })

        expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
    })

    it('should handle values bigger than MAX and smaller than MIN', async () => {
        wrapper.vm.inputValue = '999'
        wrapper.vm.handleNavigation()
        expect((wrapper.emitted()['update:modelValue'][1] as any[])[0]).toBe(
            MAX
        )

        wrapper.vm.inputValue = '-10'
        wrapper.vm.handleNavigation()
        expect((wrapper.emitted()['update:modelValue'][2] as any[])[0]).toBe(
            MIN
        )
    })
})
