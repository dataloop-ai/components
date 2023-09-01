export function getRowKey(rowKey: string | Function) {
    return typeof rowKey === 'function'
        ? rowKey
        : (row: Record<string, any>) => row[rowKey as string]
}
