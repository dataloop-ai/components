export function browseNestedNodes(
    element: HTMLElement | null,
    ifCondition: (el: HTMLElement) => boolean,
    thenOperation: (el: HTMLElement) => void,
    elseCondition?: (el: HTMLElement) => boolean,
    elseOperation?: (el: HTMLElement) => void
) {
    if (element && element.nodeType === Node.ELEMENT_NODE) {
        for (let i = element.children.length - 1; i >= 0; i--) {
            const child = element.children[i] as HTMLElement
            browseNestedNodes(
                child,
                ifCondition,
                thenOperation,
                elseCondition,
                elseOperation
            )
        }

        if (ifCondition(element as HTMLElement)) {
            thenOperation(element)
        } else if (elseCondition?.(element as HTMLElement)) {
            elseOperation?.(element)
        }
    }
}
