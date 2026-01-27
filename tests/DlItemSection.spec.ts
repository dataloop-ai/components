import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlItemSection } from '../src'

describe('DlItemSection', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlItemSection, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right props', function () {
            expect(wrapper.props().side).toBe(false)
            expect(wrapper.props().side).toBe(false)
            expect(wrapper.props().noWrap).toBe(false)
        })
        it('should have the right class', function () {
            expect(wrapper.classes('dl-item__section--main')).toBe(true)
        })
        it('should have the right styles', function () {
            expect(wrapper.vm.cssVars['--dl-item-color']).toBe('inherit')
        })
    })
    describe('When updating props', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlItemSection, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.setProps({
                side: true,
                noWrap: true,
                color: 'dell-yellow-600'
            })
        })
        it('should have the right class', function () {
            expect(wrapper.classes('dl-item__section--main')).toBe(false)

            expect(wrapper.classes('dl-item__section--side')).toBe(true)

            expect(wrapper.classes('dl-item__section--nowrap')).toBe(true)
        })
        it('should have the right style', function () {
            expect(wrapper.vm.cssVars['--dl-item-color']).toBe(
                'var(--dell-yellow-600, var(--dell-gray-800))'
            )
        })
    })
})
