import { mount } from '@vue/test-utils'
import { DlListItem } from '../src'
import { describe, it, expect, beforeAll } from 'vitest'
import { itemColor, itemCursor } from '../src/components/basic/DlListItem/utils'

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
                separator: false,
                highlighted: false,
                type: 'div',
                withWave: false,
                height: null,
                padding: null,
                startIcon: null,
                endIcon: null
            })
        })
        it('should right the class', function () {
            expect(wrapper.classes()).toStrictEqual(['list-item-wrapper'])
        })
        it('should should compute right isClickable', function () {
            expect(wrapper.vm.isClickable).toBe(false)
        })
    })
    describe('When clicking the list item without clickable prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlListItem, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.find('.dl-list-item').trigger('click')
            await wrapper.vm.$nextTick()
        })
        it('should not clickable item', function () {
            expect(wrapper.emitted()).not.toHaveProperty('click')
        })
    })
    describe('When clicking the list item with clickable prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlListItem, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.setProps({ clickable: true })
            await wrapper.find('.dl-list-item').trigger('click')
            await wrapper.vm.$nextTick()
        })
        it('should clickable item', function () {
            expect(wrapper.emitted()).toHaveProperty('click')
        })
    })

    it('should return the proper color', () => {
        const colorDisabled = itemColor(true)
        const colorEnabled = itemColor(false)

        const cursorActionable = itemCursor(true, false)
        const cursorDisabled = itemCursor(false, true)

        expect(colorDisabled).toEqual('var(--dell-gray-500)')
        expect(colorEnabled).toEqual('var(--dell-gray-800)')

        expect(cursorActionable).toEqual('pointer')
        expect(cursorDisabled).toEqual('not-allowed')
    })
})
