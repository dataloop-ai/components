import { mount } from '@vue/test-utils'
import { DlStudioLayout } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlStudioLayout', () => {
    it('check component props', async () => {
        const wrapper = mount(DlStudioLayout, {})
        expect(wrapper).toBeDefined()

        await wrapper.setProps({
            expandLeftDrawer: false,
            expandRightDrawer: false
        })

        expect(wrapper.vm.expandLeftDrawer).toBe(false)
        expect(wrapper.vm.expandRightDrawer).toBe(false)
    })
    /*
    it('check component slots', async () => {
        const navbarMsg = 'navbar'
        const leftDrawerMsg = 'left Drawer'
        const rightDrawerMsg = 'right Drawer'
        const defaultMsg = 'default'
        const footerMsg = 'footer'

        const wrapper = mount(DlStudioLayout, {
            slots: {
                'navbar-content': navbarMsg,
                'left-menu': leftDrawerMsg,
                'left-drawer': leftDrawerMsg,
                'right-drawer': rightDrawerMsg,
                default: defaultMsg,
                footer: footerMsg
            }
        })

        const navbar = wrapper.find('.dl-layout-navbar')
        const leftDrawer = wrapper.find('.dl-layout__body__left-drawer')
        const rightDrawer = wrapper.find('.dl-layout__body__right-drawer')
        const defaultContent = wrapper.find('.dl-layout__body__content')
        const footer = wrapper.find('.dl-layout__body__content__footer')

        expect(navbar.exists()).toBe(true)
        expect(leftDrawer.exists()).toBe(true)
        expect(rightDrawer.exists()).toBe(true)
        expect(defaultContent.exists()).toBe(true)
        expect(footer.exists()).toBe(true)

        expect(navbar.text()).toBe(navbarMsg)
        expect(leftDrawer.text()).toBe(leftDrawerMsg)
        expect(rightDrawer.text()).toBe(rightDrawerMsg)
        expect(defaultContent.text()).toBe(`${defaultMsg}${footerMsg}`)
        expect(footer.text()).toBe(footerMsg)

        expect(wrapper.text().includes(defaultMsg)).toBe(true)

    })
    */
})
