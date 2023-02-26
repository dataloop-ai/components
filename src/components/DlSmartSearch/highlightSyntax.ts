import { operators } from '../../hooks/use-suggestions'
import { ColorSchema } from './types'
import { Alias } from '../../hooks/use-suggestions'
import { SyntaxColorSchema } from './types'

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
        if (styleModel.keywords.values.includes(word)) {
            return `<strong>${word}</strong>`
        } else if (styleModel.fields.values.includes(word)) {
            return `<span style='color:${styleModel.fields.color}'>${word}</span>`
        } else if (styleModel.operators.values.includes(word)) {
            return `<span style='color:${styleModel.operators.color}'>${word}</span>`
        } else {
            return `<span>${word}</span>`
        }
    })
    return output?.join('')
}

export function setCaret(target: HTMLElement) {
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(target)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
    target.focus()
}

export const isEligibleToChange = (target: HTMLElement, expanded: boolean) => {
    let childOffsetRight = 0
    let childOffsetBottom = 20

    if (target?.lastChild) {
        const range = document.createRange()
        range.selectNode(target?.lastChild)
        childOffsetRight =
            range.getBoundingClientRect().right -
            target.getBoundingClientRect().left
        childOffsetBottom =
            range.getBoundingClientRect().bottom -
            target.getBoundingClientRect().top +
            5
    }

    if (childOffsetRight <= target.clientWidth) {
        return [-childOffsetRight, 5]
    } else {
        return [-target.clientWidth, 5]
    }
}

export function createColorSchema(
    colorSchema: ColorSchema,
    aliases: Alias[]
): SyntaxColorSchema {
    const thisFields = []
    for (const key in aliases) {
        thisFields.push(aliases[key].alias)
    }

    const thisOperators = []
    for (const key in operators) {
        thisOperators.push(operators[key])
    }

    return {
        fields: {
            values: thisFields,
            color: colorSchema.fields
        },
        operators: {
            values: thisOperators,
            color: colorSchema.operators
        },
        keywords: {
            values: ['OR', 'AND'],
            color: colorSchema.keywords
        }
    }
}
