import { isMobileOrTablet } from './index'

const handlers: Function[] = []

function trigger(e: Event) {
    handlers[handlers.length - 1](e)
}

export function addFocusout(fn: Function) {
    const isMobile = isMobileOrTablet()
    if (!isMobile) {
        handlers.push(fn)

        if (handlers.length === 1) {
            document.body.addEventListener('focusin', trigger)
        }
    }
}

export function removeFocusout(fn: Function) {
    const index = handlers.indexOf(fn)
    if (index > -1) {
        handlers.splice(index, 1)

        if (handlers.length === 0) {
            document.body.removeEventListener('focusin', trigger)
        }
    }
}
