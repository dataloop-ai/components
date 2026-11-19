/**
 * Raw value of a column for a row, before `format` (used for sorting).
 */
export function getFieldValue(
    col: Record<string, any>,
    row: Record<string, any>
) {
    if (!col) {
        return
    }
    if (typeof col.field === 'function') {
        return col.field(row)
    }
    const val = getNestedProperty(row, col.field)
    // keys that literally contain a dot (e.g. 'metadata.user') are honoured too
    return val === undefined && row && col.field in row ? row[col.field] : val
}

export function getCellValue(
    col: Record<string, any>,
    row: Record<string, any>
) {
    if (!col) {
        return
    }
    const val = getFieldValue(col, row)

    return col?.format !== void 0 ? col.format(val, row) : val
}

function getNestedProperty(obj: Record<string, any>, propertyPath: string) {
    if (!propertyPath) {
        return obj
    }

    const isDefined = (value: any) => value !== undefined && value !== null

    const pathArray = propertyPath.split('.')
    let value = obj

    for (const prop of pathArray) {
        if (value && isDefined(value[prop])) {
            value = value[prop]
        } else {
            return undefined
        }
    }
    return value
}
