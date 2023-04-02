import { mount } from '@vue/test-utils'
import PageNavigation from '../../src/components/compound/DlPagination/components/PageNavigation.vue'
import { describe, it, expect } from 'vitest'

describe('PageNavigation', () => {
    it('should render the page navigation', async () => {
        const wrapper = mount(PageNavigation, {
            props: {
                max: 10,
                maxPages: 6
            }
        })

        expect(wrapper.vm.isFirstPage).toBe(true)

        await wrapper.setProps({
            modelValue: 5,
            max: 5
        })
        expect(wrapper.vm.isLastPage).toBe(true)

        let btns = wrapper.findAll('button')
        await btns[0].trigger('click')

        expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
        expect(wrapper.vm.value).toBe(1)

        wrapper.vm.setByOffset(2)
        expect(wrapper.vm.value).toBe(3)

        await wrapper.setProps({
            boundaryNumbers: true,
            max: 100,
            maxPages: 6,
            modelValue: 20
        })

        btns = wrapper.findAll('button')
        expect(btns[1].text()).toEqual('...')
        expect(btns[btns.length - 2].text()).toEqual('...')
    })

    it('should not pass the validation for the "max pages" value ', () => {
        const validator = PageNavigation.props.maxPages.validator

        expect(validator(-1)).toBe(false)
        expect(validator(10)).toBe(true)
    })
})
