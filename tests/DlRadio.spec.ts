import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlRadio } from '../src'

describe('DlRadio', () => {
    const id = 'some-id'

    it('should set the proper id if the id prop is passed', () => {
        const wrapper = mount(DlRadio, {
            props: {
                id,
                modelValue: 11,
                value: 12
            }
        })

        const input = wrapper.find('input')
        expect(input.element.id).toMatch(id)
    })

    it('should emit event on click', async () => {
        const wrapper = mount(DlRadio, {
            props: {
                modelValue: 42,
                value: 21
            }
        })

        const label = wrapper.find('label')
        await label.trigger('click')
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
    })

    it('should emit event on Enter keypress', async () => {
        const wrapper = mount(DlRadio, {
            props: {
                modelValue: 'qwerty',
                value: 'qwerty'
            }
        })

        const label = wrapper.find('label')
        await label.trigger('keyup', { key: 'Enter' })
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
    })
})
