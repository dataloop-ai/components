export function getElementAbove(el: HTMLElement, className: string) {
    //@ts-ignore
    for (; el && el !== document; el = el.parentNode) {
        if (el.classList.contains(className)) {
            return el
        }
    }
}

export function addMouseEnter(className: string, method: EventListenerObject) {
    Array.from(document.getElementsByClassName(className)).forEach((widget) => {
        widget.addEventListener('mouseenter', method)
    })
}

export function removeMouseEnter(
    className: string,
    method: EventListenerObject
) {
    Array.from(document.getElementsByClassName(className)).forEach((widget) => {
        widget.removeEventListener('mouseenter', method)
    })
}

export function setFlexBasis() {
    Array.from(document.getElementsByClassName('dl-grid-row')).forEach(
        (row) => {
            Array.from(row.children).forEach((widget: any) => {
                widget.style.flexBasis = `${100 / row.children.length}%`
            })
        }
    )
}

export function insertAfter(newNode: HTMLElement, existingNode: HTMLElement) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}
