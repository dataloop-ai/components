import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { DlThemeProvider } from '../src/components/'

describe('DlThemeProvider', () => {
    describe('When mounting not dark mode', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlThemeProvider, {
                props: {
                    isDark: false
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should not dark mode', function () {
            expect(wrapper.props().isDark).toBe(false)
        })
    })
    describe('When you set dark mode', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlThemeProvider, {
                props: {
                    isDark: false
                }
            })
            await wrapper.setProps({ isDark: true })
        })
        it('should dark mode', function () {
            expect(wrapper.props().isDark).toBe(true)
        })
    })
})
