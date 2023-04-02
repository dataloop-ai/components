import { mount } from '@vue/test-utils'
import { DlList } from '../src'
import { describe, it, expect } from 'vitest'

describe('DlList', () => {
    it('should display list content', async () => {
        const wrapper = mount(DlList, {
            props: {},
            slots: {
                default: 'content'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            bordered: false,
            separator: false,
            padding: false,
            clickable: false
        })

        expect(wrapper.vm.classes).toBe('dl-list')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.vm.classes).toBe('dl-list dl-list--bordered')

        await wrapper.setProps({ separator: true, bordered: false })

        expect(wrapper.vm.classes).toBe('dl-list dl-list--separator')

        await wrapper.setProps({ padding: true, separator: false })

        expect(wrapper.vm.classes).toBe('dl-list dl-list--padding')
    })
})
