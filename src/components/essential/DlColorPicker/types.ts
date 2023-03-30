export type RGBColor = { r: number; g: number; b: number }
export type RGBAColor = { r: number; g: number; b: number; a: number }
export type HSVColor = { h: number; s: number; v: number }

export type ColorValue = RGBAColor & HSVColor

export type NewColor = {
    rgba: RGBAColor
    hsv: HSVColor
    hex: string
}

import { defaultColors as DlColorPickerColors } from './constants'
export { DlColorPickerColors }
