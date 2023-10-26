export function numberWithComma(nr: number) {
    if (!nr) return '0'
    return new Intl.NumberFormat('en-US', {
        style: 'decimal'
    }).format(nr)
}

export function abbreviateNumber(nr: number) {
    if (!nr) return '0'
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
    }).format(nr)
}

export function abbreviateBytes(nr: number) {
    if (!nr) return '0B'
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        style: 'unit',
        unit: 'byte',
        unitDisplay: 'narrow'
    }).format(nr)
}
