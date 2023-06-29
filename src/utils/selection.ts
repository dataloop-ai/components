export function clearSelection() {
    if (window.getSelection) {
        const selection = window.getSelection()
        if (!selection) return

        if (selection.empty) {
            selection.empty()
        } else if (selection.removeAllRanges) {
            selection.removeAllRanges()
            if ('ontouchstart' in window) {
                selection.addRange(document.createRange())
            }
        }
    }
}
