import { between } from '../../src/utils'
import { describe, it, expect } from 'vitest'

describe('format utils', () => {
    describe('between', () => {
        describe('when max<= min', () => {
            it('should return min', () => {
                expect(between(1.2, 2, 1)).toBe(2)
            })
        })

        describe('otherwise', () => {
            it('should return expected value', () => {
                expect(between(1.2, 1, 2)).toBe(1.2)
            })
        })
    })
})
