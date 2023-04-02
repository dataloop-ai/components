export const getInputValue = (value: string, min: number, max: number) => {
    if (parseInt(value) > max || parseInt(value) < min) {
        return { value: (parseInt(value) > max ? max : min).toString() }
    }

    return { value }
}
