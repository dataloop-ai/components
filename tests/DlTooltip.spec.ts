import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DlTooltip } from '../src/components'

describe('DlTooltip', () => {
    beforeEach(() => {
        vi.resetModules()
    })
    vi.useFakeTimers()
    it('should apply the props', async () => {
        const Parent = defineComponent({
            name: 'DlParent',
            template: '<div id="parent"><slot></slot></div>'
        })

        const wrapper = mount(DlTooltip, {
            parentComponent: Parent,
            props: {
                color: 'white',
                backgroundColor: 'black',
                delay: 300,
                hideDelay: 200,
                maxWidth: '100px',
                maxHeight: '200px',
                anchor: 'bottom left',
                self: 'top middle',
                scrollTarget: null
            },
            slots: {
                default:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi corrupti rerum voluptate amet ex quas perspiciatis dicta ea similique, voluptatum perferendis possimus. Quasi eveniet asperiores, dolorum quia facilis reiciendis animi.'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toMatchObject({
            color: 'white',
            backgroundColor: 'black',
            delay: 300,
            hideDelay: 200,
            maxWidth: '100px',
            maxHeight: '200px',
            anchor: 'bottom left',
            self: 'top middle',
            scrollTarget: null,
            offset: [9, 9],
            transitionDuration: 300
        })

        expect(wrapper.vm.offset).toEqual([9, 9])

        wrapper.vm.$el.parentNode.dispatchEvent(new MouseEvent('mouseenter'))
        vi.runAllTimers()
        expect(document.querySelector('[data-test-id="portal"]')).not.toBeNull()
        expect(wrapper.emitted()).toHaveProperty('before-show')

        wrapper.vm.$el.parentNode.dispatchEvent(new MouseEvent('mouseleave'))
        vi.runAllTimers()

        expect(wrapper.emitted()).toHaveProperty('before-hide')
        expect(wrapper.emitted()).toHaveProperty('hide')

        await wrapper.setProps({
            noParentEvent: true
        })
        expect(document.querySelector('[data-test-id="portal"]')).toBeNull()
    })

    it('should accept only the correct offset property', () => {
        const validator = DlTooltip.props.offset.validator

        expect(validator([1, -1])).toBe(true)
        expect(validator(['string', -1])).toBe(false)
    })

    it('should accept only the correct anchor property', () => {
        const validator = DlTooltip.props.anchor.validator

        expect(validator('bottom middle')).toBe(true)
        expect(validator('up down')).toBe(false)
    })

    it('should accept only the correct self property', () => {
        const validator = DlTooltip.props.self.validator

        expect(validator('top middle')).toBe(true)
        expect(validator('up down')).toBe(false)
    })
})
