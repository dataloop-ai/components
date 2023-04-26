import { mount } from '@vue/test-utils'
import { DlListItem } from '../src'
import { describe, it, expect, beforeAll } from 'vitest'
import {
    itemBorder,
    itemColor,
    itemCursor
} from '../src/components/basic/DlListItem/utils'

describe('DlListItem', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlListItem, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right the props', function () {
            expect(wrapper.props()).toStrictEqual({
                disabled: false,
                clickable: false,
                bordered: false,
                as: 'div',
                startIcon: '',
                endIcon: '',
                startIconColor: 'dl-color-darker',
                endIconColor: 'dl-color-darker',
                startIconSize: '12px',
                endIconSize: '12px',
                withWave: false,
                height: null,
                padding: null
            })
        })
        it('should right the class', function () {
            expect(wrapper.classes()).toStrictEqual(['list-item-wrapper'])
        })
        it('should should compute right isClickable', function () {
            expect(wrapper.vm.isClickable).toBe(false)
        })
    })
    describe('when clicking the list item', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlListItem, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper
                .find('.dl-list-item')
                .dispatchEvent(new MouseEvent('click'))
            await wrapper.vm.$nextTick()
        })
        it('should vcv', function () {
            expect(wrapper.emitted()).not.toHaveProperty('click')
        })
    })
    // it('should display list item content', async () => {
    //     const wrapper = mount(DlListItem, {
    //         props: {},
    //         slots: {
    //             default: 'content'
    //         }
    //     })
    //     await wrapper.find('.dl-list-item').trigger('click')
    //
    //     expect(wrapper.emitted()).not.toHaveProperty('click')
    //
    //     await wrapper.setProps({ clickable: true })
    //
    //     expect(wrapper.vm.isClickable).toBe(true)
    //
    //     await wrapper.find('.dl-list-item').trigger('click')
    //
    //     expect(wrapper.emitted()).toHaveProperty('click')
    // })
    //
    // it('should return the proper color', () => {
    //     const colorDisabled = itemColor(true)
    //     const colorEnabled = itemColor(false)
    //
    //     const cursorActionable = itemCursor(true, false)
    //     const cursorDisabled = itemCursor(false, true)
    //
    //     const borderedItem = itemBorder(true)
    //
    //     expect(colorDisabled).toEqual('var(--dl-color-disabled)')
    //     expect(colorEnabled).toEqual('var(--dl-color-darker)')
    //
    //     expect(cursorActionable).toEqual('pointer')
    //     expect(cursorDisabled).toEqual('not-allowed')
    //
    //     expect(borderedItem).toEqual('1px solid var(--dl-color-separator)')
    // })
})
