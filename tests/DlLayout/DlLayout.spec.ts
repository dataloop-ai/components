import { mount } from '@vue/test-utils'
import { DlLayout } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlLayout', () => {
    it('check component props', async () => {
        const wrapper = mount(DlLayout, {})
        expect(wrapper).toBeDefined()

        await wrapper.setProps({
            hasNavbarToggle: true
        })

        expect(wrapper.vm.hasNavbarToggle).toBe(true)

        await wrapper.setProps({
            hasNavbarToggle: false
        })

        expect(wrapper.vm.hasNavbarToggle).toBe(false)
    })

    it('check component slots', async () => {
        const navbarMsg = 'navbar'
        const leftSideMsg = 'left side'
        const rightSideMsg = 'right side'
        const defaultMsg = 'default'
        const footerMsg = 'footer'

        const wrapper = mount(DlLayout, {
            slots: {
                'navbar-content': navbarMsg,
                'left-side': leftSideMsg,
                'right-side': rightSideMsg,
                default: defaultMsg,
                footer: footerMsg
            }
        })

        const navbar = wrapper.find('.dl-layout-navbar')
        const leftSide = wrapper.find('.dl-layout-left-side')
        const rightSide = wrapper.find('.dl-layout-right-side')
        const defaultContent = wrapper.find('.dl-layout__body__content')
        const footer = wrapper.find('.dl-layout__body__content__footer')

        expect(navbar.exists()).toBe(true)
        expect(leftSide.exists()).toBe(true)
        expect(rightSide.exists()).toBe(true)
        expect(defaultContent.exists()).toBe(true)
        expect(footer.exists()).toBe(true)

        expect(navbar.text()).toBe(navbarMsg)
        expect(leftSide.text()).toBe(leftSideMsg)
        expect(rightSide.text()).toBe(rightSideMsg)
        expect(defaultContent.text()).toBe(`${defaultMsg}${footerMsg}`)
        expect(footer.text()).toBe(footerMsg)

        expect(wrapper.text().includes(defaultMsg)).toBe(true)
    })
})
