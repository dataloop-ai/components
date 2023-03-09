import {
    addFocusWaitFlag,
    removeFocusWaitFlag,
    addFocusFn,
    removeFocusFn
} from '../../src/utils/focus-manager'
import { describe, it, expect, vi } from 'vitest'

describe('focus-manage', () => {
    describe('addFocusFn', () => {
        describe('should add focus', () => {
            it('should return undefined', () => {
                expect(addFocusFn(vi.fn())).toBe(undefined)
            })
        })
    })

    describe('addFocusWaitFlag', () => {
        describe('should add flag', () => {
            it('should return undefined', () => {
                expect(addFocusWaitFlag({})).toBe(undefined)
            })
        })
    })

    describe('removeFocusWaitFlag', () => {
        describe('should remove flag', () => {
            it('should return undefined', () => {
                expect(removeFocusWaitFlag({})).toBe(undefined)
            })
        })
    })

    describe('removeFocusFn', () => {
        describe('should remove focus', () => {
            it('should return undefined', () => {
                expect(removeFocusFn(vi.fn())).toBe(undefined)
            })
        })
    })
})
