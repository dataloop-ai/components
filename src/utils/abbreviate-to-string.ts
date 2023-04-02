export function abbreviateToString(num: number, precision: number = 1): string {
    const abbreviations = [
        { value: 1e12, suffix: 'T' },
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' }
    ]

    const match = abbreviations.find((abb) => num >= abb.value)
    if (!match) {
        return num.toString()
    }

    const abbreviated = (num / match.value).toFixed(precision)
    const formatted = Number(abbreviated).toString()
    const suffix = match.suffix

    if (formatted.includes('.')) {
        return formatted.replace(/\.?0*$/, '') + suffix
    } else {
        return formatted + suffix
    }
}
