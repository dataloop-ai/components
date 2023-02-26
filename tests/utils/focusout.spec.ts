import { addFocusout, removeFocusout } from '../../src/utils/focusout'

describe('focusout', () => {
    describe('addFocusout', () => {
        describe('should add focusout', () => {
            it('should return undefined', () => {
                expect(addFocusout(jest.fn())).toBe(undefined)
            })
        })
    })

    describe('removeFocusout', () => {
        describe('should add focusout', () => {
            it('should return undefined', () => {
                expect(removeFocusout(jest.fn())).toBe(undefined)
            })
        })
    })
})
