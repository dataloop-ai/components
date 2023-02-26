let lastKeyCompositionStatus = false

export function shouldIgnoreKey(evt: KeyboardEvent) {
    return (
        lastKeyCompositionStatus ||
        evt !== Object(evt) ||
        evt.isComposing === true
    )
}

export function isKeyCode(evt: KeyboardEvent, keyCodes: number) {
    return shouldIgnoreKey(evt) ? false : [keyCodes].includes(evt.keyCode)
}

export function onKeyDownComposition(evt: KeyboardEvent) {
    lastKeyCompositionStatus = evt.isComposing === true
}
