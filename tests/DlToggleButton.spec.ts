import { mount } from '@vue/test-utils'
import { DlToggleButton } from '../src/components'
import { describe, expect, it } from 'vitest'

describe('DlToggleButton', () => {
    it('testing setup functionality', async () => {
        const wrapper = mount(DlToggleButton, {
            props: {
                options: [
                    { label: 'Button 1', value: 1 },
                    { label: 'Button 2', value: 2 }
                ]
            }
        })
        expect(wrapper.exists()).toBe(true)
        const buttonElem = await wrapper.find('.dl-button')
        buttonElem.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
        const clickEvent = wrapper.emitted('click')
        expect(clickEvent).toHaveLength(1)
        const listButtons = wrapper.findAll('[data-test="button"]')
        expect(listButtons.length).toBe(2)
        expect(wrapper.vm.getStyles(true)).toEqual({
            padding: '7px 10px',
            height: '28px',
            fontSize: 'var(--dl-font-size-body)',
            borderRadius: '0',
            color: 'var(--dl-color-secondary)',
            borderColor: 'var(--dl-color-secondary)',
            background: 'var(--dl-color-secondary-opacity)'
        })
    })
})
