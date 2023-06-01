import { mount } from '@vue/test-utils'
import { DlColorPicker } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlColorPicker)
        })
        it('should ', function () {
            expect(wrapper.exists()).toBe(true)
        })
    })
    describe('When set prop', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlColorPicker)
            await wrapper.setData({ r: 1 })
        })
        it('should have the changeColor event', function () {
            const changeColorEvent: any = wrapper.emitted('changeColor')

            expect(changeColorEvent).toHaveLength(1)
        })
    })
})
