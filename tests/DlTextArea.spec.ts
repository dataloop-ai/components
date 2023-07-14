import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlTextArea } from '../src/components'

describe('DlTextArea component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTextArea)
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
    describe('When set the width prop', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlTextArea)
            await wrapper.setProps({ width: '400px' })
        })
        it('should have the right style', function () {
            expect(wrapper.vm.cssVars['--dl-textarea-max-width']).toEqual(
                '400px'
            )
        })
    })
    describe('When emit the events', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlTextArea)
            await wrapper.find('textarea').trigger('input')
            await wrapper.find('textarea').trigger('blur')
            await wrapper.find('textarea').trigger('focus')
            await wrapper.vm.$nextTick()
        })

        it('should have the input event', function () {
            const inputEvent: any = wrapper.emitted('input')
            expect(inputEvent).toHaveLength(1)
        })
        it('should have the right model value', function () {
            const updateModelEvent: any = wrapper.emitted('update:model-value')
            expect(updateModelEvent).toHaveLength(1)
        })
        it('should have the right blur event', async function () {
            const blurEvent: any = wrapper.emitted('blur')
            expect(blurEvent).toHaveLength(1)
        })
        it('should have the right focus event', async function () {
            const focusEvent: any = wrapper.emitted('focus')
            expect(focusEvent).toHaveLength(1)
        })
    })
})
