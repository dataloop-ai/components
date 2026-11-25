import { RESIZE_KEY_STEP, RESIZE_KEY_STEP_LARGE } from './useColumnLayout'

const ROVING = 'dlRoving'

export interface GridNavigationOptions {
    enabled: () => boolean
    getTable: () => HTMLTableElement | null
    /** Space on a body row */
    onToggleRow?: (tr: HTMLTableRowElement) => void
    /** Alt+Left/Right on a data header: resize column `index` by `delta` px */
    onResizeKey?: (index: number, delta: number) => void
}

const isCell = (el: Element) =>
    el && (el.tagName === 'TD' || el.tagName === 'TH')

/**
 * A11Y-02: arrow-key navigation between cells with a roving tabindex.
 * Native table roles are kept. Keys are only handled when the focus is on the
 * cell itself, never inside an input, button, select or editor in the cell.
 */
export function useGridNavigation(options: GridNavigationOptions) {
    const rows = (table: HTMLTableElement) =>
        Array.from(
            table.querySelectorAll(
                ':scope > thead > tr.dl-tr, :scope > tbody.dl-virtual-scroll__content > tr.dl-tr'
            )
        ) as HTMLTableRowElement[]

    const cellsOf = (tr: HTMLTableRowElement) =>
        (Array.from(tr.children) as HTMLElement[]).filter(isCell)

    function moveTo(from: HTMLElement, to: HTMLElement) {
        if (!to || to === from) return
        if (from.dataset[ROVING]) {
            from.tabIndex = -1
        }
        to.dataset[ROVING] = '1'
        to.tabIndex = 0
        to.focus()
    }

    /** makes the first body cell reachable with Tab */
    function ensureEntryPoint() {
        const table = options.getTable()
        if (!table || !options.enabled()) return
        if (table.querySelector(`[data-dl-roving][tabindex="0"]`)) return
        const first = table.querySelector(
            ':scope > tbody.dl-virtual-scroll__content > tr.dl-tr > td[data-col-index]'
        ) as HTMLElement
        if (first) {
            first.dataset[ROVING] = '1'
            first.tabIndex = 0
        }
    }

    function onKeydown(evt: KeyboardEvent) {
        if (!options.enabled()) return
        const cell = evt.target as HTMLElement
        // guard: widgets inside a cell keep their own keys
        if (!isCell(cell)) return
        const table = options.getTable()
        if (!table || !table.contains(cell)) return
        const tr = cell.parentElement as HTMLTableRowElement
        const cells = cellsOf(tr)
        const col = cells.indexOf(cell)
        const allRows = rows(table)
        const rowIndex = allRows.indexOf(tr)

        if (
            evt.altKey &&
            cell.tagName === 'TH' &&
            cell.dataset.colIndex !== undefined &&
            (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight')
        ) {
            const step = evt.shiftKey ? RESIZE_KEY_STEP_LARGE : RESIZE_KEY_STEP
            options.onResizeKey?.(
                Number(cell.dataset.colIndex),
                evt.key === 'ArrowLeft' ? -step : step
            )
            evt.preventDefault()
            return
        }

        let target: HTMLElement = null
        switch (evt.key) {
            case 'ArrowRight':
                target = cells[col + 1]
                break
            case 'ArrowLeft':
                target = cells[col - 1]
                break
            case 'ArrowDown':
            case 'ArrowUp': {
                const next =
                    allRows[rowIndex + (evt.key === 'ArrowDown' ? 1 : -1)]
                if (next) {
                    const nextCells = cellsOf(next)
                    target = nextCells[Math.min(col, nextCells.length - 1)]
                }
                break
            }
            case 'Home':
                target = evt.ctrlKey ? cellsOf(allRows[0])[0] : cells[0]
                break
            case 'End':
                target = evt.ctrlKey
                    ? cellsOf(allRows[allRows.length - 1]).slice(-1)[0]
                    : cells[cells.length - 1]
                break
            case ' ':
                if (tr.parentElement?.tagName === 'TBODY') {
                    options.onToggleRow?.(tr)
                    evt.preventDefault()
                }
                return
            default:
                return
        }
        if (target) {
            evt.preventDefault()
            moveTo(cell, target)
        }
    }

    return { onKeydown, ensureEntryPoint }
}
