import { mount } from '@vue/test-utils'
import { DlAlpha } from '../../src/components'
import { describe, it, expect, vi, beforeAll } from 'vitest'

describe('DlColorPicker DlAlpha component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlAlpha)
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('When execute the watcher functions', () => {
        let wrapper: any
        let renderColorSpy: any
        let renderSlideSpy: any
        let selectAlphaSpy: any

        beforeAll(async () => {
            wrapper = mount(DlAlpha)
            renderColorSpy = vi.spyOn(wrapper.vm, 'renderColor')
            renderSlideSpy = vi.spyOn(wrapper.vm, 'renderSlide')
            await wrapper.setProps({
                color: '#111111',
                rgba: {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 0.5
                }
            })
            selectAlphaSpy = vi.spyOn(wrapper.vm, 'selectAlpha')
            await wrapper.find('.color-alpha').trigger('mousedown')
            await wrapper.vm.$nextTick()
        })
        it('should execute selectAlphaSpy function', function () {
            expect(selectAlphaSpy).toHaveBeenCalled()
        })
        it('should execute renderColorSpy function', function () {
            expect(renderColorSpy).toHaveBeenCalled()
        })
        it('should execute renderSlideSpy function', function () {
            expect(renderSlideSpy).toHaveBeenCalled()
        })
    })
})
