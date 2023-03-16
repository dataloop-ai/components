import { describe, it, expect } from 'vitest'
import { abbreviateToString } from '../../src/utils/abbreviate-to-string'

describe('abbreviateToString', () => {
    it('should abbreviate number to string', () => {
        const number = 9121
        expect(abbreviateToString(number)).toMatch('9.1k')
    })
})
