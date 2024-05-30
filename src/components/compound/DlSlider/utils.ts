export const getInputValue = (value: string, min: number, max: number) => {
    const numericValue = parseFloat(value)
    const clampedValue = Math.max(min, Math.min(numericValue, max))
    const isUpdated = numericValue !== clampedValue

    return { value: clampedValue, isUpdated }
}
