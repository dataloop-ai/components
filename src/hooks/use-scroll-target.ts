import { ref, watch, onBeforeUnmount } from 'vue-demi'

import { listenOpts } from '../utils/events'

export default function (props: any, configureScrollTarget: Function) {
    const localScrollTarget = ref(null)

    let scrollFn: Function | undefined

    function changeScrollEvent(scrollTarget: any, fn: Function = () => {}) {
        const fnProp: string = `${fn ? 'add' : 'remove'}EventListener`
        const fnHandler = fn ? fn : scrollFn

        if (scrollTarget !== window) {
            scrollTarget[fnProp]('scroll', fnHandler, listenOpts.passive)
        }

        (window as { [key: string]: any })[fnProp](
            'scroll',
            fnHandler,
            listenOpts.passive
        )

        scrollFn = fn
    }

    function unconfigureScrollTarget() {
        if (localScrollTarget.value !== null) {
            changeScrollEvent(localScrollTarget.value as any)
            localScrollTarget.value = null
        }
    }

    const noParentEventWatcher = watch(
        () => props.noParentEvent,
        () => {
            if (localScrollTarget.value !== null) {
                unconfigureScrollTarget()
                configureScrollTarget()
            }
        }
    )

    onBeforeUnmount(noParentEventWatcher)

    return {
        localScrollTarget,
        unconfigureScrollTarget,
        changeScrollEvent
    }
}
