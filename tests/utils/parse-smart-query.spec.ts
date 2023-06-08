import { describe, it, expect } from 'vitest'
import {
    parseSmartQuery,
    stringifySmartQuery
} from '../../src/utils/parse-smart-query'

describe('parseSmartQuery', () => {
    it('should return the correct query for a single key-value pair', () => {
        const query = 'name = "John"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({ name: 'John' })
    })

    it('should return the correct query for multiple key-value pairs joined by "AND"', () => {
        const query = 'name = "John" AND age >= 30 AND city = "New York"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            name: 'John',
            age: { $gte: 30 },
            city: 'New York'
        })
    })

    it('should return the correct query for multiple key-value pairs joined by "OR"', () => {
        const query = 'name = "John" OR name = "Jane"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({ $or: [{ name: 'John' }, { name: 'Jane' }] })
    })

    it('should return the correct query for a "NOT-IN" query', () => {
        const query = 'name NOT-IN "Apple","Google","Microsoft"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            name: { $nin: ['Apple', 'Google', 'Microsoft'] }
        })
    })

    it('should return the correct query for an "IN" query', () => {
        const query = 'name IN "Apple","Google","Microsoft"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            name: { $in: ['Apple', 'Google', 'Microsoft'] }
        })
    })

    it('should return the correct query for a query with multiple operators', () => {
        const query = 'name="John" AND age >= 30 OR city = "New York"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            $or: [{ age: { $gte: 30 }, name: 'John' }, { city: 'New York' }]
        })
    })

    it('should not add non value models', () => {
        const query = 'name="John" AND age = '
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            name: 'John'
        })
    })
})

describe('stringifySmartQuery', () => {
    it('should return the correct query for a single key-value pair', () => {
        const query = { name: 'John' }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for multiple key-value pairs joined by "AND"', () => {
        const query = {
            name: 'John',
            age: { $gte: 30 },
            city: 'New York'
        }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for multiple key-value pairs joined by "OR"', () => {
        const query = { $or: [{ name: 'John' }, { name: 'Jane' }] }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for a "NOT-IN" query', () => {
        const query = {
            name: { $nin: ['Apple', 'Google', 'Microsoft'] }
        }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for an "IN" query', () => {
        const query = { name: { $in: ['Apple', 'Google', 'Microsoft'] } }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for a query with multiple operators', () => {
        const query = {
            $or: [{ age: { $gte: 30 }, name: 'John' }, { city: 'New York' }]
        }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })
})
