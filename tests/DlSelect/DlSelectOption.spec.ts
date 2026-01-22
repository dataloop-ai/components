import { DlSelectOption } from '../../src/components'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'

describe('select option computed', () => {
    describe('When selected option', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelectOption, {
                props: {
                    modelValue: ['option1', 'option2'],
                    value: 'option2'
                }
            })
        })
        it('should tell whether its selected', () => {
            expect(wrapper.vm.isSelected).toBeTruthy()
        })
        it('should tell whether the value is indeterminate', async () => {
            expect(wrapper.vm.indeterminateValue).toBe(undefined)
            await wrapper.setProps({
                totalItems: true
            })
            expect(wrapper.vm.indeterminateValue).toMatch('indeterminate')
        })
        it('should tell whether the option has children', async () => {
            expect(wrapper.vm.hasChildren).toBeFalsy()
            await wrapper.setProps({
                children: ['option1', 'option2']
            })
            expect(wrapper.vm.hasChildren).toBeTruthy()
        })
        it('should compute the color', async () => {
            expect(wrapper.vm.color).toMatch('dell-gray-800')
            await wrapper.setProps({
                defaultStyles: false
            })
            expect(wrapper.vm.color).toBe(null)
        })
    })
    describe('When emit the events', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelectOption, {
                props: {
                    multiselect: true
                }
            })
        })
        it('should emit on checkbox update', () => {
            const mockEvent = { target: 'a' }
            wrapper.vm.handleCheckboxUpdate(1, mockEvent)
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [1, { target: 'a' }]
            ])
        })
        it('should emit click event', async () => {
            const e = new Event('click')
            wrapper.vm.handleClick(e)
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted().click).toBeTruthy()
        })
    })
    describe('When toggle children options', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelectOption)
        })
        it('should toggle children', () => {
            expect(wrapper.vm.showChildren).toBeFalsy()
            wrapper.vm.toggleChildren()
            expect(wrapper.vm.showChildren).toBeTruthy()
        })
        it('return the children of an option', () => {
            const mockOption = {
                children: ['option1', 'option2']
            }
            expect(wrapper.vm.getChildren(mockOption)).toEqual([
                'option1',
                'option2'
            ])
        })
        it('should return the label of an option', () => {
            const mockOption = {
                label: 'option one'
            }
            expect(wrapper.vm.getLabel(mockOption)).toMatch('option one')
        })
        it('should return the value of an option', () => {
            const mockOption = {
                value: 'option1'
            }
            expect(wrapper.vm.getValue(mockOption)).toMatch('option1')
        })
    })
})
