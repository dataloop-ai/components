import { AnchorEvent } from '../../../hooks/use-model-toggle'
import { position, stopAndPrevent } from '../../../utils/events'
import { parsePosition } from '../../../utils/position-engine'
import { Ref } from 'vue-demi'
import { addEscapeKey, removeEscapeKey } from '../../../utils/escape-key'
import {
    addClickOutside,
    removeClickOutside,
    ClickOutsideEvent
} from '../../../utils/click-outside'
import { isNumber } from 'lodash'

interface ClickOutsideProps {
    persistent: boolean
    showing: boolean
    fn: Function
}

interface OffsetOnShowProps {
    contextMenu: boolean
    touchPosition: boolean
    anchorEl: Ref<Element | HTMLElement | null>
    absoluteOffset: Record<any, any> | undefined
}

export const handleClickOutside = (
    e: AnchorEvent,
    { persistent, showing, fn }: ClickOutsideProps
) => {
    if (!persistent && showing) {
        fn(e)

        if (
            // always prevent touch event
            e.type === 'touchstart' ||
            // prevent click if it's on a dialog backdrop
            (e.target as HTMLElement).classList.contains('dl-dialog__backdrop')
        ) {
            stopAndPrevent(e)
        }

        return true
    }
}

export const getAnchorOrigin = (anchor: string, cover: boolean) =>
    parsePosition(anchor || (cover ? 'center middle' : 'bottom start'))

export const handleWatcherEvents = (
    val: boolean,
    escapeFn: Function,
    props: any
) => {
    if (val) {
        addEscapeKey(escapeFn)
        addClickOutside(props)
    } else {
        removeEscapeKey(escapeFn)
        removeClickOutside(props)
    }
}
export const setOffsetOnShow = (
    evt: TouchEvent,
    { contextMenu, touchPosition, anchorEl, absoluteOffset }: OffsetOnShowProps
) => {
    if (evt && (touchPosition || contextMenu)) {
        const pos = position(evt)

        if (isNumber(pos.top) && isNumber(pos.left) && anchorEl.value) {
            const { top, left } = anchorEl.value.getBoundingClientRect()
            if (isNumber(top) && isNumber(left)) {
                return {
                    left: pos.left - left,
                    top: pos.top - top
                }
            }
        }
    }
    return absoluteOffset
}

export const avoidAutoCloseFn = (
    isIOS: boolean,
    data: {
        avoidAutoClose: boolean
        autoClose: boolean
        innerRef: Ref<HTMLElement | null>
    }
) => {
    if (isIOS) {
        // if auto-close, then this click should
        // not close the menu
        data.innerRef.value?.click()
        return data.autoClose
    }

    return data.avoidAutoClose
}

export const updateUnwatchPosition = (
    unwatchPosition: Function | undefined
): undefined => {
    if (unwatchPosition) {
        unwatchPosition()
    }

    return null
}

export const refocusTargetFn = (
    evt: ClickOutsideEvent,
    refocusTarget: HTMLElement | null
): null => {
    if (!evt) {
        return null
    }
    if (
        refocusTarget !== null &&
        // menu was hidden from code or ESC plugin
        (evt ||
            // menu was not closed from a mouse or touch clickOutside
            evt?.dlClickOutside !== true)
    ) {
        (refocusTarget as HTMLElement).focus()
    }

    return null
}

export const conditionalHandler = (
    condition: boolean,
    fn: Function,
    returnCondition?: boolean
) => {
    if (condition) {
        fn()
    }

    if (returnCondition) {
        return condition as boolean
    }
}
