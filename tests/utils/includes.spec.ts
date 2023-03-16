import { includes } from '../../src/utils'
import { describe, it, expect } from 'vitest'

describe('includes fn', () => {
    describe('when items are in array', () => {
        it('should return true', () => {
            expect(includes([1, 2, 3], 1)).toBe(true)
        })
    })

    describe('otherwise', () => {
        it('should return false', () => {
            expect(includes([1, 2, 3], 5)).toBe(false)
        })
    })
})
