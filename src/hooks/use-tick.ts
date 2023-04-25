import { nextTick, onBeforeUnmount } from 'vue-demi'

/**
 * @description a tick hook that allows you to register a function to be called on the next tick or on the next animation frame.
 * @returns {Object} registerTick, removeTick
 */
export default function () {
    let tickFn: Function | null = null
    let animationFrameId: number | null = null

    onBeforeUnmount(() => {
        removeTick()
    })

    const registerTick = (
        fn: Function,
        options: { continuous?: boolean } = {}
    ) => {
        tickFn = fn

        const { continuous } = options

        if (continuous) {
            animationFrameId = requestAnimationFrame(() => {
                if (tickFn === fn) {
                    tickFn()
                    registerTick(fn, { continuous })
                }
            })
        } else {
            nextTick(() => {
                if (tickFn === fn) {
                    tickFn()
                    tickFn = null
                }
            })
        }
    }

    const removeTick = () => {
        tickFn = null
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
        }
        animationFrameId = null
    }

    return {
        registerTick,
        removeTick
    }
}
