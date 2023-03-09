import {
    ColorValue,
    HSVColor,
    RGBAColor,
    RGBColor
} from '../../src/components/DlColorPicker/types'
import {
    createAlphaSquare,
    createLinearGradient,
    rgb2hex,
    rgb2hsv,
    rgb2rgba,
    setColorValue
} from '../../src/components/DlColorPicker/utils'
import { describe, it, expect } from 'vitest'

describe('DlColorPicker setColorValue util', () => {
    it('should parse a color in hex format', () => {
        const color = '#123456'
        const expectedResult: ColorValue = {
            r: 18,
            g: 52,
            b: 86,
            a: 1,
            h: 210,
            s: 0.79,
            v: 0.34
        }

        const parsed = setColorValue(color)

        expect(parsed).toEqual(expectedResult)
    })

    it('should parse a color in RGB format', () => {
        const color = 'rgb(30, 40, 50)'
        const expectedResult: ColorValue = {
            r: 30,
            g: 40,
            b: 50,
            a: 1,
            h: 210,
            s: 0.4,
            v: 0.2
        }

        const parsed = setColorValue(color)

        expect(parsed).toEqual(expectedResult)
    })

    it('should parse a color in RGBA format', () => {
        const color = 'rgba(30, 40, 50, 0.5)'
        const expectedResult: ColorValue = {
            r: 30,
            g: 40,
            b: 50,
            a: 0.5,
            h: 210,
            s: 0.4,
            v: 0.2
        }

        const parsed = setColorValue(color)

        expect(parsed).toEqual(expectedResult)
    })

    it('should parse a color in RGBA format (string)', () => {
        const color = '30, 40, 50, 0.5'

        const expectedResult: ColorValue = {
            r: 30,
            g: 40,
            b: 50,
            a: 0.5,
            h: 210,
            s: 0.4,
            v: 0.2
        }

        const parsed = setColorValue(color)

        expect(parsed).toEqual(expectedResult)
    })

    it('should parse a color in RGBA format (object)', () => {
        const color: RGBAColor = {
            r: 30,
            g: 40,
            b: 50,
            a: 0.5
        }

        const expectedResult: ColorValue = {
            r: 30,
            g: 40,
            b: 50,
            a: 0.5,
            h: 210,
            s: 0.4,
            v: 0.2
        }

        const parsed = setColorValue(color)

        expect(parsed).toEqual(expectedResult)
    })
})

// describe('DlColorPicker createAlphaSquare util', () => {
//     const size = 50
//     const doubleSize = size * 2

//     const squareCanvas = createAlphaSquare(size)

//     expect(squareCanvas).toBeDefined()
//     expect(squareCanvas.width).toEqual(doubleSize)
//     expect(squareCanvas.height).toEqual(doubleSize)
// })

describe('DlColorPicker createLinearGradient util', () => {
    it('should add a linear gradient to a canvas context', () => {
        const canvas = createAlphaSquare(50)
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        createLinearGradient('l', ctx, 50, 50, 'red', 'green')
    })
})

describe('DlColorPicker rgb2hex util', () => {
    it('should convert a color from RGB to hex (lowercase)', () => {
        const color: RGBColor = { r: 50, g: 60, b: 70 }
        const expected = '#323c46'

        const result = rgb2hex(color, false)

        expect(result).toEqual(expected)
    })

    it('should convert a color from RGB to hex (uppercase)', () => {
        const color: RGBColor = { r: 50, g: 60, b: 70 }
        const expected = '#323C46'

        const result = rgb2hex(color, true)

        expect(result).toEqual(expected)
    })
})

describe('DlColorPicker rgb2rgba util', () => {
    it('should convert a color from RGB to RGBA', () => {
        const color = 'rgba(50, 50, 50, 0.4)'
        const expected: RGBAColor = {
            r: 50,
            g: 50,
            b: 50,
            a: 0.4
        }

        const result = rgb2rgba(color)

        expect(result).toEqual(expected)
    })
})

describe('DlColorPicker rgb2hsv util', () => {
    it('should convert a color from RGB to HSV (#1)', () => {
        const color: RGBColor = {
            r: 50,
            g: 50,
            b: 50
        }
        const expected: HSVColor = {
            h: 0,
            s: 0,
            v: 0.2
        }

        const result = rgb2hsv(color)

        expect(result).toEqual(expected)
    })

    it('should convert a color from RGB to HSV (#2)', () => {
        const color: RGBColor = {
            r: 50,
            g: 60,
            b: 50
        }
        const expected: HSVColor = {
            h: 120,
            s: 0.17,
            v: 0.24
        }

        const result = rgb2hsv(color)

        expect(result).toEqual(expected)
    })

    it('should convert a color from RGB to HSV (#3)', () => {
        const color: RGBColor = {
            r: 80,
            g: 40,
            b: 60
        }
        const expected: HSVColor = {
            h: 330,
            s: 0.5,
            v: 0.31
        }

        const result = rgb2hsv(color)

        expect(result).toEqual(expected)
    })

    it('should convert a color from RGB to HSV (#4)', () => {
        const color: RGBColor = {
            r: 80,
            g: 60,
            b: 40
        }
        const expected: HSVColor = {
            h: 30,
            s: 0.5,
            v: 0.31
        }

        const result = rgb2hsv(color)

        expect(result).toEqual(expected)
    })
})
