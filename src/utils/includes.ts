export function includes<T extends U, U>(coll: readonly T[], el: U): el is T {
    return coll.includes(el as T)
}
