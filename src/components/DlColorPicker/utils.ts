import { ColorValue, HSVColor, RGBAColor, RGBColor } from './types'

export function setColorValue(color: any): ColorValue {
    let rgba: RGBAColor = { r: 0, g: 0, b: 0, a: 1 }
    if (/#/.test(color)) {
        rgba = hex2rgb(color)
    } else if (/rgb/.test(color)) {
        rgba = rgb2rgba(color)
    } else if (typeof color === 'string') {
        rgba = rgb2rgba(`rgba(${color})`)
    } else if (Object.prototype.toString.call(color) === '[object Object]') {
        rgba = color
    }
    const { r, g, b, a = 1 } = rgba
    const { h, s, v } = rgb2hsv(rgba)
    return { r, g, b, a, h, s, v }
}

export function createAlphaSquare(size: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const doubleSize = size * 2
    canvas.width = doubleSize
    canvas.height = doubleSize

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, doubleSize, doubleSize)
    ctx.fillStyle = '#ccd5db'
    ctx.fillRect(0, 0, size, size)
    ctx.fillRect(size, size, size, size)

    return canvas
}

export function createLinearGradient(
    direction: string,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color1: string,
    color2: string
): void {
    const isL = direction === 'l'
    const gradient = ctx.createLinearGradient(
        0,
        0,
        isL ? width : 0,
        isL ? 0 : height
    )
    gradient.addColorStop(0.01, color1)
    gradient.addColorStop(0.99, color2)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
}

export function rgb2hex({ r, g, b }: RGBColor, toUpper: boolean): string {
    const change = (val: number) => ('0' + Number(val).toString(16)).slice(-2)
    const color = `#${change(r)}${change(g)}${change(b)}`
    return toUpper ? color.toUpperCase() : color
}

export function hex2rgb(hex: string): RGBAColor {
    hex = hex.slice(1)

    const change = (val: string) => parseInt(val, 16) || 0

    if (hex.length === 3) {
        if (hex[0] === hex[1] && hex[0] === hex[2]) {
            return {
                r: change(hex.slice(0, 2)),
                g: change(hex.slice(0, 2)),
                b: change(hex.slice(0, 2)),
                a: 1
            }
        }
    }

    return {
        r: change(hex.slice(0, 2)),
        g: change(hex.slice(2, 4)),
        b: change(hex.slice(4, 6)),
        a: 1
    }
}

export function rgb2rgba(value: string | any): RGBAColor {
    value = (/rgba?\((.*?)\)/.exec(value) || ['', '0,0,0,1'])[1].split(',')

    return {
        r: Number(value[0]) || 0,
        g: Number(value[1]) || 0,
        b: Number(value[2]) || 0,
        a: Number(value[3] ? value[3] : 1)
    }
}

export function rgb2hsv(rgbColor: RGBColor): HSVColor {
    const r = rgbColor.r / 255
    const g = rgbColor.g / 255
    const b = rgbColor.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    let h = 0
    if (max === min) {
        h = 0
    } else if (max === r) {
        if (g >= b) {
            h = (60 * (g - b)) / delta
        } else {
            h = (60 * (g - b)) / delta + 360
        }
    } else if (max === g) {
        h = (60 * (b - r)) / delta + 120
    } else if (max === b) {
        h = (60 * (r - g)) / delta + 240
    }

    h = Math.floor(h)

    const s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
    const v = parseFloat(max.toFixed(2))

    return { h, s, v }
}
