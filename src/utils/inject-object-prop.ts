export function injectProp(
    target: Record<string, any>,
    propName: string,
    get: () => any,
    set?: (val: any, evt?: any) => void
) {
    Object.defineProperty(target, propName, {
        get,
        set,
        enumerable: true
    })
}

export function injectMultipleProps(
    target: Record<string, any>,
    props: Record<string, any>
) {
    for (const key in props) {
        injectProp(target, key, props[key])
    }
}
