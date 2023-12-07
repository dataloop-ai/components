import { mount } from '@vue/test-utils'
import PaginationLegend from '../../src/components/compound/DlPagination/components/PaginationLegend.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('PaginationLegend', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(PaginationLegend, {
                props: {
                    from: 1,
                    to: 10,
                    total: 1000,
                    itemsName: 'items'
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right text', function () {
            expect(wrapper.text()).toBe('Showing 1 - 10 of 1000 items')
        })

        describe('When set total prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    total: null
                })
            })
            it('should have the right text', function () {
                expect(wrapper.text()).toBe('Showing 1 - 10')
            })
        })
    })
})
