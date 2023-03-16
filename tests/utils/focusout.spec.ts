import { addFocusout, removeFocusout } from '../../src/utils/focusout'
import { describe, it, expect, vi } from 'vitest'

describe('focusout', () => {
    describe('addFocusout', () => {
        describe('should add focusout', () => {
            it('should return undefined', () => {
                expect(addFocusout(vi.fn())).toBe(undefined)
            })
        })
    })

    describe('removeFocusout', () => {
        describe('should add focusout', () => {
            it('should return undefined', () => {
                expect(removeFocusout(vi.fn())).toBe(undefined)
            })
        })
    })
})
