import {
    computed,
    ComputedRef,
    del,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    set,
    watch
} from 'vue-demi'
import { DlTableColumn, TableStickyPosition } from '../types'
import { clampWidth, columnLimits, computeLayout } from '../utils/computeLayout'
import { buildLayoutCss } from '../utils/layoutCss'

/** pointer distance from a header boundary that grabs the resize handle (px) */
const RESIZE_SENSITIVITY_OFFSET = 5
/** extra header room for padding and icons, as the previous sizing did (px) */
const HEADER_EXTRA_WIDTH = 35
/** rendered rows read when measuring content widths */
const MEASURE_SAMPLE_ROWS = 20
/** keyboard resize steps (px), from the DlTable requirements (RESIZE-03) */
export const RESIZE_KEY_STEP = 8
export const RESIZE_KEY_STEP_LARGE = 32

export interface ColumnLayoutOptions {
    tableId: string
    props: {
        resizable: boolean
        stickyColumns: TableStickyPosition
        fitAllColumns: boolean
        isTreeTable: boolean
        columnMinWidth: number
        columnMaxWidth: number
    }
    /** visible data columns, in render order */
    columns: ComputedRef<DlTableColumn[]>
    /** element whose width is shared by the columns and that scrolls horizontally */
    getScrollContainer: () => HTMLElement | null
    getTable: () => HTMLTableElement | null
    /** user finished resizing: name -> width (px) */
    onResizeEnd: (widths: Record<string, number>) => void
    /** true while a click should not be treated as a header click */
    setResizingInProgress: (value: boolean) => void
}

const getIconWidth = (el: HTMLElement) => {
    const iconEl = el.querySelector('.th-icons')
    const sortEl = el.querySelector('.th-sort-icon')
    return (iconEl?.scrollWidth ?? 0) + (sortEl?.scrollWidth ?? 0)
}

/**
 * Full width of the header label. `.inner-th` is squeezed to the cell, but the
 * DlEllipsis text spans keep their full width as scrollWidth.
 */
const headerLabelWidth = (th: HTMLElement) => {
    const inner = th.querySelector('.inner-th') as HTMLElement
    if (!inner) return th.scrollWidth
    const parts = inner.querySelectorAll(
        '.dl-ellipsis__left, .dl-ellipsis__right'
    )
    if (!parts.length) return inner.scrollWidth
    let width = 0
    parts.forEach((part) => (width += (part as HTMLElement).scrollWidth))
    return Math.max(width, inner.scrollWidth)
}

const headerRow = (table: HTMLTableElement) =>
    (table.tHead?.rows[0] as HTMLTableRowElement) || null

export function useColumnLayout(options: ColumnLayoutOptions) {
    const { props, columns } = options

    const measurements = ref<Record<string, number>>({})
    const renderedWidths = ref<number[]>([])
    const utilityWidths = ref<number[]>([])
    const actionsWidth = ref(0)
    const containerWidth = ref(0)
    const userWidths = reactive<Record<string, number>>({})
    const scrolledStart = ref(false)
    const scrolledEnd = ref(false)
    const resizeHover = ref<number | null>(null)
    const resizing = ref<number | null>(null)

    const limits = computed(() => ({
        minWidth: props.columnMinWidth,
        maxWidth: props.columnMaxWidth ?? Infinity
    }))

    const layout = computed(() =>
        computeLayout({
            columns: columns.value,
            containerWidth: Math.max(
                0,
                containerWidth.value -
                    utilityWidths.value.reduce((a, b) => a + b, 0) -
                    actionsWidth.value
            ),
            measurements: measurements.value,
            userWidths,
            limits: limits.value,
            // tree tables keep browser-shared widths (their body is a nested
            // table that consumers size with their own CSS)
            fitAllColumns: props.fitAllColumns || props.isTreeTable
        })
    )

    const pinnedStart = computed(() => {
        let count =
            props.stickyColumns === 'first' || props.stickyColumns === 'both'
                ? 1
                : 0
        while (
            count < columns.value.length &&
            columns.value[count].pinned === 'start'
        ) {
            count++
        }
        return count
    })

    const pinnedEnd = computed(() => {
        const cols = columns.value
        let count =
            props.stickyColumns === 'last' || props.stickyColumns === 'both'
                ? 1
                : 0
        while (
            count < cols.length &&
            cols[cols.length - 1 - count].pinned === 'end'
        ) {
            count++
        }
        return count
    })

    const css = computed(() =>
        buildLayoutCss({
            tableId: options.tableId,
            widths: columns.value.map((col) => layout.value.widths[col.name]),
            userSized: new Set(
                columns.value
                    .map((col, i) => (col.name in userWidths ? i : -1))
                    .filter((i) => i >= 0)
            ),
            total: layout.value.total,
            utilityWidths: utilityWidths.value,
            actionsWidth: actionsWidth.value,
            pinnedStart: pinnedStart.value,
            pinnedEnd: pinnedEnd.value,
            renderedWidths: renderedWidths.value,
            fitAllColumns: props.fitAllColumns,
            resizeHover: resizeHover.value,
            resizing: resizing.value
        })
    )

    // ---- stylesheet -------------------------------------------------------
    let styleEl: HTMLStyleElement = null
    const writeCss = (text: string) => {
        if (!styleEl) return
        if (styleEl.textContent !== text) styleEl.textContent = text
    }
    watch(css, writeCss)

    // ---- measurement (reads only, then one reactive write) ----------------
    function measure() {
        const table = options.getTable()
        if (!table) return
        const head = headerRow(table)
        const cols = columns.value
        const content: Record<string, number> = {}
        const rendered: number[] = []
        const utility: number[] = []
        let actions = 0

        if (head) {
            for (const th of Array.from(head.cells) as HTMLElement[]) {
                const index = th.dataset.colIndex
                if (index === undefined || index === '') {
                    if (th.classList.contains('dl-table-visible-column')) {
                        actions = th.offsetWidth
                    } else if (!rendered.length) {
                        utility.push(th.offsetWidth)
                    }
                    continue
                }
                const col = cols[Number(index)]
                if (!col) continue
                rendered[Number(index)] = th.offsetWidth
                content[col.name] =
                    headerLabelWidth(th) + getIconWidth(th) + HEADER_EXTRA_WIDTH
            }
        }

        const body = table.querySelector('tbody.dl-virtual-scroll__content')
        const rows = body
            ? (Array.from(body.children) as HTMLElement[])
                  .filter((tr) => tr.classList.contains('dl-tr'))
                  .slice(0, MEASURE_SAMPLE_ROWS)
            : []
        for (const tr of rows) {
            for (const td of Array.from(tr.children) as HTMLElement[]) {
                const col = cols[Number(td.dataset.colIndex)]
                // only a truncated cell tells its real content width
                if (!col || td.scrollWidth <= td.clientWidth) continue
                content[col.name] = Math.max(
                    content[col.name] || 0,
                    td.scrollWidth
                )
            }
        }

        measurements.value = content
        renderedWidths.value = rendered
        utilityWidths.value = utility
        actionsWidth.value = actions
    }

    const scheduleMeasure = () => nextTick(measure)

    // ---- container size and horizontal scroll edges -----------------------
    let observedEl: HTMLElement = null
    let resizeObserver: ResizeObserver = null

    const updateScrollEdges = () => {
        const el = observedEl
        if (!el) return
        const start = el.scrollLeft > 0
        const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
        if (start !== scrolledStart.value) scrolledStart.value = start
        if (end !== scrolledEnd.value) scrolledEnd.value = end
    }

    const onContainerResize = () => {
        if (!observedEl) return
        containerWidth.value = observedEl.clientWidth
        updateScrollEdges()
    }

    function observeContainer() {
        const el = options.getScrollContainer()
        if (el === observedEl) return
        unobserveContainer()
        observedEl = el
        if (!el) return
        el.addEventListener('scroll', updateScrollEdges, { passive: true })
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(onContainerResize)
            resizeObserver.observe(el)
        }
        onContainerResize()
    }

    function unobserveContainer() {
        if (observedEl) {
            observedEl.removeEventListener('scroll', updateScrollEdges)
        }
        resizeObserver?.disconnect()
        resizeObserver = null
        observedEl = null
    }

    // ---- resize -----------------------------------------------------------
    let resizeStartX = 0
    let resizeStartWidth = 0
    let pendingX: number = null
    let frame: number = null
    let captureEl: HTMLElement = null
    let pointerId: number = null

    const dataIndexOf = (th: HTMLElement) =>
        th && th.dataset.colIndex !== undefined
            ? Number(th.dataset.colIndex)
            : null

    const currentWidth = (index: number) => {
        const w = layout.value.widths[columns.value[index]?.name]
        return typeof w === 'number' ? w : renderedWidths.value[index] || 0
    }

    function edgeTarget(evt: PointerEvent): number | null {
        if (!props.resizable) return null
        const th = (evt.target as HTMLElement)?.closest?.(
            'th[data-col-index]'
        ) as HTMLElement
        const index = dataIndexOf(th)
        if (index === null) return null
        const { left, right } = th.getBoundingClientRect()
        const last = columns.value.length - 1
        // first column only from its right edge, last only from its left edge
        if (right - evt.clientX <= RESIZE_SENSITIVITY_OFFSET) {
            return index < last ? index : null
        }
        if (evt.clientX - left <= RESIZE_SENSITIVITY_OFFSET && index > 0) {
            return index - 1
        }
        return null
    }

    function applyResize(clientX: number) {
        const index = resizing.value
        const col = columns.value[index]
        if (!col) return
        const { min, max } = columnLimits(col, limits.value)
        set(
            userWidths,
            col.name,
            clampWidth(resizeStartWidth + clientX - resizeStartX, min, max)
        )
    }

    function onHeadPointerMove(evt: PointerEvent) {
        if (resizing.value !== null) {
            pendingX = evt.clientX
            if (frame === null) {
                frame = requestAnimationFrame(() => {
                    frame = null
                    if (pendingX !== null) applyResize(pendingX)
                })
            }
            return
        }
        const target = edgeTarget(evt)
        if (target !== resizeHover.value) resizeHover.value = target
    }

    function onHeadPointerLeave() {
        if (resizing.value === null && resizeHover.value !== null) {
            resizeHover.value = null
        }
    }

    /** returns true when the event started a resize */
    function onHeadPointerDown(evt: PointerEvent): boolean {
        if (evt.button !== undefined && evt.button !== 0) return false
        const target = edgeTarget(evt)
        if (target === null) return false
        evt.preventDefault()
        evt.stopPropagation()
        resizing.value = target
        resizeStartX = evt.clientX
        resizeStartWidth = currentWidth(target)
        options.setResizingInProgress(true)
        captureEl = evt.currentTarget as HTMLElement
        pointerId = evt.pointerId
        try {
            captureEl?.setPointerCapture?.(pointerId)
        } catch (e) {
            // the pointer may already be gone
        }
        return true
    }

    function onHeadPointerUp(evt?: PointerEvent) {
        if (resizing.value === null) return
        if (frame !== null) {
            cancelAnimationFrame(frame)
            frame = null
        }
        if (evt && evt.clientX !== undefined) applyResize(evt.clientX)
        const col = columns.value[resizing.value]
        try {
            captureEl?.releasePointerCapture?.(pointerId)
        } catch (e) {
            // already released
        }
        captureEl = null
        pendingX = null
        resizing.value = null
        if (col && col.name in userWidths) {
            options.onResizeEnd({ [col.name]: userWidths[col.name] })
        }
        // swallow the click that follows the pointerup
        setTimeout(() => options.setResizingInProgress(false), 200)
    }

    function setUserWidth(name: string, width: number) {
        const col = columns.value.find((c) => c.name === name)
        if (!col) return
        const { min, max } = columnLimits(col, limits.value)
        set(userWidths, name, clampWidth(width, min, max))
    }

    function resetUserWidths(names?: string[]) {
        for (const name of names ?? Object.keys(userWidths)) {
            del(userWidths, name)
        }
    }

    // ---- lifecycle --------------------------------------------------------
    onMounted(() => {
        styleEl = document.createElement('style')
        styleEl.setAttribute('data-dl-table-style', options.tableId)
        document.head.appendChild(styleEl)
        writeCss(css.value)
        observeContainer()
        scheduleMeasure()
    })

    onBeforeUnmount(() => {
        unobserveContainer()
        if (frame !== null) cancelAnimationFrame(frame)
        styleEl?.parentNode?.removeChild(styleEl)
        styleEl = null
    })

    return {
        layout,
        css,
        measurements,
        userWidths,
        containerWidth,
        scrolledStart,
        scrolledEnd,
        resizeHover,
        resizing,
        pinnedStart,
        pinnedEnd,
        measure,
        scheduleMeasure,
        observeContainer,
        currentWidth,
        setUserWidth,
        resetUserWidths,
        onHeadPointerMove,
        onHeadPointerLeave,
        onHeadPointerDown,
        onHeadPointerUp
    }
}
