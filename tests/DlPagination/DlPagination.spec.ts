import { mount } from '@vue/test-utils'
import { nextTick } from 'vue-demi'
import { DlPagination } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlPagination', () => {
    it('should render the pagination component', async () => {
        const wrapper = mount(DlPagination, {
            props: {
                maxPages: 6,
                totalItems: 1002,
                rowsPerPage: 50,
                modelValue: 2
            }
        })

        expect(wrapper.vm.rowFrom).toBe(51)
        expect(wrapper.vm.rowTo).toBe(100)

        await wrapper.setProps({
            modelValue: 21
        })

        expect(wrapper.vm.rowFrom).toBe(1001)
        expect(wrapper.vm.rowTo).toBe(1002)

        wrapper.vm.rowsPerPageState = 10
        await nextTick()
        expect(wrapper.vm.value).toEqual(1)
    })
})
