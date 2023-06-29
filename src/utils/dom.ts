import { isRef, Ref } from 'vue-demi'

export function css(element: HTMLElement, css: Record<string, string>) {
    const style = element.style

    for (const prop in css) {
        style[prop as unknown as number] = css[prop]
    }
}

// internal
export function getElement(
    el: HTMLElement | Ref<HTMLElement> | Element | null | string
) {
    if (!el) {
        return null
    }

    if (typeof el === 'string') {
        try {
            return document.querySelector(el) || null
        } catch (err) {
            return null
        }
    }

    const target = isRef(el) === true ? (el as Ref<HTMLElement>).value : el

    if (target) {
        return (target as any).$el || target
    }
}

// internal
export function childHasFocus(el: HTMLElement, focusedEl: Node) {
    if (!el || el.contains(focusedEl) === true) {
        return true
    }

    for (
        let next = el.nextElementSibling;
        next !== null;
        next = next.nextElementSibling
    ) {
        if (next.contains(focusedEl)) {
            return true
        }
    }

    return false
}

export default {
    css
}
