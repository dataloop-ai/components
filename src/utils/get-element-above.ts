export function getElementAbove(el: HTMLElement, className: string) {
    //@ts-ignore
    for (; el && el !== document; el = el.parentNode) {
        if (el.classList.contains(className)) {
            return el
        }
    }
}
