import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DlSmartTooltip } from '../src/components'

describe('DlSmartTooltip', () => {
    beforeEach(() => {
        vi.resetModules()
    })
    vi.useFakeTimers()
    it('should apply the props', async () => {
        const Parent = defineComponent({
            name: 'DlParent',
            template: '<div id="parent"><slot></slot></div>'
        })

        const wrapper = mount(DlSmartTooltip, {
            parentComponent: Parent,
            props: {
                delay: 200,
                anchor: 'bottom left',
                self: 'top middle',
                icon: {
                    src: 'icon-dl-search'
                },
                links: [
                    {
                        icon: 'icon-dl-list-view',
                        href: 'https://www.google.md/?hl=ru',
                        title: 'Lorem',
                        newtab: true,
                        external: true
                    },
                    {
                        href: '#test',
                        title: 'Developers',
                        icon: 'icon-dl-code'
                    }
                ]
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toMatchObject({
            delay: 200,
            anchor: 'bottom left',
            self: 'top middle',
            offset: [9, 9],
            icon: {
                src: 'icon-dl-search'
            },
            links: [
                {
                    icon: 'icon-dl-list-view',
                    href: 'https://www.google.md/?hl=ru',
                    title: 'Lorem',
                    newtab: true,
                    external: true
                },
                {
                    href: '#test',
                    title: 'Developers',
                    icon: 'icon-dl-code'
                }
            ]
        })

        expect(wrapper.vm.offset).toEqual([9, 9])

        wrapper.vm.$el.parentNode.dispatchEvent(new MouseEvent('mouseenter'))
        vi.runAllTimers()
        expect(document.querySelector('[data-test-id="portal"]')).not.toBeNull()

        wrapper.vm.$el.parentNode.dispatchEvent(new MouseEvent('mouseleave'))
        vi.runAllTimers()

        await wrapper.setProps({
            noParentEvent: true
        })
        expect(document.querySelector('[data-test-id="portal"]')).toBeNull()
    })

    it('should accept only the correct offset property', () => {
        const validator = DlSmartTooltip.props.offset.validator

        expect(validator([1, -1])).toBe(true)
        expect(validator(['string', -1])).toBe(false)
    })

    it('should accept only the correct anchor property', () => {
        const validator = DlSmartTooltip.props.anchor.validator

        expect(validator('bottom middle')).toBe(true)
        expect(validator('up down')).toBe(false)
    })

    it('should accept only the correct self property', () => {
        const validator = DlSmartTooltip.props.self.validator

        expect(validator('top middle')).toBe(true)
        expect(validator('up down')).toBe(false)
    })
})
