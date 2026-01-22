import { mount } from '@vue/test-utils'
import { DlCheckbox } from '../src/components'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlCheckbox', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCheckbox, {
                props: {
                    modelValue: [3, 4, 5],
                    value: 6
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        describe('When add value to v-model array', () => {
            beforeAll(async () => {
                const label = wrapper.find('label')
                await label.trigger('click')
            })
            it('should have the right modelValue', function () {
                expect(
                    (wrapper.emitted()['update:model-value'][0] as number[])[0]
                ).toEqual([3, 4, 5, 6])
            })
        })
        describe('When emit event on Enter keypress', () => {
            beforeAll(async () => {
                const label = wrapper.find('label')
                await label.trigger('keyup', { key: 'Enter' })
            })
            it('should have the right modelValue', function () {
                expect(wrapper.emitted()['update:model-value']).toBeTruthy()
            })
        })
    })
    describe('When emit value passed as false value', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCheckbox, {
                props: {
                    modelValue: 'yes',
                    trueValue: 'yes',
                    falseValue: 'no'
                }
            })
            const label = wrapper.find('label')
            await label.trigger('click')
        })
        it('should have the right modelValue', function () {
            expect(
                (wrapper.emitted()['update:model-value'][0] as string)[0]
            ).toEqual('no')
        })
    })
    describe('When set the proper color for disabled checkbox', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCheckbox, {
                props: {
                    modelValue: false,
                    disabled: true
                }
            })
        })
        it('should have the right active color', function () {
            const cssVars = wrapper.vm.cssSvgVars
            expect(cssVars['--dl-active-color']).toBe('var(--dell-gray-500)')
        })
    })
    describe('When compute isIndeterminate value properly', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCheckbox, {
                props: {
                    modelValue: 'sample value',
                    indeterminateValue: 'sample value'
                }
            })
        })
        it('should have the right isIndeterminate flag', function () {
            expect(wrapper.vm.isIndeterminate).toBe(true)
        })
    })

    describe('When having a sublabel', () => {
        describe('When passing sublabel as a prop', () => {
            it('should render the sublabel', () => {
                const wrapper = mount(DlCheckbox, {
                    props: {
                        modelValue: false,
                        subLabel: 'sublabel'
                    }
                })

                const parent = wrapper.find('.sub-text')
                const span = parent.find('span')
                const text = span.text()

                expect(parent.exists()).toBe(true)
                expect(span.exists()).toBe(true)
                expect(text).toBe('sublabel')
            })
        })
        describe('When passing sublabel as a slot', () => {
            it('should render the sublabel', () => {
                const wrapper = mount(DlCheckbox, {
                    props: {
                        modelValue: false
                    },
                    slots: {
                        'sub-label': '<span>sublabel</span>'
                    }
                })

                const parent = wrapper.find('.sub-text')
                const span = parent.find('span')
                const text = span.text()

                expect(parent.exists()).toBe(true)
                expect(span.exists()).toBe(true)
                expect(text).toBe('sublabel')
            })
        })
    })
})
