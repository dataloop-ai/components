import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { DlTab, DlTabPanels, DlTabs } from '../src'
import {
    getChildrenFromSlot,
    getSlot
} from '../src/components/compound/DlTabPanels/utils'
import TabsWrapper from '../src/components/compound/DlTabs/components/TabsWrapper.vue'

describe('Tabs and Tab Groups', () => {
    const TAB_ITEMS = [
        { name: 'one', label: 'Tab One' },
        { name: 'two', label: 'Tab Two' },
        { name: 'three', label: 'Tab Three' }
    ]

    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTabs, {
                props: {
                    modelValue: 'one',
                    items: TAB_ITEMS
                },
                slots: {
                    default: `
        <template>
          <div name="one">One</div>
          <div name="two">Two</div>
        </template>
        `
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should initiate tabs data', async () => {
            wrapper.vm.initTabs()
            expect(wrapper.vm.children.length).toBe(TAB_ITEMS.length)
        })
        it('should handle slots', () => {
            const SOME_OBJECT = {
                data: 'text'
            }
            const first = getChildrenFromSlot(undefined)
            const second = getChildrenFromSlot(wrapper.vm.$slots.default)

            const forVue2 = getSlot(true, SOME_OBJECT)

            expect(first).toHaveLength(0)
            expect(second).toHaveLength(2)
            expect(forVue2).toEqual(SOME_OBJECT)
        })
    })
    describe('When emit events', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlTab, {
                props: {
                    label: 'Label',
                    name: 'name',
                    modelValue: 'two',
                    items: TAB_ITEMS
                }
            })
        })
        it('should emit data on tab click', async () => {
            await wrapper.trigger('click')
            expect((wrapper.emitted()['click'][0] as any[])[0]).toBe('name')

            wrapper.setProps({ name: 'another-name' })
            await wrapper.vm.$nextTick()
            await wrapper.trigger('keyup', { key: 'Enter' })
            expect((wrapper.emitted()['click'][1] as any[])[0]).toBe(
                'another-name'
            )
        })
        it('should emit data on arrow click', async () => {
            const wrapper = mount(TabsWrapper, {
                props: {
                    isScrollable: true,
                    isAtStart: false
                }
            })

            const rightArrow = wrapper
                .find('[data-qa="right-arrow-button"]')
                .find('.dl-button')
            const leftArrow = wrapper
                .find('[data-qa="left-arrow-button"]')
                .find('.dl-button')

            await rightArrow.trigger('click')
            await leftArrow.trigger('click')
            //@ts-ignore
            await window.delay(50)
            expect(wrapper.emitted()['right-arrow-click'][0]).toBeTruthy()
            expect(wrapper.emitted()['left-arrow-click'][0]).toBeTruthy()
        })
        describe('When emit event on tabs', () => {
            beforeAll(async () => {
                wrapper = mount(DlTabs, {
                    props: {
                        modelValue: 'two',
                        items: TAB_ITEMS
                    }
                })
            })
            it('should emit event on handleTabClick method call', function () {
                wrapper.vm.handleTabClick('two', new Event('click'))
                expect(
                    (wrapper.emitted()['update:model-value'][0] as string[])[0]
                ).toEqual('two')
            })
            it('should apply the proper state', async () => {
                let isAtStart = 0
                const container = wrapper.find('.dl-tabs-container')

                container.element.scrollLeft = 50
                await container.trigger('scroll')
                isAtStart = wrapper.vm.isAtStart
                expect(isAtStart).toBeFalsy()

                container.element.scrollLeft = 0
                await container.trigger('scroll')
                isAtStart = wrapper.vm.isAtStart
                expect(isAtStart).toBeTruthy()
            })
        })
    })
    describe('When unmount', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTabs, {
                props: {
                    modelValue: 'one',
                    items: TAB_ITEMS
                }
            })
        })
        it('should remove event listener on unmount', function () {
            const unsubscribe = vi.spyOn(wrapper.vm, 'unsubscribeListeners')
            wrapper.unmount()

            expect(unsubscribe).toBeCalled()
            unsubscribe.mockReset()
        })
    })

    describe('when changing fontsize to 14', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlTab, {
                props: {
                    label: 'Label',
                    name: 'name',
                    disabled: false,
                    fontSize: '14px'
                }
            })
        })

        it('should have correct icon size relative to font size', () => {
            expect(wrapper.vm.iconSize).toBe('8px')
        })
    })
})
