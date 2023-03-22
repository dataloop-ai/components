import { describe, it, expect } from 'vitest'
import { abbreviateToString } from '../../src/utils/abbreviate-to-string'

describe('abbreviateToString', () => {
    it('should abbreviate number to string', () => {
        expect(abbreviateToString(9124)).toMatch('9.1k')
    })
})
