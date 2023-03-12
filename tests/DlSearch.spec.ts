import { mount } from '@vue/test-utils'
import { DlSearch } from '../src/components'
import { describe, it, expect } from 'vitest'

describe('DlSearch component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlSearch)

        expect(wrapper.exists()).toBe(true)
    })
})
