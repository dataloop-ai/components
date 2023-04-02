import {
    validatePosition,
    validateOffset,
    parsePosition,
    getAnchorProps,
    getTargetProps
} from '../../src/utils/position-engine'
import { describe, it, expect } from 'vitest'

const evt = {
    keyCode: 17
}

describe('position-engine', () => {
    describe('validatePosition', () => {
        it('should return true', () => {
            expect(validatePosition('bottom left')).toBe(true)
        })

        it('should return false', () => {
            expect(validatePosition('unknown left')).toBe(false)
        })

        it('should return false', () => {
            expect(validatePosition('bottom unknown')).toBe(false)
        })

        it('should return false if value is one string', () => {
            expect(validatePosition('left')).toBe(false)
        })
    })

    describe('validateOffset', () => {
        it('should return true if no value', () => {
            expect(validateOffset(null as unknown as number[])).toBe(true)
        })

        it('should return false if value = [2]', () => {
            expect(validateOffset([2])).toBe(false)
        })

        it('should return false if value = [11f, 12]', () => {
            expect(validateOffset(['11f' as unknown as number, 12])).toBe(false)
        })

        it('should return true if value = [11, 12]', () => {
            expect(validateOffset([11, 12])).toBe(true)
        })
    })

    describe('parsePosition', () => {
        it('should return position', () => {
            expect(parsePosition('bottom left')).toStrictEqual({
                horizontal: 'left',
                vertical: 'bottom'
            })
        })
    })

    describe('getAnchorProps', () => {
        it('should return anchor props', () => {
            expect(
                getAnchorProps(
                    {
                        getBoundingClientRect: () => ({
                            top: 10,
                            left: 10,
                            right: 10,
                            bottom: 10,
                            width: 20,
                            height: 100
                        })
                    } as HTMLElement,
                    [0, 0]
                )
            ).toStrictEqual({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                width: 20,
                height: 100,
                middle: 10,
                center: 10
            })
        })
    })

    describe('getTargetProps', () => {
        it('should return position', () => {
            expect(
                getTargetProps({
                    offsetHeight: 2,
                    offsetWidth: 2
                } as HTMLElement)
            ).toStrictEqual({
                top: 0,
                center: 1,
                bottom: 2,
                left: 0,
                middle: 1,
                right: 2
            })
        })
    })
})
