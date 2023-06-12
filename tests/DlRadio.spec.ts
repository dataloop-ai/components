import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlRadio } from '../src'

describe('DlRadio', () => {
    const id = 'some-id'
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlRadio, {
                props: {
                    id,
                    modelValue: 11,
                    value: 12
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should set the proper id if the id prop is passed', function () {
            const input = wrapper.find('input')
            expect(input.element.id).toMatch(id)
        })
    })
    describe('When emit events', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlRadio, {
                props: {
                    modelValue: 11,
                    value: 12
                }
            })
        })
        it('should emit event on click', async () => {
            const label = wrapper.find('label')
            await label.trigger('click')
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        })
        it('should emit event on Enter keypress', async () => {
            const label = wrapper.find('label')
            await label.trigger('keyup', { key: 'Enter' })
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        })
    })
})
