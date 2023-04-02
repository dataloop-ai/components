import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'
import { describe, it, expect, vi } from 'vitest'
import { DlMenu } from '../../src/components'

const Parent = defineComponent({
    name: 'DlParent',
    template: '<div id="parent"><slot></slot></div>'
})

describe('DlMenu', () => {
    vi.useFakeTimers()
    it('should display menu content', async () => {
        const wrapper = mount(DlMenu, {
            parentComponent: Parent,
            data() {
                return {
                    showing: false
                }
            },
            props: {}
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            anchor: 'bottom left',
            autoClose: false,
            contextMenu: false,
            cover: false,
            disabled: false,
            fitContainer: false,
            fitContent: false,
            maxHeight: null,
            maxWidth: null,
            menuClass: '',
            modelValue: false,
            noParentEvent: false,
            noRefocus: false,
            offset: [0, 0],
            'onUpdate:modelValue': undefined,
            persistent: false,
            scrollTarget: undefined,
            self: 'top left',
            square: false,
            target: true,
            touchPosition: false,
            transitionDuration: 300
        })

        expect(wrapper.vm.showing).toBe(false)

        // expect(wrapper.vm.anchorOrigin).toBe('bottom start')

        await wrapper.vm.$el.parentNode.dispatchEvent(new MouseEvent('click'))
        vi.runAllTimers()

        // expect(wrapper.emitted()).not.toHaveProperty('click')

        // await wrapper.setProps({ clickable: true })

        // expect(wrapper.vm.isClickable).toBe(true)

        // await wrapper.find('div').trigger('click')

        // expect(wrapper.emitted()).toHaveProperty('click')
    })
})
