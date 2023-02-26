let queue: Function[] = []
let waitFlags: Object[] = []

function clearFlag(flag: Object) {
    waitFlags = waitFlags.filter((entry) => entry !== flag)
}

export function addFocusWaitFlag(flag: Object) {
    clearFlag(flag)
    waitFlags.push(flag)
}

export function removeFocusWaitFlag(flag: Object) {
    clearFlag(flag)

    if (waitFlags.length === 0 && queue.length > 0) {
        // only call last focus handler (can't focus multiple things at once)
        queue[queue.length - 1]()
        queue = []
    }
}

export function addFocusFn(fn: Function) {
    if (waitFlags.length === 0) {
        fn()
    } else {
        queue.push(fn)
    }
}

export function removeFocusFn(fn: Function) {
    queue = queue.filter((entry) => entry !== fn)
}
