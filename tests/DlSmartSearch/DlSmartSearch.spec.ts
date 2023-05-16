import { shallowMount } from '@vue/test-utils'
import DlSmartSearch from '../../src/components/compound/DlSearches/DlSmartSearch/DlSmartSearch.vue'
import { describe, expect, it, vi } from 'vitest'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn()
    }))

const mockQuery = {
    name: 'Query 1',
    query: '{"Age":20}'
}

describe('SmartSearch', () => {
    it('should return a status according to current error state', async () => {
        const wrapper = shallowMount(DlSmartSearch)
        expect(wrapper.vm.computedStatus.type).toMatch('info')
        wrapper.vm.inputModel = 'Age = 20'
        expect(wrapper.vm.computedStatus.type).toMatch('success')
        wrapper.vm.error = 'warning'
        expect(wrapper.vm.computedStatus.type).toMatch('warning')
        wrapper.vm.error = 'error'
        expect(wrapper.vm.computedStatus.type).toMatch('error')
    })
    it('should handle any changes inside the input component', () => {
        const wrapper = shallowMount(DlSmartSearch)
        const testString = 'aa'
        wrapper.vm.handleInputModel(testString)
        expect(wrapper.vm.inputModel).toMatch(testString)
        expect(wrapper.vm.activeQuery.query).toEqual('{}')
    })
    it('should turn any valid query to json', () => {
        const wrapper = shallowMount(DlSmartSearch)
        const query = 'Age = 20'
        expect(wrapper.vm.toJSON(query)).toEqual({ Age: 20 })
    })
    it('should focus the smart search component', () => {
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.isFocused = false
        wrapper.vm.setFocused(true)
        expect(wrapper.vm.isFocused).toBe(true)
    })
    it('should turn on the remove query dialog', () => {
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.handleQueryRemove(mockQuery)
        expect(wrapper.vm.filtersModel).toBe(false)
        expect(wrapper.vm.removeQueryDialogBoxModel).toBe(true)
        expect(wrapper.vm.activeQuery).toEqual(mockQuery)
    })
    it('should handle query search editor', () => {
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.handleQuerySearchEditor(mockQuery)
        expect(wrapper.vm.filtersModel).toBe(false)
        expect(wrapper.vm.oldInputQuery).toMatch(mockQuery.query)
        expect(wrapper.vm.activeQuery).toEqual(mockQuery)
        expect(wrapper.emitted()['search-query']).toEqual([
            [mockQuery, mockQuery.name]
        ])
    })
    it('should handle the save query button and functionality', () => {
        const wrapper = shallowMount(DlSmartSearch)
        //without search
        wrapper.vm.handleSaveQuery(false)
        expect(wrapper.emitted()['save-query']).toBeTruthy()
        expect(wrapper.emitted()['search-query']).toBeFalsy()
        //with search
        wrapper.vm.handleSaveQuery(true)
        expect(wrapper.emitted()['search-query']).toBeTruthy()
    })
    it('should handle editor query update', () => {
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.handleEditorQueryUpdate(mockQuery)
        expect(wrapper.vm.inputModel).toMatch("Age = '20'")
    })
    it('should handle deleting a filter', () => {
        const tab = 'saved'
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.handleFiltersDelete(tab, mockQuery)
        expect(wrapper.vm.currentTab).toMatch(tab)
        expect(wrapper.vm.activeQuery).toEqual(mockQuery)
        expect(wrapper.vm.removeQueryDialogBoxModel).toBe(true)
    })
    it('should handle selecting a filter', () => {
        const tab = 'saved'
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.handleFiltersSelect(tab, mockQuery)
        expect(wrapper.vm.activeQuery).toEqual(mockQuery)
        expect(wrapper.vm.inputModel).toMatch("Age = '20'")
    })
    it('should emit an event for removing a query', () => {
        const wrapper = shallowMount(DlSmartSearch)
        wrapper.vm.activeQuery = mockQuery
        wrapper.vm.emitRemoveQuery()
        expect(wrapper.emitted()['remove-query'][0]).toEqual([
            mockQuery,
            'saved',
            ''
        ])
    })
})
