export const listenOpts: Record<string, any> = {
    hasPassive: false,
    passiveCapture: true,
    notPassiveCapture: true
}

try {
    const opts = Object.defineProperty({}, 'passive', {
        get() {
            Object.assign(listenOpts, {
                hasPassive: true,
                passive: { passive: true },
                notPassive: { passive: false },
                passiveCapture: { passive: true, capture: true },
                notPassiveCapture: { passive: false, capture: true }
            })
        }
    })
} catch (e) {
    console.log(e)
}

export function stopAndPrevent(e: Event) {
    if (e.cancelable) {
        e.preventDefault()
    }
    e.stopPropagation()
}

export function noop() {}

export function leftClick(e: MouseEvent) {
    return e.button === 0
}

export function position(e: any) {
    if (e.touches && e.touches[0]) {
        e = e.touches[0]
    } else if (e.changedTouches && e.changedTouches[0]) {
        e = e.changedTouches[0]
    } else if (e.targetTouches && e.targetTouches[0]) {
        e = e.targetTouches[0]
    }

    return {
        top: e.clientY,
        left: e.clientX
    }
}

export function stop(e: Event) {
    e.stopPropagation()
}

export function prevent(e: Event) {
    if (e.cancelable === false) return

    e.preventDefault()
}

export function addEvt(
    ctx: Record<string, any>,
    targetName: string,
    events: any[][]
) {
    const name = `__dl_${targetName}_evt`

    ctx[name] = ctx[name] !== void 0 ? ctx[name].concat(events) : events

    events.forEach((evt: any[]) => {
        evt[0].addEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]])
    })
}

export function cleanEvt(ctx: Record<string, any>, targetName: string) {
    const name = `__dl_${targetName}_evt`

    if (ctx[name] !== void 0) {
        ctx[name].forEach((evt: any[]) => {
            evt[0].removeEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]])
        })
        ctx[name] = void 0
    }
}
