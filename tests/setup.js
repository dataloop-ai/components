/* eslint-disable */
import 'vitest-canvas-mock'
import { vi } from 'vitest'

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver

class MutationObserver {
    disconnect() {}
    unobserve() {}
    observe() {}
}

window.MutationObserver = MutationObserver

Element.prototype.scrollTo = () => {}

if (typeof String.prototype.replaceAll === 'undefined') {
    String.prototype.replaceAll = function (match, replace) {
        return this.replace(new RegExp(match, 'g'), () => replace)
    }
}

const delay = (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(null), delay)
    })
}

global.delay = delay
window.delay = delay

document.createRange = () => {
    const range = new Range()
    range.getBoundingClientRect = vi.fn(() => ({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }))
    range.getClientRects = () => {
        return {
            item: () => null,
            length: 0,
            [Symbol.iterator]: vi.fn()
        }
    }
    range.startContainer.getBoundingClientRect = vi.fn()
    return range
}
