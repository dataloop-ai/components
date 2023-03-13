import { cloneDeep } from 'lodash'

export function updateKey(
    data: Record<string, any>,
    key: string,
    mapFn: Function
): Record<string, any> {
    const input = cloneDeep(data)

    recursiveKeyUpdate(input, key, mapFn)

    return input
}

export function recursiveKeyUpdate(
    input: Record<string, any>,
    key: string,
    mapFn: Function
): Record<string, any> {
    if (input instanceof Array) {
        for (let i = 0; i < input.length; i++) {
            recursiveKeyUpdate(input[i], key, mapFn)
        }
    } else {
        for (const prop in input) {
            if (prop === key) {
                input[prop] = mapFn(input[prop])
            }

            if (input[prop] instanceof Object || input[prop] instanceof Array) {
                recursiveKeyUpdate(input[prop], key, mapFn)
            }
        }
    }

    return input
}
