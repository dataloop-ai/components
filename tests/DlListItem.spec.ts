import { mount } from '@vue/test-utils'
import { DlListItem } from '../src'
import { describe, it, expect } from 'vitest'
import {
    itemBorder,
    itemColor,
    itemCursor
} from '../src/components/basic/DlListItem/utils'

describe('DlItemItem', () => {
    it('should display list item content', async () => {
        const wrapper = mount(DlListItem, {
            props: {},
            slots: {
                default: 'content'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            disabled: false,
            clickable: false,
            bordered: false,
            as: 'div',
            startIcon: '',
            endIcon: '',
            startIconColor: 'dl-color-darker',
            endIconColor: 'dl-color-darker',
            startIconSize: '16px',
            endIconSize: '16px',
            withWave: false,
            height: null,
            isHighlighted: false,
            padding: null
        })

        expect(wrapper.classes()).toStrictEqual(['list-item-wrapper'])

        expect(wrapper.vm.isClickable).toBe(false)

        await wrapper.find('.dl-list-item').trigger('click')

        expect(wrapper.emitted()).not.toHaveProperty('click')

        await wrapper.setProps({ clickable: true })

        expect(wrapper.vm.isClickable).toBe(true)

        await wrapper.find('.dl-list-item').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('click')
    })

    it('should return the proper color', () => {
        const colorDisabled = itemColor(true)
        const colorEnabled = itemColor(false)

        const cursorActionable = itemCursor(true, false)
        const cursorDisabled = itemCursor(false, true)

        const borderedItem = itemBorder(true)

        expect(colorDisabled).toEqual('var(--dl-color-disabled)')
        expect(colorEnabled).toEqual('var(--dl-color-darker)')

        expect(cursorActionable).toEqual('pointer')
        expect(cursorDisabled).toEqual('not-allowed')

        expect(borderedItem).toEqual('1px solid var(--dl-color-separator)')
    })
})
