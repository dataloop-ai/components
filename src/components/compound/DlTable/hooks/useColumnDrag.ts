import { ComputedRef, onBeforeUnmount, ref } from 'vue-demi'
import { DlTableColumn } from '../types'
import { getTreeTableColumn } from '../../../../utils/table-columns'
import { removeAllChildNodes } from '../../../../utils/remove-child-nodes'

/** pointer travel before a press on a header becomes a column drag (px) */
const DRAG_THRESHOLD = 5

export interface ColumnDragOptions {
    enabled: () => boolean
    /** visible data columns in render order */
    columns: ComputedRef<DlTableColumn[]>
    getTable: () => HTMLTableElement | null
    getCloneHost: () => HTMLElement | null
    /** names of the visible columns in their new order */
    onDrop: (order: string[]) => void
    setDragging: (value: boolean) => void
    /** true while a click should not be treated as a header click */
    setClickSuppressed: (value: boolean) => void
}

export function moveName(order: string[], source: string, target: string) {
    const from = order.indexOf(source)
    const to = order.indexOf(target)
    if (from === -1 || to === -1 || from === to) return order
    const next = order.slice()
    next.splice(from, 1)
    next.splice(to, 0, source)
    return next
}

export function useColumnDrag(options: ColumnDragOptions) {
    /** preview order while dragging (visible column names) */
    const previewOrder = ref<string[] | null>(null)
    const draggingName = ref<string | null>(null)

    let pressed: { name: string; x: number; y: number; th: HTMLElement } = null
    let captureEl: HTMLElement = null
    let pointerId: number = null

    const cloneHost = () => options.getCloneHost()

    function start(evt: PointerEvent) {
        const { th, name } = pressed
        try {
            captureEl?.setPointerCapture?.(pointerId)
        } catch (e) {
            // pointer already gone
        }
        draggingName.value = name
        previewOrder.value = options.columns.value.map((col) => col.name)
        options.setDragging(true)
        options.setClickSuppressed(true)
        const host = cloneHost()
        const table = options.getTable()
        if (host && table) {
            removeAllChildNodes(host)
            const index = Array.from(th.parentElement.children).indexOf(th)
            host.appendChild(getTreeTableColumn(table, index))
        }
        moveClone(evt)
    }

    function moveClone(evt: PointerEvent) {
        const host = cloneHost()
        if (!host) return
        host.style.top = `${evt.clientY + 20}px`
        host.style.left = `${
            evt.clientX - host.getBoundingClientRect().width / 2
        }px`
    }

    /** returns true when the press may become a drag */
    function onPointerDown(evt: PointerEvent): boolean {
        if (!options.enabled()) return false
        if (evt.button !== undefined && evt.button !== 0) return false
        const target = evt.target as HTMLElement
        // keep buttons, inputs and the visible-columns menu usable
        if (target.closest?.('button, input, a, [role="menu"]')) return false
        const th = target.closest?.('th[data-col-index]') as HTMLElement
        if (!th) return false
        const col = options.columns.value[Number(th.dataset.colIndex)]
        if (!col) return false
        pressed = { name: col.name, x: evt.clientX, y: evt.clientY, th }
        // capture only once the drag starts: capturing a plain click would
        // retarget it to <thead> and the header would not sort
        captureEl = evt.currentTarget as HTMLElement
        pointerId = evt.pointerId
        return true
    }

    /** returns true when the event was used by a drag */
    function onPointerMove(evt: PointerEvent): boolean {
        if (!pressed) return false
        if (!draggingName.value) {
            const distance = Math.hypot(
                evt.clientX - pressed.x,
                evt.clientY - pressed.y
            )
            if (distance < DRAG_THRESHOLD) return true
            start(evt)
        }
        moveClone(evt)
        const table = options.getTable()
        const under = document.elementFromPoint?.(evt.clientX, evt.clientY)
        const th = under?.closest?.('th[data-col-index]') as HTMLElement
        if (th && table && table.contains(th)) {
            const col = options.columns.value[Number(th.dataset.colIndex)]
            if (col && col.name !== draggingName.value) {
                previewOrder.value = moveName(
                    previewOrder.value,
                    draggingName.value,
                    col.name
                )
            }
        }
        return true
    }

    function finish(commit: boolean) {
        const order = previewOrder.value
        const wasDragging = !!draggingName.value
        if (wasDragging) {
            try {
                captureEl?.releasePointerCapture?.(pointerId)
            } catch (e) {
                // already released
            }
        }
        captureEl = null
        pressed = null
        draggingName.value = null
        previewOrder.value = null
        const host = cloneHost()
        if (host) removeAllChildNodes(host)
        if (!wasDragging) return
        options.setDragging(false)
        if (commit && order) options.onDrop(order)
        setTimeout(() => options.setClickSuppressed(false), 200)
    }

    function onPointerUp() {
        if (pressed) finish(true)
    }

    function onPointerCancel() {
        if (pressed) finish(false)
    }

    onBeforeUnmount(() => {
        if (pressed) finish(false)
    })

    return {
        previewOrder,
        draggingName,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel
    }
}
