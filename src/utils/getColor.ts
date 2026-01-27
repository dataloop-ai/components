import { colorNames } from './css-color-names'
const CSS_COLOR_NAMES = [...Object.keys(colorNames)]

const regex =
    /(?:#|0x)(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/

const getColor = (color: string, fallback?: string) => {
    if (regex.test(color) || CSS_COLOR_NAMES.includes(color?.toLowerCase())) {
        return color
    }

    if (!color) return `var(--${fallback || 'dell-gray-800'})`
    if (color.includes('var(--')) return color

    return `var(--${color}, var(--${fallback || 'dell-gray-800'}))`
}

export { getColor }
