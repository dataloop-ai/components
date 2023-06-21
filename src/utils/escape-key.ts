import { isMobileOrTablet } from './index'
import { isKeyCode } from '../utils/key-composition'

const handlers: Function[] = []
let escDown: boolean

function onKeydown(evt: KeyboardEvent) {
    escDown = evt.keyCode === 27
}

function onBlur() {
    if (escDown === true) {
        escDown = false
    }
}

function onKeyup(evt: KeyboardEvent) {
    if (escDown === true) {
        escDown = false

        if (isKeyCode(evt, 27) === true) {
            handlers[handlers.length - 1](evt)
        }
    }
}

function update(action: string) {
    (window as { [key: string]: any })[action]('keydown', onKeydown)
    ;(window as { [key: string]: any })[action]('blur', onBlur)
    ;(window as { [key: string]: any })[action]('keyup', onKeyup)
    escDown = false
}

export function addEscapeKey(fn: Function) {
    const isMobile = isMobileOrTablet()
    if (!isMobile) {
        handlers.push(fn)

        if (handlers.length === 1) {
            update('addEventListener')
        }
    }
}

export function removeEscapeKey(fn: Function) {
    const index = handlers.indexOf(fn)
    if (index > -1) {
        handlers.splice(index, 1)

        if (handlers.length === 0) {
            update('removeEventListener')
        }
    }
}
