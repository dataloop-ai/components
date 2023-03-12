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
})
