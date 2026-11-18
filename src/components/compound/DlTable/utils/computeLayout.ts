export type ColumnWidthMode = 'fixed' | 'flex' | 'constrained'

export interface LayoutColumn {
    name: string
    /** consumer width: number (px) or any CSS length */
    width?: number | string
    minWidth?: number
    maxWidth?: number
    /** default 'constrained' */
    widthMode?: ColumnWidthMode
    primary?: boolean
}

export interface LayoutLimits {
    minWidth: number
    /** Infinity for no maximum */
    maxWidth: number
}

export interface LayoutInput {
    columns: LayoutColumn[]
    /** width available to the data columns, in px (0 when unknown) */
    containerWidth: number
    /** measured content width per column name, in px */
    measurements: Record<string, number>
    /** widths set by the user (resize), in px */
    userWidths: Record<string, number>
    limits: LayoutLimits
    /** let the browser share the container between columns (legacy prop) */
    fitAllColumns?: boolean
}

export interface LayoutResult {
    /** px number, raw CSS string, or null to let the browser decide */
    widths: Record<string, number | string | null>
    /** sum of the px widths */
    total: number
}

export function columnLimits(col: LayoutColumn, limits: LayoutLimits) {
    const min = col.minWidth ?? limits.minWidth
    const max = Math.max(col.maxWidth ?? limits.maxWidth, min)
    return { min, max }
}

export const clampWidth = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

function explicitWidth(
    width: number | string | undefined,
    containerWidth: number
): number | string | null {
    if (width === undefined || width === null || width === '') return null
    if (typeof width === 'number') return width
    const trimmed = width.trim()
    if (/^\d+(\.\d+)?(px)?$/.test(trimmed)) return parseFloat(trimmed)
    const percent = /^(\d+(\.\d+)?)%$/.exec(trimmed)
    if (percent && containerWidth > 0) {
        return (parseFloat(percent[1]) / 100) * containerWidth
    }
    return trimmed
}

/**
 * Column widths for a table. Pure: no DOM access.
 *
 * - a user-resized width wins, clamped to the column limits
 * - an explicit `width` is honoured as given (number = px)
 * - otherwise the column starts at its content width, clamped to its limits
 * - spare container space goes to the growable columns (not fixed, not
 *   explicit, not resized) in proportion to their width, up to their maximum;
 *   what is left goes to the last growable column
 * - a `primary` column is never narrower than another growable column when
 *   there is spare space
 */
export function computeLayout(input: LayoutInput): LayoutResult {
    const { columns, containerWidth, measurements, userWidths, limits } = input
    const widths: Record<string, number | string | null> = {}
    const growable: LayoutColumn[] = []

    for (const col of columns) {
        const { min, max } = columnLimits(col, limits)
        const user = userWidths[col.name]
        if (typeof user === 'number' && isFinite(user)) {
            widths[col.name] = clampWidth(user, min, max)
            continue
        }
        const explicit = explicitWidth(col.width, containerWidth)
        if (explicit !== null) {
            widths[col.name] = explicit
            continue
        }
        if (input.fitAllColumns) {
            widths[col.name] = null
            continue
        }
        widths[col.name] = clampWidth(measurements[col.name] || 0, min, max)
        if (col.widthMode !== 'fixed') growable.push(col)
    }

    const sumPx = () =>
        Object.values(widths).reduce<number>(
            (acc, w) => acc + (typeof w === 'number' ? w : 0),
            0
        )

    let spare = containerWidth > 0 ? containerWidth - sumPx() : 0

    if (spare > 0 && growable.length) {
        let open = growable.slice()
        // proportional distribution, redistributing what capped columns refuse
        while (spare > 0.5 && open.length) {
            const weight = open.reduce(
                (acc, col) => acc + (widths[col.name] as number),
                0
            )
            let given = 0
            const stillOpen: LayoutColumn[] = []
            for (const col of open) {
                const { max } = columnLimits(col, limits)
                const current = widths[col.name] as number
                const share =
                    weight > 0
                        ? (spare * current) / weight
                        : spare / open.length
                const next = Math.min(current + share, max)
                given += next - current
                widths[col.name] = next
                if (next < max) stillOpen.push(col)
            }
            spare -= given
            if (given <= 0.5) break
            open = stillOpen
        }
        if (spare > 0.5) {
            const last = growable[growable.length - 1]
            widths[last.name] = (widths[last.name] as number) + spare
        }

        const primary = growable.find((col) => col.primary)
        if (primary) {
            const others = growable.filter((col) => col !== primary)
            const widest = Math.max(
                0,
                ...others.map((col) => widths[col.name] as number)
            )
            const { max } = columnLimits(primary, limits)
            const target = Math.min(widest, max)
            let need = target - (widths[primary.name] as number)
            for (const col of others) {
                if (need <= 0) break
                const { min } = columnLimits(col, limits)
                const base = clampWidth(
                    measurements[col.name] || 0,
                    min,
                    Infinity
                )
                const available = (widths[col.name] as number) - base
                const take = Math.min(available, need)
                if (take > 0) {
                    widths[col.name] = (widths[col.name] as number) - take
                    widths[primary.name] =
                        (widths[primary.name] as number) + take
                    need -= take
                }
            }
        }
    }

    for (const name of Object.keys(widths)) {
        const w = widths[name]
        if (typeof w === 'number') widths[name] = Math.round(w)
    }

    return { widths, total: Math.round(sumPx()) }
}
