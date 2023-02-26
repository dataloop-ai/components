export function isObject(v: any) {
    return v !== null && typeof v === 'object' && Array.isArray(v) !== true
}

export function isDate(v: any) {
    return Object.prototype.toString.call(v) === '[object Date]'
}

export function isRegexp(v: any) {
    return Object.prototype.toString.call(v) === '[object RegExp]'
}

export function isNumber(v: any) {
    return typeof v === 'number' && isFinite(v)
}
