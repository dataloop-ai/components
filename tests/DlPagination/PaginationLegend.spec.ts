import { mount } from '@vue/test-utils'
import PaginationLegend from '../../src/components/DlPagination/PaginationLegend.vue'
import { describe, it, expect } from 'vitest'

describe('PaginationLegend', () => {
    it('should render the pagination legend', async () => {
        const wrapper = mount(PaginationLegend, {
            props: {
                from: 1,
                to: 10,
                total: 1000,
                itemsName: 'items'
            }
        })

        expect(wrapper.text()).toBe('Showing 1-10 of 1000 items')

        await wrapper.setProps({
            total: null
        })

        expect(wrapper.text()).toBe('Showing 1-10')
    })
})
