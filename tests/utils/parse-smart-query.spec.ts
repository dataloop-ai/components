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
import { pureDateSuggestionPattern } from '../../src/hooks/use-suggestions'

describe('parseSmartQuery', () => {
    it('should return the correct query for a single key-value pair', () => {
        const query = 'name = "John"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({ name: 'John' })
    })

    it('should retain quotes within string values', () => {
        const query = 'name = "a\\" \'b"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({ name: 'a" \'b' })

        const query2 = "name = '\" a\\''"
        const result2 = parseSmartQuery(query2)
        expect(result2).toEqual({ name: '" a\'' })
    })

    it('should not be confused by operators within string values', () => {
        const query = 'name = "lol >= kek"'
        const result = parseSmartQuery(query)
        expect(result).toEqual({ name: 'lol >= kek' })

        const query2 = "name IN 'EXISTS lol'"
        const result2 = parseSmartQuery(query2)
        expect(result2).toEqual({ name: { $in: ['EXISTS lol'] } })
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
        const stringDate = '26/05/2023 00:00:00'
        const createdAt = moment(
            stringDate,
            pureDateSuggestionPattern
        ).valueOf()
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
        const date = moment(
            '26/05/2023 00:00:00',
            pureDateSuggestionPattern
        ).utc()
        const formatted = date.local().format(pureDateSuggestionPattern)
        const string = `createdAt = (${formatted}) OR dir = 'test AND test OR me Test' AND hidden = true`

        const expected = {
            $or: [
                {
                    createdAt: date.valueOf() // in utc
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

    it('should convert and escape quotes', () => {
        const query = 'name = "a\\" b\'"'
        const result = stringifySmartQuery(parseSmartQuery(query))
        expect(result).toBe("name = 'a\" b\\''")
    })
})

describe(replaceJSDatesWithStringifiedDates.name, () => {
    const date = moment('26/05/2023 03:00:00', pureDateSuggestionPattern).utc()
    const formatted = date.local().format(pureDateSuggestionPattern)

    it('should work on a simple object', () => {
        const obj = {
            createdAt: date.valueOf()
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: formatted
        })
    })

    it('should work on a nested object', () => {
        const obj = {
            createdAt: date.valueOf(),
            nested: {
                createdAt: date.valueOf()
            }
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: formatted,
            nested: {
                createdAt: formatted
            }
        })
    })

    it('should work with $ operators', () => {
        const obj = {
            createdAt: {
                $gt: date.valueOf()
            }
        }
        const result = replaceJSDatesWithStringifiedDates(obj, ['createdAt'])
        expect(result).toEqual({
            createdAt: {
                $gt: formatted
            }
        })
    })
})
