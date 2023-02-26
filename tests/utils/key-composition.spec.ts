import {
    shouldIgnoreKey,
    isKeyCode,
    onKeyDownComposition
} from '../../src/utils/key-composition'

const evt = {
    keyCode: 17
}

describe('key-composition', () => {
    describe('shouldIgnoreKey', () => {
        describe('should ignore key', () => {
            it('should return false', () => {
                expect(shouldIgnoreKey(new KeyboardEvent('enter'))).toBe(false)
            })
        })
    })

    describe('isKeyCode', () => {
        describe('should return keycode value', () => {
            it('should return false', () => {
                expect(isKeyCode(evt as KeyboardEvent, 13)).toBe(false)
            })

            it('should return true', () => {
                expect(isKeyCode(evt as KeyboardEvent, 17)).toBe(true)
            })
        })
    })

    describe('onKeyDownComposition', () => {
        describe('should override key', () => {
            it('should return undefined', () => {
                expect(onKeyDownComposition(new KeyboardEvent('enter'))).toBe(
                    undefined
                )
            })
        })
    })
})
