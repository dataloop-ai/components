let lastKeyCompositionStatus = false

export function shouldIgnoreKey(evt: KeyboardEvent) {
    return (
        lastKeyCompositionStatus ||
        evt !== Object(evt) ||
        evt.isComposing === true
    )
}

export function isKeyCode(evt: KeyboardEvent, key: number | string) {
    if (!key) {
        return false
    }

    return shouldIgnoreKey(evt)
        ? false
        : [key].includes(evt.key) ||
              [key].includes(evt.keyCode) ||
              [key].includes(evt.code)
}

export function onKeyDownComposition(evt: KeyboardEvent) {
    lastKeyCompositionStatus = evt.isComposing === true
}
