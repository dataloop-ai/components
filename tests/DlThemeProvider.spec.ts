import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlThemeProvider } from '../src/components/'

describe('DlThemeProvider', () => {
    it('dark color mode provided', async () => {
        const wrapper = mount(DlThemeProvider, {
            props: {
                isDark: false
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props().isDark).toBe(false)

        await wrapper.setProps({ isDark: true })
        expect(wrapper.props().isDark).toBe(true)
    })
})
