export const hexToRgbA = (hex: string, opacity = 1) => {
    try {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        if (opacity) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')'
        } else {
            return 'rgb(' + r + ', ' + g + ', ' + b + ')'
        }
    } catch {
        return hex
    }
}

export const revertRGBAOpacity = (oldRGBA: string) =>
    oldRGBA.replace(/[^,]+(?=\))/, '1')

export const rgba2hex = (rgba: string) => {
    let a: string | number
    const rgb = rgba
        .replace(/\s/g, '')
        .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i)
    const alpha = ((rgb && rgb[4]) || '').trim()
    let hex

    if (rgb) {
        hex =
            ((rgb[1] as any) | (1 << 8)).toString(16).slice(1) +
            ((rgb[2] as any) | (1 << 8)).toString(16).slice(1) +
            ((rgb[3] as any) | (1 << 8)).toString(16).slice(1)
    } else {
        return rgba
    }

    if (alpha !== '') {
        a = alpha
    } else {
        a = 0o1
    }
    // multiply before convert to HEX
    a = (((a as number) * 255) | (1 << 8)).toString(16).slice(1)
    hex = hex + a

    return `#${hex}`
}
