const Environment = require('jest-environment-jsdom')

/* eslint-disable no-undef */
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}))

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
    range.getBoundingClientRect = jest.fn(() => ({
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
            [Symbol.iterator]: jest.fn()
        }
    }
    range.startContainer.getBoundingClientRect = jest.fn()
    return range
}

module.exports = class CustomTestEnvironment extends Environment {
    async setup() {
        await super.setup()
        if (typeof this.global.TextEncoder === 'undefined') {
            const { TextEncoder, TextDecoder } = require('util')
            this.global.TextEncoder = TextEncoder
            this.global.TextDecoder = TextDecoder
            this.global.ArrayBuffer = ArrayBuffer
            this.global.Uint8Array = Uint8Array
        }
    }
}
