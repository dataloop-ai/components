export const calculateWidth = (height: number) => Math.round(height * (25 / 12))

export const calculateBorderRadius = (height: number) => height * 0.5

export const calculateMargin = (height: number) => Math.round(height / 12)

export const calculateCircleRadius = (height: number) =>
    height - calculateMargin(height) * 2

export const calculateActiveMarginLeft = (height: number) =>
    calculateWidth(height) -
    calculateMargin(height) -
    calculateCircleRadius(height)

export const hasOverflowing = (ref: any) =>
    ref?.offsetHeight < ref?.scrollHeight ||
    ref?.offsetWidth < ref?.scrollWidth ||
    false
