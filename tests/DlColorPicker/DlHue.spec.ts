import { mount } from '@vue/test-utils'
import { DlHue } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker DlHue component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlHue)
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
})
