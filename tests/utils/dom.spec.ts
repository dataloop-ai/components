import { css, getElement, childHasFocus } from '../../src/utils/dom'
import { describe, it, expect } from 'vitest'

const element = {
    style: {}
}

describe('dom utils', () => {
    describe('css', () => {
        describe('override element style', () => {
            it('should update element style', () => {
                css(element as HTMLElement, { color: 'red' })
                expect(element.style).toStrictEqual({ color: 'red' })
            })
        })
    })

    describe('getElement', () => {
        describe('get element by prop', () => {
            it('should return null on empty string', () => {
                expect(getElement('div')).toBe(null)
            })

            it('should return null on undefined prop', () => {
                expect(getElement(null)).toBe(null)
            })
        })
    })

    describe('childHasFocus', () => {
        describe('get element by prop', () => {
            it('should return null on empty string', () => {
                expect(
                    childHasFocus(
                        null as unknown as HTMLElement,
                        null as unknown as Node
                    )
                ).toBe(true)
            })
        })
    })
})
