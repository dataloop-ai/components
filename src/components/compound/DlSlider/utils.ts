export const getInputValue = (value: string, min: number, max: number) => {
    if (parseFloat(value) > max || parseFloat(value) < min) {
        return { value: (parseFloat(value) > max ? max : min).toString() }
    }

    return { value }
}
