export function sortDate(a: string, b: string) {
    return new Date(a).getTime() - new Date(b).getTime()
}

export function sortBoolean(a: boolean, b: boolean) {
    return a && !b ? -1 : !a && b ? 1 : 0
}
