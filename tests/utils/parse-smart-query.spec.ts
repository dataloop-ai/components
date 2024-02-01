import { describe, it, expect } from 'vitest'
import {
    parseSmartQuery,
    stringifySmartQuery
} from '../../src/utils/parse-smart-query'
import {
    replaceStringifiedDatesWithJSDates,
    replaceJSDatesWithStringifiedDates
} from '../../src/components/compound/DlSearches/DlSmartSearch/utils'
import moment from 'moment'

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
        const query = 'name="John" AND test = true AND falsy = false AND age = '
        const result = parseSmartQuery(query)
        expect(result).toEqual({
            name: 'John',
            test: true,
            falsy: false
        })
    })

    it('should not replace with alias non fitting words', () => {
        const stringDate = '26/05/2023'
        const createdAt = moment(stringDate, 'DD/MM/YYYY').valueOf()
        const string = `createdAt = (${stringDate}) OR dir = 'test AND test OR me Test' AND hidden = true`
        const expected = {
            $or: [
                {
                    createdAt
                },
                {
                    dir: 'test AND test OR me Test',
                    hidden: true
                }
            ]
        }
        const replaced = replaceStringifiedDatesWithJSDates(string)
        const result = parseSmartQuery(replaced)

        expect(result).to.deep.equal(expected)
    })

    it('should correctly parse the queries with EXISTS and DOESNT-EXIST operators', () => {
        const parsed1 = parseSmartQuery('a = 1 AND b EXISTS OR c = 2')
        expect(parsed1).to.deep.equal({
            $or: [
                {
                    a: 1,
                    b: {
                        $exists: true
                    }
                },
                {
                    c: 2
                }
            ]
        })

        const parsed2 = parseSmartQuery('a = 1 AND b DOESNT-EXIST OR c = 2')
        expect(parsed2).to.deep.equal({
            $or: [
                {
                    a: 1,
                    b: {
                        $exists: false
                    }
                },
                {
                    c: 2
                }
            ]
        })

        const parsed3 = parseSmartQuery('a EXISTS OR b DOESNT-EXIST AND c = 1')
        expect(parsed3).to.deep.equal({
            $or: [
                {
                    a: {
                        $exists: true
                    }
                },
                {
                    b: {
                        $exists: false
                    },
                    c: 1
                }
            ]
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

    it('should return the correct query for a "NOT-IN" operator', () => {
        const query = {
            name: { $nin: ['Apple', 'Google', 'Microsoft'] }
        }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for an "IN" operator', () => {
        const query = { name: { $in: ['Apple', 'Google', 'Microsoft'] } }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for an "EXISTS" operator', () => {
        const query = { god: { $exists: true } }
        const result = stringifySmartQuery(query)
        const parsed = parseSmartQuery(result)
        expect(parsed).toEqual(query)
    })

    it('should return the correct query for an "DOESNT-EXIST" operator', () => {
        const query = { fate: { $exists: false } }
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

    it('should not replace with alias non fitting words', () => {
        const string = `createdAt = (26/05/2023) OR dir = 'test AND test OR me Test' AND hidden = true`
        const expected = {
            $or: [
                {
                    createdAt: 1685059200000 // in utc
                },
                {
                    dir: 'test AND test OR me Test',
                    hidden: true
                }
            ]
        }
        const replaced = replaceJSDatesWithStringifiedDates(expected, [
            'createdAt'
        ])
        const result = stringifySmartQuery(replaced)
        expect(result).toEqual(string)
    })
})

describe(replaceJSDatesWithStringifiedDates.name, () => {
    const time = 1685059200000
    const date = '26/05/2023'

    it('should work on a simple object', () => {
        const obj = {
            createdAt: time
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: date
        })
    })

    it('should work on a nested object', () => {
        const obj = {
            createdAt: time,
            nested: {
                createdAt: time
            }
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: date,
            nested: {
                createdAt: date
            }
        })
    })

    it('should work with $ operators', () => {
        const obj = {
            createdAt: {
                $gt: time
            }
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: {
                $gt: date
            }
        })
    })
})
