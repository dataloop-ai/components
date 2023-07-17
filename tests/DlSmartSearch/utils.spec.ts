import moment from 'moment'
import {
    isEndOfString,
    isEndingWithDateIntervalPattern,
    replaceDateInterval,
    formatToNumericDate,
    setAliases
} from '../../src/components/compound/DlSearches/DlSmartSearch/utils'
import { stringifySmartQuery } from '../../src/utils'
import { describe, it, expect, beforeAll } from 'vitest'

describe('isEndOfString', () => {
    it('should retun "false" when the string does not match the pattern', () => {
        expect(isEndOfString('string!', /(ing)/)).toBe(false)
    })

    it('should retun "false" when the string does match the pattern but not at the end', () => {
        expect(isEndOfString('string!  ', /(str)/)).toBe(false)
    })

    it('should return "true" when the string does match the pattern at the end', () => {
        expect(isEndOfString('string!  ', /(ing!)/)).toBe(true)
    })
})

describe('isEndingWithDateIntervalPattern', () => {
    it('should return "false" when the string does not match the "dateIntervalPattern" at the end', () => {
        expect(
            isEndingWithDateIntervalPattern('field = (From (12/12/22)')
        ).toBe(false)
    })

    it('should return "true" when the string does match the "dateIntervalPattern" at the end', () => {
        expect(
            isEndingWithDateIntervalPattern(
                'field = (From (12/12/22) To (22/12/22))'
            )
        ).toBe(false)
    })
})

describe('formatToNumericDate', () => {
    it('should return the correct date', () => {
        const date = '(02/12/2022)'
        const expected = moment.utc('02/12/2022', 'DD/MM/YYYY').toDate()
        const formattedDate = formatToNumericDate(date)
        const msTime = expected.getTime()
        expect(formattedDate).toEqual(msTime)
    })
})

describe('replaceDateInterval', () => {
    it('should replace the last occurrence of the value that matches the "dateIntervalPattern"', () => {
        const string =
            'field = (From (12/12/22) To (22/12/22)) AND field = (From (dd/mm/yyyy) To (dd/mm/yyyy))'
        const toReplace = {
            from: new Date(formatToNumericDate('(02/12/2022)')),
            to: new Date(formatToNumericDate('(22/12/2022)'))
        }
        const expected =
            'field = (From (12/12/22) To (22/12/22)) AND field = (From (02/12/2022) To (dd/mm/yyyy))'
        const replaced = replaceDateInterval(string, toReplace)

        console.log(toReplace)
        expect(replaced).toEqual(expected)
    })

    it('should return the original string', () => {
        expect(
            replaceDateInterval(
                'field = (From (12/12/22) To (22/12/22)) AND field = 10',
                {
                    from: new Date('2022-12-02T09:40:34.633Z'),
                    to: new Date('2022-12-22T09:40:34.633Z')
                }
            )
        ).toEqual('field = (From (12/12/22) To (22/12/22)) AND field = 10')
    })
})

describe(setAliases.name, () => {
    describe('When translating back to string query from json', () => {
        const query = {
            'metadata.system.width': 25
        }

        const aliases = [
            {
                alias: 'Width',
                key: 'metadata.system.width'
            }
        ]

        let reverted: string = ''

        beforeAll(() => {
            reverted = setAliases(stringifySmartQuery(query), aliases)
        })

        it('should replace the key with the alias', () => {
            expect(reverted).to.equal('Width = 25')
        })
    })
})
