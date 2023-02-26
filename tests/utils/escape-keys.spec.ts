import { addEscapeKey, removeEscapeKey } from '../../src/utils/escape-key'

describe('escape-keys utils', () => {
    describe('addEscapeKey', () => {
        describe('should not add event listener', () => {
            it('should return undefined', () => {
                expect(addEscapeKey(jest.fn())).toBe(undefined)
            })
        })
    })

    describe('removeEscapeKey', () => {
        describe('should not add event listener', () => {
            it('should return undefined', () => {
                expect(removeEscapeKey(jest.fn())).toBe(undefined)
            })
        })
    })
})
