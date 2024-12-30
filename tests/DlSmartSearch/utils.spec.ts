import moment from 'moment'
import {
    isEndOfString,
    isEndingWithDatePattern,
    replaceDateInterval,
    formatToNumericDate,
    setAliases
} from '../../src/components/compound/DlSearches/DlSmartSearch/utils'
import { stringifySmartQuery } from '../../src/utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { pureDateSuggestionPattern } from '../../src/hooks/use-suggestions'

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

describe('isEndingWithDatePattern', () => {
    it('should return "false" when the string does not match the "dateSuggestionPattern" at the end', () => {
        expect(
            isEndingWithDatePattern('field > (12/12/22 00:00:00)')
        ).toBe(false)
    })

    it('should return "true" when the string does match the "dateSuggestionPattern" at the end', () => {
        expect(
            isEndingWithDatePattern(
                'field > (DD/MM/YYYY HH:mm:ss)'
            )
        ).toBe(true)
    })
})

describe('formatToNumericDate', () => {
    it('should return the correct date', () => {
        const expected = moment(
            '02/12/2022 00:00:00',
            pureDateSuggestionPattern
        ).toDate()
        // expected value will have 0 hours in local timezone
        expect(expected.getHours()).toEqual(0)

        const date = '(02/12/2022 00:00:00)'
        const formattedDate = formatToNumericDate(date)
        // formatted date will nonetheless be equal to the number of ms
        // since the midnight at the beginning of January 1, 1970, UTC
        const msTime = expected.getTime()
        expect(formattedDate).toEqual(msTime)
    })
})

describe('replaceDateInterval', () => {
    it('should replace the last occurrence of the value that matches the "dateIntervalPattern"', () => {
        const string = `field = (02/12/2022 00:00:00) AND field = (${pureDateSuggestionPattern})`
        const toReplace = new Date(formatToNumericDate('(02/12/2022 00:00:00)'))
        const expected =
            'field = (02/12/2022 00:00:00) AND field = (02/12/2022 00:00:00)'
        const replaced = replaceDateInterval(string, toReplace)

        console.log(replaced)
        expect(replaced).toEqual(expected)
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
