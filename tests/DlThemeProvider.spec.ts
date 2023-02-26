import { mount } from '@vue/test-utils'
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
        wrapper.vm.$options.watch.isDark.call(wrapper.vm)
        await wrapper.setProps({ isDark: true })
        expect(wrapper.props().isDark).toBe(true)
    })
})
