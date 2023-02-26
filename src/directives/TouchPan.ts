import { isVue2 } from 'vue-demi'
import {
    stopAndPrevent,
    prevent,
    cleanEvt,
    leftClick,
    addEvt,
    position,
    stop
} from '../utils/events'
import { clearSelection } from '../utils'

type Modifiers = {
    [key: string]: boolean
}

type Ctx = {
    uid: string
    handler: any
    modifiers: Modifiers
    direction: Record<string, any>
    lastEvt?: any
    event?: any
    initialEvent?: any
    styleCleanup?: any
    mouseStart: (evt: MouseEvent) => void
    touchStart: (evt: TouchEvent) => void
    start: (evt: any, mouseEvent?: boolean) => void
    move: (evt: MouseEvent) => void
    end: (evt: MouseEvent, abort?: boolean) => void
}

function getChanges(
    evt: MouseEvent,
    ctx: Record<string, any>,
    isFinal?: boolean
) {
    const pos = position(evt)
    let dir
    let distX = pos.left - ctx.event.x
    let distY = pos.top - ctx.event.y
    let absX = Math.abs(distX)
    let absY = Math.abs(distY)

    const direction = ctx.direction

    if (direction.horizontal === true) {
        dir = distX < 0 ? 'left' : 'right'
    } else if (direction.up === true && distY < 0) {
        dir = 'up'
        if (absX > absY) {
            if (direction.left === true && distX < 0) {
                dir = 'left'
            } else if (direction.right === true && distX > 0) {
                dir = 'right'
            }
        }
    } else if (direction.down === true && distY > 0) {
        dir = 'down'
        if (absX > absY) {
            if (direction.left === true && distX < 0) {
                dir = 'left'
            } else if (direction.right === true && distX > 0) {
                dir = 'right'
            }
        }
    } else if (direction.left === true && distX < 0) {
        dir = 'left'
        if (absX < absY) {
            if (direction.up === true && distY < 0) {
                dir = 'up'
            } else if (direction.down === true && distY > 0) {
                dir = 'down'
            }
        }
    } else if (direction.right === true && distX > 0) {
        dir = 'right'
        if (absX < absY) {
            if (direction.up === true && distY < 0) {
                dir = 'up'
            } else if (direction.down === true && distY > 0) {
                dir = 'down'
            }
        }
    }

    let synthetic = false

    if (dir === void 0 && isFinal === false) {
        if (ctx.event.isFirst === true || ctx.event.lastDir === void 0) {
            return {}
        }

        dir = ctx.event.lastDir
        synthetic = true

        if (dir === 'left' || dir === 'right') {
            pos.left -= distX
            absX = 0
            distX = 0
        } else {
            pos.top -= distY
            absY = 0
            distY = 0
        }
    }

    return {
        synthetic,
        payload: {
            evt,
            touch: ctx.event.mouse !== true,
            mouse: ctx.event.mouse === true,
            position: pos,
            direction: dir,
            isFirst: ctx.event.isFirst,
            isFinal: isFinal === true,
            duration: Date.now() - ctx.event.time,
            distance: {
                x: absX,
                y: absY
            },
            offset: {
                x: distX,
                y: distY
            },
            delta: {
                x: pos.left - ctx.event.lastX,
                y: pos.top - ctx.event.lastY
            }
        }
    }
}

function destroy(el: any) {
    const ctx = el.__dl_touchpan
    if (ctx !== void 0) {
        // emit the end event when the directive is destroyed while active
        // this is only needed in TouchPan because the rest of the touch directives do not emit an end event
        // the condition is also checked in the start of function but we avoid the call
        if (ctx.event !== void 0) {
            ctx.end()
        }

        cleanEvt(ctx, 'main')
        cleanEvt(ctx, 'temp')

        if (ctx.styleCleanup !== void 0) {
            ctx.styleCleanup()
        }

        delete el.__dl_touchpan
    }
}

function shouldStart(evt: any, ctx: any) {
    return (
        ctx.event === void 0 &&
        evt.target !== void 0 &&
        evt.target.draggable !== true &&
        typeof ctx.handler === 'function' &&
        evt.target.nodeName.toUpperCase() !== 'INPUT' &&
        (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1)
    )
}

let uid = 0

const touchPanV2 = {
    bind(el: HTMLElement, { value, modifiers }: any) {
        // @ts-ignore
        if (el.__dl_touchpan !== void 0) {
            destroy(el)
            // @ts-ignore
            el.__dl_touchpan_destroyed = true
        }

        if (modifiers.mouse !== true) {
            return
        }

        function handleEvent(evt: any, mouseEvent: boolean) {
            if (modifiers.mouse === true && mouseEvent === true) {
                stopAndPrevent(evt)
            } else {
                if (modifiers.stop === true) {
                    stop(evt)
                }

                if (modifiers.prevent === true) {
                    prevent(evt)
                }
            }
        }

        const ctx: Ctx = {
            uid: 'qvtp_' + uid++,
            handler: value,
            modifiers,
            direction: {
                left: true,
                right: true
            },
            mouseStart(evt: MouseEvent) {
                if (shouldStart(evt, ctx) && leftClick(evt)) {
                    addEvt(ctx, 'temp', [
                        [document, 'mousemove', 'move', 'notPassiveCapture'],
                        [document, 'mouseup', 'end', 'passiveCapture']
                    ])

                    ctx.start(evt, true)
                }
            },

            touchStart(evt: TouchEvent) {
                if (shouldStart(evt, ctx)) {
                    const target = evt.target as HTMLElement

                    addEvt(ctx, 'temp', [
                        [target, 'touchmove', 'move', 'notPassiveCapture'],
                        [target, 'touchcancel', 'end', 'passiveCapture'],
                        [target, 'touchend', 'end', 'passiveCapture']
                    ])

                    ctx.start(evt)
                }
            },

            start(evt: any, mouseEvent?: boolean) {
                ctx.lastEvt = evt

                const pos = position(evt)

                /*
                 * Stop propagation so possible upper v-touch-pan don't catch this as well;
                 * If we're not the target (based on modifiers), we'll re-emit the event later
                 */
                if (mouseEvent === true || modifiers.stop === true) {
                    /*
                     * are we directly switching to detected state?
                     * clone event only otherwise
                     */
                    if (
                        ctx.direction.all !== true &&
                        (mouseEvent !== true ||
                            ctx.direction.mouseAllDir !== true)
                    ) {
                        const clone: any =
                            evt.type.indexOf('mouse') > -1
                                ? new MouseEvent(evt.type, evt)
                                : new TouchEvent(evt.type, evt)

                        if (evt.defaultPrevented === true) {
                            prevent(clone)
                        }

                        if (evt.cancelBubble === true) {
                            stop(clone)
                        }

                        clone.qClonedBy =
                            evt.qClonedBy === void 0
                                ? [ctx.uid]
                                : evt.qClonedBy.concat(ctx.uid)
                        clone.qKeyEvent = evt.qKeyEvent
                        clone.qClickOutside = evt.qClickOutside

                        ctx.initialEvent = {
                            target: evt.target,
                            event: clone
                        }
                    }

                    stop(evt)
                }

                ctx.event = {
                    x: pos.left,
                    y: pos.top,
                    time: Date.now(),
                    mouse: mouseEvent === true,
                    detected: false,
                    isFirst: true,
                    isFinal: false,
                    lastX: pos.left,
                    lastY: pos.top
                }
            },

            move(evt: MouseEvent) {
                if (ctx.event === void 0) {
                    return
                }

                ctx.lastEvt = evt

                const isMouseEvt = ctx.event.mouse === true
                const start = () => {
                    handleEvent(evt, isMouseEvt)

                    if (modifiers.preserveCursor !== true) {
                        document.documentElement.style.cursor = 'grabbing'
                    }

                    if (isMouseEvt === true) {
                        document.body.classList.add(
                            'no-pointer-events--children'
                        )
                    }

                    document.body.classList.add('non-selectable')
                    clearSelection()

                    ctx.styleCleanup = (withDelayedFn: any) => {
                        ctx.styleCleanup = void 0

                        if (modifiers.preserveCursor !== true) {
                            document.documentElement.style.cursor = ''
                        }
                        document.body.classList.remove('non-selectable')

                        if (isMouseEvt === true) {
                            const remove = () => {
                                document.body.classList.remove(
                                    'no-pointer-events--children'
                                )
                            }

                            if (withDelayedFn !== void 0) {
                                setTimeout(() => {
                                    remove()
                                    withDelayedFn()
                                }, 50)
                            } else {
                                remove()
                            }
                        } else if (withDelayedFn !== void 0) {
                            withDelayedFn()
                        }
                    }
                }

                if (ctx.event.detected === true) {
                    if (ctx.event.isFirst !== true) {
                        handleEvent(evt, ctx.event.mouse)
                    }

                    const { payload, synthetic } = getChanges(evt, ctx, false)

                    if (payload !== void 0) {
                        if (ctx.handler(payload) === false) {
                            ctx.end(evt)
                        } else {
                            if (
                                ctx.styleCleanup === void 0 &&
                                ctx.event.isFirst === true
                            ) {
                                start()
                            }

                            ctx.event.lastX = payload.position.left
                            ctx.event.lastY = payload.position.top
                            ctx.event.lastDir =
                                synthetic === true ? void 0 : payload.direction
                            ctx.event.isFirst = false
                        }
                    }

                    return
                }

                if (
                    ctx.direction.all === true ||
                    (isMouseEvt === true && ctx.modifiers.mouseAllDir === true)
                ) {
                    start()
                    ctx.event.detected = true
                    ctx.move(evt)
                    return
                }

                const pos = position(evt)
                const distX = pos.left - ctx.event.x
                const distY = pos.top - ctx.event.y
                const absX = Math.abs(distX)
                const absY = Math.abs(distY)

                if (absX !== absY) {
                    if (
                        (ctx.direction.horizontal === true && absX > absY) ||
                        (ctx.direction.vertical === true && absX < absY) ||
                        (ctx.direction.up === true &&
                            absX < absY &&
                            distY < 0) ||
                        (ctx.direction.down === true &&
                            absX < absY &&
                            distY > 0) ||
                        (ctx.direction.left === true &&
                            absX > absY &&
                            distX < 0) ||
                        (ctx.direction.right === true &&
                            absX > absY &&
                            distX > 0)
                    ) {
                        ctx.event.detected = true
                        ctx.move(evt)
                    } else {
                        ctx.end(evt, true)
                    }
                }
            },

            end(evt: MouseEvent, abort?: boolean) {
                if (ctx.event === void 0) {
                    return
                }

                cleanEvt(ctx, 'temp')
                if (abort === true) {
                    if (ctx.styleCleanup !== void 0) {
                        ctx.styleCleanup()
                    }

                    if (
                        ctx.event.detected !== true &&
                        ctx.initialEvent !== void 0
                    ) {
                        ctx.initialEvent.target.dispatchEvent(
                            ctx.initialEvent.event
                        )
                    }
                } else if (ctx.event.detected === true) {
                    if (ctx.event.isFirst === true) {
                        ctx.handler(
                            getChanges(evt === void 0 ? ctx.lastEvt : evt, ctx)
                                .payload
                        )
                    }

                    const { payload } = getChanges(
                        evt === void 0 ? ctx.lastEvt : evt,
                        ctx,
                        true
                    )
                    const fn = () => {
                        ctx.handler(payload)
                    }

                    if (ctx.styleCleanup !== void 0) {
                        ctx.styleCleanup(fn)
                    } else {
                        fn()
                    }
                }

                ctx.event = void 0
                ctx.initialEvent = void 0
                ctx.lastEvt = void 0
            }
        }

        // @ts-ignore
        el.__dl_touchpan = ctx

        if (modifiers.mouse === true) {
            addEvt(ctx, 'main', [
                [
                    el,
                    'mousedown',
                    'mouseStart',
                    `passive${modifiers.mouseCapture === true ? 'Capture' : ''}`
                ]
            ])
        }

        if ('ontouchstart' in window === true) {
            addEvt(ctx, 'main', [
                [
                    el,
                    'touchstart',
                    'touchStart',
                    `passive${modifiers.capture === true ? 'Capture' : ''}`
                ],
                [el, 'touchmove', 'notPassiveCapture']
            ])
        }
    },

    update(el: HTMLElement, { oldValue, value }: any) {
        // @ts-ignore
        const ctx = el.__dl_touchpan
        if (ctx !== void 0 && oldValue !== value) {
            if (typeof value !== 'function') {
                ctx.end()
            }
            ctx.handler = value
        }
    },

    unbind(el: HTMLElement) {
        // @ts-ignore
        if (el.__dl_touchpan_destroyed === void 0) {
            destroy(el)
        } else {
            // @ts-ignore
            delete el.__dl_touchpan_destroyed
        }
    }
}

const touchPanV3 = {
    beforeMount(el: HTMLElement, bindings: any) {
        touchPanV2.bind.apply(this, [el, bindings])
    },

    beforeUpdate(el: HTMLElement, bindings: any) {
        touchPanV2.update.apply(this, [el, bindings])
    },

    unmounted(el: HTMLElement) {
        touchPanV2.unbind.apply(this, [el])
    }
}

export default isVue2 ? touchPanV2 : touchPanV3
