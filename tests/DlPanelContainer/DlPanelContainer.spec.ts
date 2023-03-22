import { mount } from '@vue/test-utils'
import { DlPanelContainer } from '../../src'
import { describe, it, expect } from 'vitest'

describe('DlPanelContainer', () => {
    it('check component props', async () => {
        const wrapper = mount(DlPanelContainer, {})
        expect(wrapper).toBeDefined()

        expect(wrapper.attributes()).toMatchObject({
            'data-resizable': 'false',
            'data-collapsable': 'false',
            'data-direction': 'right'
        })

        await wrapper.setProps({
            resizable: true,
            direction: 'left',
            collapsable: true
        })

        expect(wrapper.attributes()).toMatchObject({
            'data-resizable': 'true',
            'data-collapsable': 'true',
            'data-direction': 'left'
        })

        await wrapper.setProps({
            minWidth: 0
        })

        expect(wrapper.vm.minW).toEqual(0)

        await wrapper.setData({
            w: 200
        })

        await wrapper.setProps({
            minWidth: 40
        })

        expect(wrapper.vm.minW).toEqual(40)

        await wrapper.setData({
            w: 20
        })

        await wrapper.setProps({
            minWidth: 40
        })

        expect(wrapper.vm.minW).toEqual(20)
    })

    it('check component slots', async () => {
        const headerMsg = 'header'
        const defaultMsg = 'default'
        const footerMsg = 'footer'
        const wrapper = mount(DlPanelContainer, {
            slots: {
                header: headerMsg,
                default: defaultMsg,
                footer: footerMsg
            }
        })

        const header = wrapper.find('.header')
        const footer = wrapper.find('.footer')

        expect(header.exists()).toBe(true)
        expect(footer.exists()).toBe(true)

        expect(header.text()).toBe(headerMsg)
        expect(footer.text()).toBe(footerMsg)

        expect(wrapper.text().includes(defaultMsg)).toBe(true)
    })

    it('check events', async () => {
        const wrapper = mount(DlPanelContainer, {
            props: {
                resizable: true,
                collapsable: true,
                modelValue: true
            }
        })

        expect(wrapper.vm.isFullWidth).toBe(false)

        const panel = wrapper.find('.inner-container')
        expect((panel.element as HTMLElement).style.width).toBe(
            wrapper.vm.minW + 'px'
        )

        const separator = wrapper.find('.separator')
        expect(separator.exists()).toBe(true)

        await separator.trigger('mousedown')
        await separator.trigger('mousemove', {
            pageX: 0
        })
        await separator.trigger('mouseup')

        await wrapper.setProps({
            resizable: false,
            modelValue: false
        })

        let collapseIcon = wrapper.find('.collapse-icon')
        expect(collapseIcon.exists()).toBe(true)
        expect(collapseIcon.classes().includes('collapse-icon--right')).toBe(
            true
        )

        await collapseIcon.trigger('click')

        expect(wrapper.emitted()).toMatchObject({
            'update:model-value': [[true]]
        })

        await wrapper.setProps({
            direction: 'left',
            modelValue: true
        })

        collapseIcon = wrapper.find('.collapse-icon')

        expect(
            collapseIcon.classes().includes('collapse-icon--left--collapsed')
        ).toBe(true)

        await wrapper.setProps({
            modelValue: 'false'
        })

        collapseIcon = wrapper.find('.collapse-icon')
        expect(collapseIcon.exists()).toBe(true)
        expect(collapseIcon.classes().includes('collapse-icon--left')).toBe(
            true
        )
    })

    it('should accept only the correct minWidth property', () => {
        const validator = DlPanelContainer.props.minWidth.validator
        expect(validator(10)).toBe(true)
        expect(validator(-10)).toBe(false)
    })
})
