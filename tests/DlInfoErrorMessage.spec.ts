import { mount } from '@vue/test-utils'
import { DlInfoErrorMessage } from '../src'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker DlInfoErrorMessage component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlInfoErrorMessage)
        })

        it('should exist the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
    describe('When updating position prop', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlInfoErrorMessage)
            await wrapper.setProps({ position: 'below' })
        })

        it('should the right class', () => {
            expect(wrapper.classes()).toContain('text')
        })
    })
})
