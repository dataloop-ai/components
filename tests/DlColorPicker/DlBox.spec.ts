import { mount } from '@vue/test-utils'
import { DlBox } from '../../src/components/DlColorPicker'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker DlBox component', () => {
    it('should mount the component and trigger the event', async () => {
        const color = '0, 0, 0, 1'

        const wrapper = mount(DlBox, {
            props: {
                name: 'RGB',
                color
            }
        })

        expect(wrapper.exists()).toBe(true)

        await wrapper.find('input').trigger('input')
        expect(wrapper.emitted()).toHaveProperty('input')

        const event: any = wrapper.emitted('inputColor')

        expect(event[0][0]).toEqual(color)
    })
})
