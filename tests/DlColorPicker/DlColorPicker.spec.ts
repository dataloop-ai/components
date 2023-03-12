import { mount } from '@vue/test-utils'
import { DlColorPicker } from '../../src/components/DlColorPicker'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker DlColorPicker component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlColorPicker)

        expect(wrapper.exists()).toBe(true)

        await wrapper.setData({ r: 1 })

        const changeColorEvent: any = wrapper.emitted('changeColor')

        expect(changeColorEvent).toHaveLength(1)
    })
})
