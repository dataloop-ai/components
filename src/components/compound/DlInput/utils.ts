import {
    getInnerText,
    getSelectionOffset,
    setSelectionOffset
} from '../../../utils'
import { InputSuggestion } from './types'

export function addEventListenersToElement(
    element: HTMLElement,
    eventHandlers: Record<string, (e: any) => void>
) {
    for (const eventType in eventHandlers) {
        const handler = eventHandlers[eventType]
        element.addEventListener(eventType, handler)
    }
}

export function clearSuggestion(text: string, suggestion: string) {
    return text.split(' ').slice(0, -1).join(' ') + ' ' + suggestion
}

export function setInnerHTMLWithCursor(
    inputEl: HTMLElement,
    action: (str: string) => void
) {
    const [start, end] = getSelectionOffset(inputEl)
    const textBefore = getInnerText(inputEl)
    action(textBefore)
    setSelectionOffset(inputEl, start, end)
}

export function getSuggestItems(suggestions: InputSuggestion[], text: string) {
    if (!text.trim()) {
        return suggestions
    }
    const lastKeyword = text.toLowerCase().split(' ').at(-1)
    return suggestions.filter((item) => {
        const lowercasedSuggestion = item.suggestion.toLowerCase()
        return (
            lowercasedSuggestion !== lastKeyword &&
            lowercasedSuggestion.includes(lastKeyword)
        )
    })
}

export async function readClipboard(): Promise<{ type: string; data: any }[]> {
    return navigator.clipboard
        .read()
        .then((items: ClipboardItem[]) => {
            const promises: Promise<{ type: string; data: any }>[] = []

            items.forEach((item) => {
                item.types.forEach((type) => {
                    promises.push(
                        item.getType(type).then((data) => ({ type, data }))
                    )
                })
            })

            return Promise.all(promises)
        })
        .catch((error) => {
            return []
        })
}

export function readBlob(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            const result = reader.result as ArrayBuffer
            resolve(result)
        }

        reader.onerror = () => {
            reject(new Error('Error reading Blob'))
        }

        reader.readAsArrayBuffer(blob)
    })
}

export function isArrayBufferImage(arrayBuffer: ArrayBuffer): boolean {
    const view = new DataView(arrayBuffer)

    if (
        view.getUint8(0) === 0xff &&
        view.getUint8(1) === 0xd8 &&
        view.getUint8(2) === 0xff
    ) {
        return true
    }

    if (
        view.getUint8(0) === 0x89 &&
        view.getUint8(1) === 0x50 &&
        view.getUint8(2) === 0x4e &&
        view.getUint8(3) === 0x47 &&
        view.getUint8(4) === 0x0d &&
        view.getUint8(5) === 0x0a &&
        view.getUint8(6) === 0x1a &&
        view.getUint8(7) === 0x0a
    ) {
        return true
    }

    return false
}
