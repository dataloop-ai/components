export const stringStyleToRecord = (input: string): Record<string, string> => {
    const style = input.split(';')
    const output: Record<string, string> = {}
    style.forEach((item) => {
        const [key, value] = item.split(':')
        if (key && value) {
            output[snakeToCamel(key.trim())] = value.trim()
        }
    })
    return output
}

export const snakeToCamel = (str: string): string => {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    )
}
