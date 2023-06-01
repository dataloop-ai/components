import { shallowMount } from '@vue/test-utils'
import DlSmartSearch from '../../src/components/compound/DlSearches/DlSmartSearch/DlSmartSearch.vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn()
    }))

const mockQuery = {
    name: 'Query 1',
    query: '{"metadata.nesting.age":20}'
}

const schema = {
    name: 'string',
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time'
    }
}

const aliases = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Age',
        key: 'metadata.nesting.age'
    },
    {
        alias: 'StartTime',
        key: 'metadata.start'
    },
    {
        alias: 'Level',
        key: 'level'
    }
]

describe('SmartSearch', () => {
    let wrapper: any
    beforeAll(() => {
        wrapper = shallowMount(DlSmartSearch, {
            props: {
                schema,
                aliases
            }
        })
    })
    describe('when mounting', () => {
        it('should mount the component', () => {
            const component = wrapper.find('div.dl-smart-search')
            expect(component.exists()).toBe(true)
        })
    })
    describe('changing status when typing a query', () => {
        it('should have status info by default', () => {
            expect(wrapper.vm.computedStatus.type).toMatch('info')
        })
        it('should change status to success when typing a valid query', () => {
            wrapper.vm.inputModel = 'Age = 20'
            expect(wrapper.vm.computedStatus.type).toMatch('success')
        })
        it('should change status to warning when the error state is set to warning', () => {
            wrapper.vm.error = 'warning'
            expect(wrapper.vm.computedStatus.type).toMatch('warning')
        })
        it('should change status to error when error state is error', () => {
            wrapper.vm.error = 'error'
            expect(wrapper.vm.computedStatus.type).toMatch('error')
        })
    })
    describe('when typing inside the input', () => {
        it('should set input model and active query when typing in the smart search input component', () => {
            const testString = 'Age = 21'
            wrapper.vm.handleInputModel(testString)
            expect(wrapper.vm.inputModel).toMatch(testString)
            expect(wrapper.vm.activeQuery.query).toEqual(
                '{"metadata.nesting.age":21}'
            )
        })
        it('should set the query input to a specific value', () => {
            wrapper.vm.setQueryInput(mockQuery.query)
            expect(wrapper.vm.inputModel).toMatch('Age = 20')
        })
    })
    describe('emitting events', () => {
        it('should emit searching a query upon pressing the button', () => {
            //without search
            wrapper.vm.handleSaveQuery(false)
            expect(wrapper.emitted()['save-query']).toBeTruthy()
            expect(wrapper.emitted()['search-query']).toBeFalsy()
            //with search
            wrapper.vm.handleSaveQuery(true)
            expect(wrapper.emitted()['search-query']).toBeTruthy()
        })
        it('should emit an event for removing a query', () => {
            wrapper.vm.activeQuery = mockQuery
            wrapper.vm.emitRemoveQuery()
            expect(wrapper.emitted()['remove-query'][0]).toEqual([
                mockQuery,
                'saved',
                ''
            ])
        })
    })
    describe('filters menu', () => {
        beforeAll(() => {
            wrapper.inputModel = '{}'
            wrapper.activeQuery = {
                name: 'New Query',
                query: '{}'
            }
        })
        it('should handle deleting a filter', () => {
            const tab = 'saved'
            wrapper.vm.handleFiltersDelete(tab, mockQuery)
            expect(wrapper.vm.currentTab).toMatch(tab)
            expect(wrapper.vm.activeQuery).toEqual(mockQuery)
            expect(wrapper.vm.removeQueryDialogBoxModel).toBe(true)
        })
        it('should handle selecting a filter', () => {
            const tab = 'saved'
            const q = {
                name: 'Query1',
                query: '{"metadata.nesting.age":20}'
            }
            wrapper.vm.handleFiltersSelect(tab, q)
            expect(wrapper.vm.activeQuery).toEqual(q)
            expect(wrapper.vm.inputModel).toMatch('Age = 20')
        })
    })
    describe('selecting queries from the select menu', () => {
        beforeAll(() => {
            wrapper.setProps({
                filters: {
                    saved: [mockQuery]
                }
            })
        })
        it('should select a query given a DlSelect option', () => {
            const q = {
                name: 'Query 1',
                query: '{"metadata.nesting.age":20}'
            }
            const option = {
                label: q.name,
                value: q.query
            }
            wrapper.vm.updateActiveQuery(option)
            expect(wrapper.vm.activeQuery).toEqual(q)
        })
    })
})
