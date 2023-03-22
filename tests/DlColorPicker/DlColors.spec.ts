import { mount } from '@vue/test-utils'
import { DlColors } from '../../src/components/DlColorPicker'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker DlColors component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlColors, {
            props: {
                colorsHistory: ['#FEFEFE', '#5D6084']
            }
        })

        expect(wrapper.exists()).toBe(true)

        await wrapper.find('li').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')

        const event: any = wrapper.emitted('selectColor')

        expect(event).toHaveLength(1)
    })
})
