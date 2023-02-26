export function getTargetWidget(el: HTMLElement) {
    //@ts-ignore
    for (; el && el !== document; el = el.parentNode) {
        if (el.classList.contains('dl-widget-grid__item')) {
            return el
        }
    }
}

export function equateElements(
    sourceElement: HTMLElement,
    targetElement: HTMLElement
) {
    targetElement.innerHTML = sourceElement.innerHTML
    targetElement.style.width = `${sourceElement.offsetWidth}px`
    targetElement.style.height = `${sourceElement.offsetHeight}px`
    targetElement.style.top = `${
        sourceElement.getBoundingClientRect().y + 20
    }px`
    targetElement.style.left = `${
        sourceElement.getBoundingClientRect().x - 10
    }px`
}

export function getIndex(id: string) {
    return {
        row: Number(id[0]),
        column: Number(id[2])
    }
}
