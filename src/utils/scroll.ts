import { css, getElement } from './dom'

const scrollTargets = [
    null,
    document,
    document.body,
    document.scrollingElement,
    document.documentElement
]

export function getScrollTarget(
    el: HTMLElement | Element,
    targetEl: string | Element
) {
    let target = getElement(targetEl)

    if (target === void 0) {
        if (el === void 0 || el === null) {
            return window
        }

        target = el.closest('.scroll,.scroll-y,.overflow-auto')
    }

    return scrollTargets.includes(target) ? window : target
}

export const getScrollWidth = (el: HTMLElement | Window) => {
    return (
        el === window ? (document.body as HTMLElement) : (el as HTMLElement)
    ).scrollWidth
}

let size: number | undefined
export const getScrollbarWidth = () => {
    if (size !== undefined) {
        return size
    }

    const inner = document.createElement('p')
    const outer = document.createElement('div')

    css(inner, {
        width: '100%',
        height: '200px'
    })
    css(outer, {
        position: 'absolute',
        top: '0px',
        left: '0px',
        visibility: 'hidden',
        width: '200px',
        height: '150px',
        overflow: 'hidden'
    })

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const w1 = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let w2 = inner.offsetWidth

    if (w1 === w2) {
        w2 = outer.clientWidth
    }

    outer.remove()
    size = w1 - w2

    return size
}
