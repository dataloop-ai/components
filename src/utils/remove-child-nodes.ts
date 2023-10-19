export function removeAllChildNodes(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}
