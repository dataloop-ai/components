export function clearSelection() {
    if (window.getSelection !== void 0) {
        const selection = window.getSelection()
        if (!selection) return

        if (selection.empty !== void 0) {
            selection.empty()
        } else if (selection.removeAllRanges !== void 0) {
            selection.removeAllRanges()
            if ('ontouchstart' in window) {
                selection.addRange(document.createRange())
            }
        }
    }
}
