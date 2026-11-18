export interface LayoutCssInput {
    /** value of the root `data-dl-table-id` attribute */
    tableId: string
    /** data column widths, by data column index */
    widths: (number | string | null)[]
    /** data column indexes whose width was set by the user (wins over consumer CSS) */
    userSized: Set<number>
    /** sum of px widths; the table never gets narrower than this */
    total: number
    /** widths of the leading utility cells (drag, selection, expand, tree) */
    utilityWidths: number[]
    /** width of the trailing actions / visible-columns cell (0 when absent) */
    actionsWidth: number
    /** number of leading data columns pinned to the start */
    pinnedStart: number
    /** number of trailing data columns pinned to the end */
    pinnedEnd: number
    /** rendered widths by data column index, used for pin offsets of non-px columns */
    renderedWidths: number[]
    fitAllColumns: boolean
    /** data column index whose right edge is under the pointer */
    resizeHover: number | null
    /** data column index being resized */
    resizing: number | null
}

const px = (n: number) => `${Math.round(n)}px`

/**
 * Generated per-table stylesheet. One element per table instead of inline
 * styles on every cell: survives re-renders, applies to rows mounted later
 * (virtual scroll, tree children) and keeps consumer CSS in charge unless the
 * user resized the column.
 */
export function buildLayoutCss(input: LayoutCssInput): string {
    const root = `[data-dl-table-id="${input.tableId}"]`
    const cell = (i: number) =>
        `${root} th[data-col-index="${i}"],${root} td[data-col-index="${i}"]`
    const rules: string[] = []

    input.widths.forEach((width, i) => {
        if (width === null || width === undefined) return
        const value = typeof width === 'number' ? px(width) : width
        const important = input.userSized.has(i) ? ' !important' : ''
        rules.push(
            `${cell(
                i
            )}{width:${value}${important};max-width:${value}${important}}`
        )
    })

    if (input.total > 0) {
        rules.push(
            `${root} .dl-table__middle>table.dl-table{width:max(100%, ${px(
                input.total
            )});max-width:none}`
        )
    }

    if (input.fitAllColumns) {
        rules.push(`${root} th .inner-th{max-width:80%}`)
    }

    const widthOf = (i: number) =>
        typeof input.widths[i] === 'number'
            ? (input.widths[i] as number)
            : input.renderedWidths[i] || 0

    const sticky = (selector: string, side: 'left' | 'right', offset: number) =>
        `${selector}{position:sticky;${side}:${px(offset)}}`
    const headSticky = `z-index:101`
    const bodySticky = `z-index:50`

    const utilityCount = input.utilityWidths.length
    const dataCount = input.widths.length
    const pinnedStart = Math.min(input.pinnedStart, dataCount)
    const pinnedEnd = Math.min(input.pinnedEnd, dataCount - pinnedStart)

    if (pinnedStart > 0) {
        let offset = 0
        for (let k = 0; k < utilityCount; k++) {
            const selector = `${root} tr.dl-tr>:nth-child(${k + 1})`
            rules.push(sticky(selector, 'left', offset))
            rules.push(
                `${root} thead tr.dl-tr>:nth-child(${k + 1}){${headSticky}}`
            )
            rules.push(
                `${root} tbody tr.dl-tr>:nth-child(${
                    k + 1
                }){${bodySticky};background-color:var(--dl-table-pinned-background, var(--dell-white))}`
            )
            offset += input.utilityWidths[k]
        }
        for (let i = 0; i < pinnedStart; i++) {
            rules.push(sticky(cell(i), 'left', offset))
            rules.push(`${root} th[data-col-index="${i}"]{${headSticky}}`)
            rules.push(`${root} td[data-col-index="${i}"]{${bodySticky}}`)
            offset += widthOf(i)
        }
        rules.push(
            `${root}.dl-table--scrolled-start th[data-col-index="${
                pinnedStart - 1
            }"],${root}.dl-table--scrolled-start td[data-col-index="${
                pinnedStart - 1
            }"]{box-shadow:var(--dl-table-pinned-shadow-start, 4px 0 4px -2px rgba(16, 30, 115, 0.15))}`
        )
    }

    if (pinnedEnd > 0) {
        let offset = input.actionsWidth
        for (let i = dataCount - 1; i >= dataCount - pinnedEnd; i--) {
            rules.push(sticky(cell(i), 'right', offset))
            rules.push(`${root} th[data-col-index="${i}"]{${headSticky}}`)
            rules.push(`${root} td[data-col-index="${i}"]{${bodySticky}}`)
            offset += widthOf(i)
        }
        const first = dataCount - pinnedEnd
        rules.push(
            `${root}.dl-table--scrolled-end th[data-col-index="${first}"],${root}.dl-table--scrolled-end td[data-col-index="${first}"]{box-shadow:var(--dl-table-pinned-shadow-end, -4px 0 4px -2px rgba(16, 30, 115, 0.15))}`
        )
    }

    if (input.resizeHover !== null && input.resizing === null) {
        rules.push(`${root} thead th{cursor:col-resize !important}`)
        rules.push(
            `${root} th[data-col-index="${input.resizeHover}"]{box-shadow:inset -2px 0 0 var(--dl-table-resize-hover-color, var(--dell-gray-300))}`
        )
    }

    if (input.resizing !== null) {
        rules.push(
            `${root},${root} *{cursor:col-resize !important;user-select:none}`
        )
        rules.push(
            `${cell(
                input.resizing
            )}{box-shadow:inset -1px 0 0 var(--dl-table-resize-guide-color, var(--dell-blue-500))}`
        )
    }

    return rules.join('\n')
}
