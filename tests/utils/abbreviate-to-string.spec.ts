import { describe, it, expect } from 'vitest'
import { abbreviateToString } from '../../src/utils/abbreviate-to-string'

const abbreviateToString_testCases = [
    {
        value: 0,
        expected: '0'
    },
    {
        value: 100,
        expected: '100'
    },
    {
        value: 1000,
        expected: '1K'
    },
    {
        value: 1049,
        expected: '1K'
    },
    {
        value: 1050,
        expected: '1.1K'
    },
    {
        value: 10000,
        expected: '10K'
    },
    {
        value: 10049,
        expected: '10K'
    },
    {
        value: 10050,
        expected: '10.1K'
    },
    {
        value: 100000,
        expected: '100K'
    },
    {
        value: 555555,
        expected: '555.6K'
    },
    {
        value: 1000000,
        expected: '1M'
    },
    {
        value: 5555555,
        expected: '5.6M'
    },
    {
        value: 66666666,
        expected: '66.7M'
    },
    {
        value: 100000000,
        expected: '100M'
    },
    {
        value: 1000000000,
        expected: '1B'
    },
    {
        value: 100000000000,
        expected: '100B'
    },
    {
        value: 1000000000000,
        expected: '1T'
    }
]

describe('AbbreviateToString', () => {
    abbreviateToString_testCases.forEach((run) => {
        it('Should abbreviate number to string', () => {
            expect(abbreviateToString(run.value)).toMatch(run.expected)
        })
    })
})
