import { SelectOption } from '../../src/components/DlSelect'
import { mount } from '@vue/test-utils'

describe('select option computed', () => {
    it('should compute the color', async () => {
        const wrapper = mount(SelectOption)
        expect(wrapper.vm.color).toMatch('dl-color-darker')
        await wrapper.setProps({
            defaultStyles: false
        })
        expect(wrapper.vm.color).toBe(null)
    })

    it('should tell whether its selected', () => {
        const wrapper = mount(SelectOption, {
            props: {
                modelValue: ['option1', 'option2'],
                value: 'option2'
            }
        })
        expect(wrapper.vm.isSelected).toBeTruthy()
    })

    it('should tell whether the value is indeterminate', async () => {
        const wrapper = mount(SelectOption)
        expect(wrapper.vm.indeterminateValue).toBe(undefined)
        await wrapper.setProps({
            totalItems: true
        })
        expect(wrapper.vm.indeterminateValue).toMatch('indeterminate')
    })

    it('should tell whether the option has children', async () => {
        const wrapper = mount(SelectOption)
        expect(wrapper.vm.hasChildren).toBeFalsy()
        await wrapper.setProps({
            children: ['option1', 'option2']
        })
        expect(wrapper.vm.hasChildren).toBeTruthy()
    })

    it('should emit on checkbox update', () => {
        const wrapper = mount(SelectOption)
        const mockEvent = { target: 'a' }
        wrapper.vm.handleCheckboxUpdate(1, mockEvent)
        expect(wrapper.emitted()['update:model-value']).toEqual([
            [1, { target: 'a' }]
        ])
    })

    it('should emit click event', async () => {
        const wrapper = mount(SelectOption, {
            props: {
                multiselect: true
            }
        })
        const e = new Event('click')
        wrapper.vm.handleClick(e)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().click).toBeTruthy()
    })

    it('should toggle children', () => {
        const wrapper = mount(SelectOption)
        expect(wrapper.vm.showChildren).toBeFalsy()
        wrapper.vm.toggleChildren()
        expect(wrapper.vm.showChildren).toBeTruthy()
    })

    it('return the children of an option', () => {
        const wrapper = mount(SelectOption)
        const mockOption = {
            children: ['option1', 'option2']
        }
        expect(wrapper.vm.getChildren(mockOption)).toEqual([
            'option1',
            'option2'
        ])
    })

    it('should return the label of an option', () => {
        const wrapper = mount(SelectOption)
        const mockOption = {
            label: 'option one'
        }
        expect(wrapper.vm.getLabel(mockOption)).toMatch('option one')
    })

    it('should return the value of an option', () => {
        const wrapper = mount(SelectOption)
        const mockOption = {
            value: 'option1'
        }
        expect(wrapper.vm.getValue(mockOption)).toMatch('option1')
    })
})
