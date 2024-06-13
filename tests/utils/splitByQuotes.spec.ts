import { splitByQuotes } from '../../src/utils/splitByQuotes'
import { describe, it, expect } from 'vitest'

describe('splitByQuotes', () => {
    it('should split the words by space', () => {
        expect(splitByQuotes('word1 word2', ' ')).toEqual(['word1', 'word2'])
    })

    it('should split the words by space preserving single quotes', () => {
        expect(splitByQuotes("word1 'word 2'", ' ')).toEqual([
            'word1',
            "'word 2'"
        ])
    })

    it('should split the words by space preserving double quotes', () => {
        expect(splitByQuotes('word1 "word 2"', ' ')).toEqual([
            'word1',
            '"word 2"'
        ])
    })

    it('should split the words by space preserving escaped quotes', () => {
        expect(splitByQuotes('word1 " \'word\' 2"', ' ')).toEqual([
            'word1',
            '" \'word\' 2"'
        ])
    })

    it('should split the words by space preserving quotes and parenthesis', () => {
        expect(splitByQuotes('word1 "(1, 2)"', ' ')).toEqual([
            'word1',
            '"(1, 2)"'
        ])
    })

    it('should ignore brackets and other or escaped quotes between quotes', () => {
        expect(splitByQuotes('word1 "(1, 2" ', ' ')).toEqual([
            'word1',
            '"(1, 2"',
            ''
        ])

        expect(splitByQuotes(`hey = 'hello" there' `, ' ')).toEqual([
            'hey',
            '=',
            `'hello" there'`,
            ''
        ])

        expect(splitByQuotes(`ok 'parse\\' this' lol`, ' ')).toEqual([
            'ok',
            `'parse\\' this'`,
            'lol'
        ])

        expect(
            splitByQuotes(`now "multiple\\" )quotes' please'" okay`, ' ')
        ).toEqual(['now', `"multiple\\" )quotes' please'"`, 'okay'])
    })
})
