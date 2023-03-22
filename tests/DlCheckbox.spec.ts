import { mount } from '@vue/test-utils'
import { DlCheckbox } from '../src'
import { describe, it, expect } from 'vitest'

describe('DlCheckbox', () => {
    it('should add value to v-model array', async () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: [3, 4, 5],
                value: 6
            }
        })

        const label = wrapper.find('label')
        await label.trigger('click')
        expect(
            (wrapper.emitted()['update:model-value'][0] as number[])[0]
        ).toEqual([3, 4, 5, 6])
    })

    it('should remove value from v-model array', async () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: [3, 4, 5, 6],
                value: 6
            }
        })

        const label = wrapper.find('label')
        await label.trigger('click')
        expect(
            (wrapper.emitted()['update:model-value'][0] as number[])[0]
        ).toEqual([3, 4, 5])
    })

    it('should emit event on Enter keypress', async () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: false
            }
        })

        const label = wrapper.find('label')
        await label.trigger('keyup', { key: 'Enter' })
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
    })

    it('should emit value passed as false value', async () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: 'yes',
                trueValue: 'yes',
                falseValue: 'no'
            }
        })

        const label = wrapper.find('label')
        await label.trigger('click')
        expect(
            (wrapper.emitted()['update:model-value'][0] as string)[0]
        ).toEqual('no')
    })

    it('should set the proper color for disabled checkbox', () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: false,
                disabled: true
            }
        })

        const cssVars = wrapper.vm.cssSvgVars
        expect(cssVars['--dl-active-color']).toBe('var(--dl-color-disabled)')
    })

    it('should compute isIndeterminate value properly', () => {
        const wrapper = mount(DlCheckbox, {
            props: {
                modelValue: 'sample value',
                indeterminateValue: 'sample value'
            }
        })

        expect(wrapper.vm.isIndeterminate).toBe(true)
    })
})
