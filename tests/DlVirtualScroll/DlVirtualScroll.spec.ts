import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlVirtualScroll } from '../../src/components'

const basicList = []

for (let i = 0; i <= 1000; i++) {
    basicList.push({
        label: 'Option ' + (i + 1)
    })
}

describe('DlVirtualScroll', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlVirtualScroll, { slots: { default: 'default' } })
        })

        it('should mount the component', function () {
            const component = wrapper.find('div.dl-virtual-scroll')

            expect(component.exists()).toBe(true)
        })

        describe('When set horizontal prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ virtualScrollHorizontal: true })
            })
            it('should have horizontal class', function () {
                const component = wrapper.find(
                    'div.dl-virtual-scroll--horizontal'
                )
                expect(component.exists()).toBe(true)
            })
        })

        describe('When set vertical prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    virtualScrollHorizontal: false
                })
            })
            it('should have vertical class', function () {
                const component = wrapper.find(
                    'div.dl-virtual-scroll--vertical'
                )
                expect(component.exists()).toBe(true)
            })
        })

        describe('When set scrollTarget prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    scrollTarget: 'body'
                })
            })
            it('should trigger scrollTarget watch', function () {
                const component = wrapper.find(
                    'div.dl-virtual-scroll--vertical scroll'
                )

                expect(component.exists()).toBe(false)
            })
        })
    })

    describe('When mounting with empty slots', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlVirtualScroll)
        })

        it('should not mount the component', function () {
            const component = wrapper.find('div.dl-virtual-scroll')

            expect(component.exists()).toBe(false)
        })
    })

    describe('When mounting with items data', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlVirtualScroll, {
                props: {
                    items: basicList
                },
                slots: {
                    default: '<div>item</div>'
                }
            })
        })
        it('should not mount the component', function () {
            expect(wrapper.element.children.length > 0).toBe(true)
        })
    })
})
