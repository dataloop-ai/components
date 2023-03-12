import { mount } from '@vue/test-utils'
import { DlInfoErrorMessage } from '../src'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker DlInfoErrorMessage component', () => {
    it('should mount the component', () => {
        const wrapper = mount(DlInfoErrorMessage)

        expect(wrapper.exists()).toBe(true)
    })

    it('should have the correct classes depending on the props', async () => {
        const wrapper = mount(DlInfoErrorMessage, {
            props: {
                error: true,
                position: 'above'
            }
        })

        expect(wrapper.classes()).toContain('text-error')
        expect(wrapper.classes()).toContain('text-above')

        await wrapper.setProps({ position: 'below' })

        expect(wrapper.classes()).toContain('text')
    })
})
