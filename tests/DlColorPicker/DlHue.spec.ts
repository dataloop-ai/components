import { mount } from '@vue/test-utils'
import { DlHue } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker DlHue component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlHue)

        expect(wrapper.exists()).toBe(true)
    })
})
