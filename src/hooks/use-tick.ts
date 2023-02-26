import { nextTick, onBeforeUnmount } from 'vue-demi'

/*
 * Usage:
 *    registerTick(fn)
 *    registerTick(fn)
 */

export default function () {
    let tickFn: Function | undefined

    onBeforeUnmount(() => {
        tickFn = void 0
    })

    return {
        registerTick(fn: Function) {
            tickFn = fn

            nextTick(() => {
                if (tickFn === fn) {
                    tickFn()
                    tickFn = void 0
                }
            })
        },

        removeTick() {
            tickFn = void 0
        }
    }
}
