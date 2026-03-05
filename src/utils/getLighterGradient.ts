import { colorNames } from './css-color-names'
import { getRootStyles } from './getRootStyles'
const MAGNITUDE = 100

const allColorNames = {
    ...colorNames,
    ...getRootStyles()
}

const getDellColorNextShade = (color: string): string | null => {
    if (!color) {
        return null
    }
    if (!color.startsWith('dell-')) {
        return color
    }

    const colorMatch = color.match(/dell-(\w+)-(\d+)/)
    if (!colorMatch) {
        return color
    }

    try {
        const colorName = colorMatch[1]
        const colorValue = parseInt(colorMatch[2])
        const nextColorValue = colorValue + 100
        const nextColor = `--dell-${colorName}-${nextColorValue}`

        if (nextColor in allColorNames) {
            return `dell-${colorName}-${nextColorValue}`
        }
    } catch (error) {
        // skip error
    }

    return color
}
const getLighterGradient = (color: string, magnitude = MAGNITUDE) => {
    if (color.startsWith('dl-')) {
        color = `--${color}`
    }
    if (color.startsWith('dell-')) {
        const nextColor = getDellColorNextShade(color)
        const nextColorName = `--${nextColor}`
        if (nextColorName && nextColorName in allColorNames) {
            return allColorNames[nextColorName as keyof typeof allColorNames]
        } else {
            color = nextColor
        }
    }
    let newColor =
        color in allColorNames
            ? allColorNames[color as keyof typeof allColorNames]
            : color
    newColor = newColor.replace(`#`, ``).trim()
    if (newColor.length === 6) {
        const decimalColor = parseInt(newColor, 16)

        let r = (decimalColor >> 16) + magnitude
        if (r > 255) r = 255
        if (r < 0) r = 0
        let g = (decimalColor & 0x0000ff) + magnitude
        if (g > 255) g = 255
        if (g < 0) g = 0
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude
        if (b > 255) b = 255
        if (b < 0) b = 0
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`
    } else {
        return newColor
    }
}

export { getLighterGradient, getDellColorNextShade }
