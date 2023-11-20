export function getCellValue(
    col: Record<string, any>,
    row: Record<string, any>
) {
    if (!col) {
        return
    }
    const getField = (fieldPath: string) => {
        return getNestedProperty(row, fieldPath)
    }
    const val =
        typeof col?.field === 'function' ? col.field(row) : getField(col.field)

    return col?.format !== void 0 ? col.format(val, row) : val
}

function getNestedProperty(obj: Record<string, any>, propertyPath: string) {
    if (!propertyPath) {
        return obj
    }

    const pathArray = propertyPath.split('.')
    let value = obj

    for (const prop of pathArray) {
        if (value && value[prop]) {
            value = value[prop]
        } else {
            return undefined
        }
    }
    return value
}
