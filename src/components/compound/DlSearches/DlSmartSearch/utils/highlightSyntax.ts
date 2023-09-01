import { SyntaxColorSchema } from '../types'

const SPAN_STYLES = `overflow: hidden;
                     text-overflow: ellipsis;
                     display: inline-block;
                     max-width: 100%`

let editor = document.getElementById('editor')
let styleModel: SyntaxColorSchema

function getTextSegments(element: HTMLElement) {
    if (!element) return
    const textSegments: { text: string; node: Node }[] = []
    Array.from(element.childNodes).forEach((node: Node) => {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({ text: node.nodeValue, node })
                break

            case Node.ELEMENT_NODE:
                textSegments.splice(
                    textSegments.length,
                    0,
                    ...getTextSegments(node as HTMLElement)
                )
                break

            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`)
        }
    })
    return textSegments
}

export function updateEditor(model: SyntaxColorSchema) {
    styleModel = model
    editor = document.getElementById('editor')
    if (!editor) return
    const sel = window.getSelection()
    const textSegments = getTextSegments(editor)
    const textContent = textSegments?.map(({ text }) => text).join('')
    let anchorIndex = null
    let focusIndex = null
    let currentIndex = 0
    textSegments?.forEach(({ text, node }) => {
        if (node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset
        }
        if (node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset
        }
        currentIndex += text.length
    })

    editor.innerHTML = renderText(textContent)

    restoreSelection(anchorIndex, focusIndex)
}

function restoreSelection(
    absoluteAnchorIndex: number,
    absoluteFocusIndex: number
) {
    const sel = window.getSelection()
    const textSegments = getTextSegments(editor)
    let anchorNode: Node = editor
    let anchorIndex = 0
    let focusNode: Node = editor
    let focusIndex = 0
    let currentIndex = 0
    textSegments.forEach(({ text, node }) => {
        const startIndexOfNode = currentIndex
        const endIndexOfNode = startIndexOfNode + text.length
        if (
            startIndexOfNode <= absoluteAnchorIndex &&
            absoluteAnchorIndex <= endIndexOfNode
        ) {
            anchorNode = node
            anchorIndex = absoluteAnchorIndex - startIndexOfNode
        }
        if (
            startIndexOfNode <= absoluteFocusIndex &&
            absoluteFocusIndex <= endIndexOfNode
        ) {
            focusNode = node
            focusIndex = absoluteFocusIndex - startIndexOfNode
        }
        currentIndex += text.length
    })

    sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex)
}

function renderText(text: string) {
    const words = text?.split(/(\s+)/)
    const output = words?.map((word) => {
        if (styleModel) {
            if (styleModel.keywords.values.includes(word)) {
                return `<strong style='${SPAN_STYLES}; color:${styleModel.keywords.color}'>${word}</strong>`
            } else if (styleModel.fields.values.includes(word)) {
                return `<span style='color:${styleModel.fields.color}; ${SPAN_STYLES}'>${word}</span>`
            } else if (styleModel.operators.values.includes(word)) {
                return `<span style='color:${styleModel.operators.color}; ${SPAN_STYLES}'>${word}</span>`
            } else {
                return `<span style='${SPAN_STYLES}'>${word}</span>`
            }
        } else {
            return `<span style='${SPAN_STYLES}'>${word}</span>`
        }
    })
    return output?.join('')
}
