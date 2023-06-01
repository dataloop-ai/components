import { mount } from '@vue/test-utils'
import RowsSelector from '../../src/components/compound/DlPagination/components/RowsSelector.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('RowsSelector', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(RowsSelector, {
                props: {
                    modelValue: 10,
                    options: [10, 25, 50],
                    itemsName: 'items'
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right text', function () {
            expect(wrapper.text()).toContain('items per page:')
        })
        describe('When set selected item', () => {
            beforeAll(() => {
                wrapper.vm.setSelectedItem(25)
            })

            it('should emitted modelValue event', function () {
                expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
            })
        })
    })
})
