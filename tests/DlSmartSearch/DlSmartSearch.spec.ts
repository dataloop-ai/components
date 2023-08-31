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
        classTime: 'time',
        '*': 'any'
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
})
