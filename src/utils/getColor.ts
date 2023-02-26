import { colorNames } from './css-color-names'
const CSS_COLOR_NAMES = [...Object.keys(colorNames)]

const regex =
    /(?:#|0x)(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/

const getColor = (color: string, fallback?: string) => {
    if (regex.test(color) || CSS_COLOR_NAMES.includes(color?.toLowerCase())) {
        return color
    }

    if (!color) return `var(--${fallback || 'dl-color-darker'})`

    return `var(--${color}, var(--${fallback || 'dl-color-darker'}))`
}

export { getColor }
