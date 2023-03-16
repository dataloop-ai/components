import { addEscapeKey, removeEscapeKey } from '../../src/utils/escape-key'
import { describe, it, expect, vi } from 'vitest'

describe('escape-keys utils', () => {
    describe('addEscapeKey', () => {
        describe('should not add event listener', () => {
            it('should return undefined', () => {
                expect(addEscapeKey(vi.fn())).toBe(undefined)
            })
        })
    })

    describe('removeEscapeKey', () => {
        describe('should not add event listener', () => {
            it('should return undefined', () => {
                expect(removeEscapeKey(vi.fn())).toBe(undefined)
            })
        })
    })
})
