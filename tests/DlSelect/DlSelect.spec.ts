import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlSelect } from '../../src/components'

describe('dl-select methods', () => {
    describe('When set the index according to the model value', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelect, {
                props: {
                    options: ['one', 'two', 'three']
                }
            })
            wrapper.vm.setSelectedIndex()
        })
        it('should the right selected index', async () => {
            await wrapper.setProps({
                modelValue: 'two'
            })
            expect(wrapper.vm.selectedIndex).toBe(1)
        })
        it('should the right selected index', async () => {
            await wrapper.setProps({
                modelValue: 'three'
            })
            expect(wrapper.vm.selectedIndex).toBe(2)
        })
    })
    describe('When select an option', function () {
        let wrapper: any
        const mockObjOptions = ['option1', 'option2', 'option3']
        const selectedOption = 'option2'

        beforeAll(async () => {
            wrapper = mount(DlSelect, {
                props: {
                    options: mockObjOptions
                }
            })
            wrapper.vm.selectOption(selectedOption)
            await wrapper.vm.$nextTick()
        })
        it('should the right selected option', async () => {
            expect(wrapper.emitted().change).toBeTruthy()
            expect(wrapper.emitted().change).toEqual([['option2']])
        })
    })
    describe('When emit the search input', function () {
        let wrapper: any
        const mockEvent = { target: { value: 'val1' } }

        beforeAll(async () => {
            wrapper = mount(DlSelect)
            wrapper.vm.handleSearchInput(mockEvent)

            await wrapper.vm.$nextTick()
        })

        it('should the right search input value', function () {
            expect(wrapper.emitted()['search-input']).toEqual([['val1']])
        })
    })
    describe('When close the menu and emit hide events', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSelect, {
                props: {
                    isExpanded: true
                }
            })
            wrapper.vm.closeMenu()
        })
        it('should to be falsy isExpanded', function () {
            expect(wrapper.vm.isExpanded).toBeFalsy()
        })
        it('should the right emitted hide event', function () {
            expect(wrapper.emitted().hide).toBeTruthy()
            expect(wrapper.emitted()['before-hide']).toBeTruthy()
        })
    })
    describe('When emit show events on menu open', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelect)
            wrapper.vm.onMenuOpen()
        })
        it('should the emit show event', function () {
            expect(wrapper.emitted().show).toBeTruthy()
        })
        it('should the emit before-show event', async function () {
            wrapper.vm.onMenuOpen()
            wrapper.vm.$nextTick()
            await wrapper.setProps({
                search: true
            })
            expect(wrapper.emitted()['before-show']).toBeTruthy()
        })
    })
    describe('When emit the events', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelect, {
                props: {
                    multiselect: true
                }
            })
        })
        it('should emit search event', () => {
            wrapper.vm.handleSearchFocus()
            expect(wrapper.emitted()['search-focus']).toBeTruthy()
        })

        it('should emit blur event', () => {
            wrapper.vm.onBlur()
            expect(wrapper.emitted()['search-blur']).toBeTruthy()
        })
        it('should emit @change if multiselect is true', async () => {
            wrapper.vm.handleModelValueUpdate(['option1', 'option2'])
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted().change).toBeTruthy()
        })
    })
    describe('When trigger options', () => {
        let wrapper: any
        let mockOption: any

        beforeAll(() => {
            mockOption = { label: 'option one', value: 'option1' }
            wrapper = mount(DlSelect)
        })
        it('should trigger the option menu', () => {
            wrapper.vm.handleMenuTrigger(true)
            expect(wrapper.vm.isExpanded).toBeTruthy()
            wrapper.vm.handleMenuTrigger(false)
            expect(wrapper.vm.isExpanded).toBeFalsy()
        })

        it('should clear all selections', () => {
            wrapper.vm.clearSelection()
            expect(wrapper.vm.selectedIndex).toBe(-1)
        })

        it('should return the option value', () => {
            expect(wrapper.vm.getOptionValue(mockOption)).toEqual('option1')
        })
        it('should return the option label', () => {
            expect(wrapper.vm.getOptionLabel(mockOption)).toEqual('option one')
        })
    })
    it('should return the option children', () => {
        const wrapper = mount(DlSelect)
        const mockStringOption = 'option1'
        const mockObjOption = {
            label: 'option one',
            value: 'option1',
            children: [
                { label: 'option two', value: 'option2' },
                { label: 'option three', value: 'option3' }
            ]
        }
        expect(wrapper.vm.getOptionChildren(mockStringOption)).toBe(null)
        expect(wrapper.vm.getOptionChildren(mockObjOption)).toEqual(
            mockObjOption.children
        )
    })
    it('should return the option count', () => {
        const mockOption = { label: 'option one', value: 'option1', count: 1 }
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.getOptionCount(mockOption)).toBe(1)
    })
    it('should return the key for an option', () => {
        const mockStringOption = 'option1'
        const mockObjOption = { label: 'option one', value: 'option1' }
        const mockObjOptionWithKey = {
            label: 'option one',
            value: 'option1',
            key: 'key'
        }
        const wrapper = mount(DlSelect)

        expect(wrapper.vm.getKeyForOption(mockStringOption)).toEqual('option1')
        expect(wrapper.vm.getKeyForOption(mockObjOption)).toEqual('option one')
        expect(wrapper.vm.getKeyForOption(mockObjOptionWithKey)).toEqual('key')
    })
})

describe('dl-select computed', () => {
    it('should compute the modelValue length', async () => {
        const wrapper = mount(DlSelect, {
            props: {
                modelValue: 'option1'
            }
        })
        expect(wrapper.vm.modelValueLength).toBe('option1'.length)
        await wrapper.setProps({
            modelValue: 2
        })
        expect(wrapper.vm.modelValueLength).toBe(0)
    })

    it('should filter the select label', async () => {
        const wrapper = mount(DlSelect, {
            props: {
                modelValue: 'o'
            }
        })
        expect(wrapper.vm.filterSelectLabel).toMatch('')

        await wrapper.setProps({
            placeholder: 'options',
            modelValue: 'option1'
        })
        expect(wrapper.vm.filterSelectLabel).toEqual(
            `${'option1'.length} Selected Items`
        )
    })

    it('should compute all items label', async () => {
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.computedAllItemsLabel).toMatch('All Items')
        await wrapper.setProps({
            allItemsOptionLabel: 'test'
        })
        expect(wrapper.vm.computedAllItemsLabel).toMatch('test')
    })

    it('should tell whether modelvalue is primitive', () => {
        const wrapper = mount(DlSelect, {
            props: {
                modelValue: 'string'
            }
        })
        expect(wrapper.vm.isModelValuePrimitiveType).toBeTruthy()
    })

    it('should compute the toal count', () => {
        const wrapper = mount(DlSelect, {
            props: {
                options: [
                    { label: 'option two', value: 'option2', count: 2 },
                    { label: 'option three', value: 'option3', count: 2 }
                ]
            }
        })
        expect(wrapper.vm.totalCount).toBe(4)
    })

    it('should compute the placeholder', async () => {
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.computedPlaceholder).toMatch('Select option')
        await wrapper.setProps({
            placeholder: 'holding place'
        })
        expect(wrapper.vm.computedPlaceholder).toMatch('holding place')
    })

    it('should compute the selected option', async () => {
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.selectedOption).toMatch('Select option')
        await wrapper.setProps({
            options: ['option1']
        })

        wrapper.vm.selectedIndex = 0
        expect(wrapper.vm.selectedOption).toMatch('option1')
    })

    it('should return a list of classes according to the props', async () => {
        const wrapper = mount(DlSelect)
        wrapper.vm.selectedIndex = 0

        expect(wrapper.vm.selectClasses).toContain(
            'dl_select__select--has-selection'
        )

        await wrapper.setProps({
            alignRight: true
        })
        expect(wrapper.vm.selectClasses).toContain(
            'dl_select__select--align-right'
        )

        await wrapper.setProps({
            withoutBorders: true
        })
        expect(wrapper.vm.selectClasses).toContain(
            'dl_select__select--without-border'
        )

        await wrapper.setProps({
            search: true
        })
        expect(wrapper.vm.selectClasses).toContain('dl_select__select--prepend')

        await wrapper.setProps({
            error: true
        })
        expect(wrapper.vm.selectClasses).toContain('dl_select__select--error')

        await wrapper.setProps({
            disabled: true
        })
        expect(wrapper.vm.selectClasses).toContain(
            'dl_select__select--disabled'
        )

        wrapper.vm.isExpanded = true
        expect(wrapper.vm.selectClasses).toContain('dl_select__select--focused')

        await wrapper.setProps({
            redAsterisk: true
        })
        expect(wrapper.vm.asteriskClasses).toContain('required-asterisk')
        expect(wrapper.vm.asteriskClasses).toContain('required-asterisk--red')
    })

    it('should return css vars', () => {
        const wrapper = mount(DlSelect, {
            props: {
                width: '25vh',
                dropdownMaxHeight: '50%'
            }
        })
        expect(wrapper.vm.cssVars['--dl-select-width']).toMatch('25vh')
    })

    it('should get and set the items', () => {
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.isEmpty).toBeTruthy()
    })

    it('should tell whether options and modelvalue match', () => {
        const wrapper = mount(DlSelect, {
            props: {
                modelValue: ['option1', 'option2'],
                options: ['option1', 'option2']
            }
        })
        expect(wrapper.vm.allFiltersModel).toBeTruthy()
    })

    it('should tell if there are no options', async () => {
        const wrapper = mount(DlSelect)
        expect(wrapper.vm.noOptions).toBeTruthy()
        await wrapper.setProps({
            options: []
        })
        expect(wrapper.vm.noOptions).toBeTruthy()
    })

    it('should select the index given object options', async () => {
        const wrapper = mount(DlSelect, {
            props: {
                options: [
                    { label: 'option one', value: 'option1' },
                    { label: 'option two', value: 'option2' }
                ],
                emitValue: true,
                modelValue: 'option1'
            }
        })

        expect(wrapper.vm.selectedIndex).toBe(-1)
        await wrapper.setProps({
            emitValue: false
        })
        expect(wrapper.vm.selectedIndex).toBe(-1)
    })

    it('should emit the value and not the entire object', async () => {
        const wrapper = mount(DlSelect, {
            props: {
                options: [
                    { label: 'option one', value: 'option1' },
                    { label: 'option two', value: 'option2' }
                ],
                emitValue: true,
                modelValue: 'option2'
            }
        })

        wrapper.vm.selectOption({ label: 'option one', value: 'option1' })
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().change).toBeTruthy()
        expect(wrapper.emitted()['update:model-value']).toStrictEqual([
            ['option1']
        ])
    })

    it('should select all options', () => {
        const wrapper = mount(DlSelect, {
            options: [
                { label: 'option one', value: 'option1' },
                { label: 'option two', value: 'option2' }
            ]
        })
        wrapper.vm.selectAll('', new Event('submit'))

        expect(wrapper.emitted().change).toBeTruthy()
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
    })

    describe('when usng dl-select with small size and tooltip', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSelect, {
                props: {
                    options: ['one', 'two', 'three'],
                    size: 's'
                }
            })
        })

        it('should have small class', async () => {
            const elem = wrapper.get('.dl-select__title-container')
            expect(elem.classes()).toContain('dl-select__title-container--s')
        })
    })

    describe('when setting emitValue to true', () => {
        let wrapper: any

        const options = [
            {
                label: '0',
                value: 0
            }
        ]

        beforeAll(() => {
            wrapper = mount(DlSelect, {
                props: {
                    options,
                    emitValue: true
                }
            })
        })
        it('should emit the value itself', () => {
            wrapper.vm.selectOption(options[0])
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [options[0].value]
            ])
        })
    })
    describe('when typing in a search value', () => {
        let wrapper: any

        const options = [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 }
        ]

        beforeAll(() => {
            wrapper = mount(DlSelect, {
                props: {
                    options,
                    search: true
                }
            })
        })
        it('should give a highlight color to the matching section', () => {
            const value = '1'
            wrapper.vm.handleSearchInput({ target: { value } })
            expect(wrapper.vm.searchInputValue).toMatch(value)
            expect(
                wrapper.vm
                    .getOptionHtml(options[0])
                    .includes('--dl-color-warning')
            ).toBe(true)
        })
    })
})
