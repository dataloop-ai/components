import { mount } from '@vue/test-utils'
import { DlPanelContainer } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlPanelContainer', () => {
    describe('When mounting', () => {
        let wrapper: any
        const headerMsg = 'header'
        const defaultMsg = 'default'
        const footerMsg = 'footer'
        let header: any
        let footer: any

        beforeAll(() => {
            wrapper = mount(DlPanelContainer, {
                slots: {
                    header: headerMsg,
                    default: defaultMsg,
                    footer: footerMsg
                },
                props: {
                    minWidth: 0,
                    modelValue: true
                }
            })
            header = wrapper.find('.header')
            footer = wrapper.find('.footer')
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should mount the separator', () => {
            const separator = wrapper.find('.separator')
            expect(separator.exists()).toBe(true)
        })
        it('should mount the slots', () => {
            expect(header.exists()).toBe(true)
            expect(footer.exists()).toBe(true)
        })
        it('should have the right slots text', () => {
            expect(header.text()).toBe(headerMsg)
            expect(footer.text()).toBe(footerMsg)
        })
        it('should have slots text', function () {
            expect(wrapper.text().includes(defaultMsg)).toBe(true)
        })
        it('should have the right panel width', () => {
            const panel = wrapper.find('.inner-container')
            expect((panel.element as HTMLElement).style.width).toBe(
                wrapper.vm.minW + 'px'
            )
        })
        it('should have the right isFullWidth compute prop', function () {
            expect(wrapper.vm.isFullWidth).toBe(false)
        })
        it('should have the right attributes', () => {
            expect(wrapper.attributes()).toMatchObject({
                'data-resizable': 'false',
                'data-collapsable': 'false',
                'data-direction': 'right'
            })
        })
        it('should have the right minW prop', () => {
            expect(wrapper.vm.minW).toEqual(0)
        })
        describe('When changed width', () => {
            beforeAll(async () => {
                await wrapper.setData({
                    w: 20
                })

                await wrapper.setProps({
                    minWidth: 40
                })
            })
            it('should have the right compute prop minW', () => {
                expect(wrapper.vm.minW).toEqual(20)
            })
        })
    })
    describe('When emit the events', () => {
        let wrapper: any
        let separator: any
        let collapseIcon: any
        beforeAll(async () => {
            wrapper = mount(DlPanelContainer, {
                props: {
                    resizable: true,
                    collapsable: true,
                    modelValue: true
                }
            })
            separator = wrapper.find('.separator')
            collapseIcon = wrapper.find('.collapse-icon')
            await separator.trigger('mousedown')
            await separator.trigger('mousemove', {
                pageX: 0
            })
            await separator.trigger('mouseup')

            await wrapper.setProps({
                resizable: false,
                modelValue: false
            })
        })
        it('should mounted collapseIcon with right class', function () {
            expect(collapseIcon.exists()).toBe(true)
            expect(
                collapseIcon.classes().includes('collapse-icon--right')
            ).toBe(true)
        })
        describe('When clicked collapse icon', () => {
            beforeAll(async () => {
                await collapseIcon.trigger('click')
            })
            it('should emitted change model value', () => {
                expect(wrapper.emitted()).toMatchObject({
                    'update:model-value': [[true]]
                })
            })
        })
        describe('When set panel direction', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    direction: 'left',
                    modelValue: true
                })
            })
            it('should the right collapseIcon class', async function () {
                collapseIcon = wrapper.find('.collapse-icon')
                expect(
                    collapseIcon
                        .classes()
                        .includes('collapse-icon--left--collapsed')
                ).toBe(true)
            })
        })
        describe('When changed modelValue to false', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    modelValue: 'false'
                })
            })
            it('should the right collapseIcon class', () => {
                collapseIcon = wrapper.find('.collapse-icon')
                expect(
                    collapseIcon.classes().includes('collapse-icon--left')
                ).toBe(true)
            })
        })
    })
    describe('Panel container validator', () => {
        it('should accept only the correct minWidth property', () => {
            const validator = DlPanelContainer.props.minWidth.validator
            expect(validator(10)).toBe(true)
            expect(validator(-10)).toBe(false)
        })
    })
})
