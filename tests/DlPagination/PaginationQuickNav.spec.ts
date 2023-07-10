import { mount } from '@vue/test-utils'
import QuickNavigation from '../../src/components/compound/DlPagination/components/QuickNavigation.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('QuickNavigation', () => {
    const MIN = 1
    const MAX = 10

    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(QuickNavigation, {
                props: {
                    min: MIN,
                    max: MAX,
                    modelValue: 1
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        describe('When emit update of model value after input', () => {
            beforeAll(() => {
                const input = wrapper.find('input')

                input.trigger('keydown', { key: '2' })
                input.trigger('keyup', { key: '2' })
                input.trigger('keydown', { key: 'Enter' })
                input.trigger('keyup', { key: 'Enter' })
            })
            it('should emitted modelValue', function () {
                expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
            })
        })
        describe('When handle values bigger than MAX and smaller than MIN', () => {
            it('should have the MAX modelValue', function () {
                wrapper.vm.inputValue = '999'
                wrapper.vm.handleNavigation()
                expect(
                    (wrapper.emitted()['update:modelValue'][1] as any[])[0]
                ).toBe(MAX)
            })
            it('should have the MIN modelValue', function () {
                wrapper.vm.inputValue = '-10'
                wrapper.vm.handleNavigation()
                expect(
                    (wrapper.emitted()['update:modelValue'][2] as any[])[0]
                ).toBe(MIN)
            })
        })
    })
})
