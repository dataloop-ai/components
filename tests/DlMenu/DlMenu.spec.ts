/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlButton, DlMenu } from '../../src/components'
import { waitNextFrame } from '../TestingUtils'

describe('DlMenu', () => {
    const parent = defineComponent({
        name: 'ParentComponent',
        template: '<div id="parent"><slot></slot></div>'
    })
    const slot = defineComponent({
        name: 'MenuSlot',
        template: '<div id="innerSlot" >TestMe</div>'
    })
    let wrapper: any

    beforeAll(() => {
        wrapper = mount(DlMenu, {
            parentComponent: parent,
            data() {
                return {
                    showing: false
                }
            },
            props: {},
            slots: {
                default: slot
            }
        })
    })

    it('should build component correctly', () => {
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
            transitionDuration: 300,
            arrowNavItems: []
        })
        expect(wrapper.vm.showing).toBe(false)
    })

    describe('when clicking the parent div', () => {
        let slot: HTMLDivElement

        beforeAll(async () => {
            await wrapper.vm.$el.parentNode.dispatchEvent(
                new MouseEvent('click')
            )

            await waitNextFrame()
            await wrapper.vm.$nextTick()

            slot = document.querySelector('#innerSlot') as HTMLDivElement
        })
        it('should show the menu', () => {
            expect(wrapper.vm.showing).toBe(true)
            expect(slot).to.exist
            expect(slot.innerHTML).to.equal('TestMe')
        })
    })
})
