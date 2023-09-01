interface Options {
    minColWidth?: number
    width?: number
    cursor?: string
    color: string
    resizingColor?: string
}

const DEFAULT_SEPARTOR_WIDTH = 1
const DEFAULT_MIN_COL_WIDTH = 16
const DEFAULT_RESIZING_COLOR = 'var(--dl-color-medium)'
const DEFAULT_COLOR = 'var(--dl-color-lighter)'
const DEFAULT_CURSOR = 'ew-resize'

const INNER_DIV_CLASS = 'dl-table-cell-inner-div'

export class ResizableManager {
    private _table: HTMLTableElement
    private _currentColumn: HTMLTableCellElement | null = null
    private _thInnerDiv: HTMLDivElement = null
    private _columnIndex: number = 0
    private _tdInnerDivs: HTMLElement[] = []
    private _resizing: boolean = false
    private _options: Options = {
        minColWidth: DEFAULT_MIN_COL_WIDTH,
        width: DEFAULT_SEPARTOR_WIDTH,
        cursor: DEFAULT_CURSOR,
        color: DEFAULT_COLOR,
        resizingColor: DEFAULT_RESIZING_COLOR
    }

    private _colEvents: any[] = []
    private _separators: HTMLDivElement[] = []

    private _onMouseMoveFn = this._onMouseMove.bind(this)
    private _onMouseUpFn = this._onMouseUp.bind(this)

    private _onMouseMove(e: MouseEvent) {
        requestAnimationFrame(() => {
            if (!this._currentColumn || !this._thInnerDiv) return

            const padding = this._paddingDiff(this._currentColumn)
            const { x } = this._currentColumn.getBoundingClientRect()
            const newWidth = e.clientX - x - padding

            if (newWidth <= this._options.minColWidth) return

            this._thInnerDiv.style.width = newWidth + 'px'

            this._tdInnerDivs.forEach((div) => {
                div.style.width = newWidth + 'px'
            })
        })
    }

    private _paddingDiff(col: HTMLElement) {
        const padLeft = this._getStyleVal(col, 'padding-left')
        const padRight = this._getStyleVal(col, 'padding-right')
        return parseInt(padLeft) + parseInt(padRight)
    }

    private _getStyleVal(elm: HTMLElement, css: string) {
        return window.getComputedStyle(elm, null).getPropertyValue(css)
    }

    private _onMouseUp(e: MouseEvent) {
        e.stopPropagation()

        this._resizing = false

        this._removeColumnBoundaries(this._currentColumn)

        document.removeEventListener('mousemove', this._onMouseMoveFn)
        document.removeEventListener('mouseup', this._onMouseUpFn)
    }

    private _removeColumnBoundaries(eventTarget: any) {
        const leftSeparator = eventTarget.querySelector(
            '[data-type="left-separator"]'
        ) as HTMLElement
        const resizeSeparator = eventTarget.querySelector(
            '[data-type="resize-separator"]'
        ) as HTMLElement

        leftSeparator.style.backgroundColor = 'transparent'
        resizeSeparator.style.backgroundColor = 'transparent'
        resizeSeparator.style.border = '0px'
        eventTarget.style.cursor = 'inherit'
    }

    private _onMouseDown = (e: MouseEvent) => {
        this._resizing = true

        e.stopPropagation()
        const eventTarget = e.target as HTMLDivElement
        eventTarget.style.backgroundColor = this._options.resizingColor

        this._currentColumn = eventTarget!
            .parentElement! as HTMLTableCellElement
        this._thInnerDiv = this._currentColumn.querySelector(
            `.${INNER_DIV_CLASS}`
        )

        this._columnIndex = Number(eventTarget.getAttribute('data-index')!)
        this._tdInnerDivs = this._table!.querySelectorAll(
            `tbody > tr > td:nth-of-type(${
                this._columnIndex + 1
            }) > .${INNER_DIV_CLASS}`
        )! as unknown as HTMLDivElement[]

        document.addEventListener('mousemove', this._onMouseMoveFn)
        document.addEventListener('mouseup', this._onMouseUpFn)
    }

    private _onMouseEnter(e: any) {
        if (this._resizing === true) return

        const leftSeparator = e.target.querySelector(
            '[data-type="left-separator"]'
        ) as HTMLElement
        const resizeSeparator = e.target.querySelector(
            '[data-type="resize-separator"]'
        ) as HTMLElement

        leftSeparator.style.backgroundColor = this._options.color
        resizeSeparator.style.backgroundColor = this._options.color
        resizeSeparator.style.width = '1px'
        resizeSeparator.style.border = '3px solid var(--dl-color-bg)'
        e.target.style.cursor = 'pointer'
    }

    private _onMouseLeave = (e: any) => {
        if (this._resizing === true) return

        this._removeColumnBoundaries(e.target)
    }

    private _createResizeSeparator(height: number, index: number) {
        const div = document.createElement('div')
        div.style.top = '0px'
        div.style.right = '0px'
        div.style.width = this._options.width + 'px'
        div.style.position = 'absolute'
        div.style.cursor = this._options.cursor
        div.style.userSelect = 'none'
        div.style.height = height + 'px'
        div.setAttribute('data-index', index.toString())
        div.setAttribute('data-type', 'resize-separator')

        return div
    }

    private _createLeftSeparator(height: number) {
        const div = document.createElement('div')
        div.style.top = '0px'
        div.style.left = '0px'
        div.style.width = this._options.width + 'px'
        div.style.position = 'absolute'
        div.style.userSelect = 'none'
        div.style.height = height + 'px'
        div.setAttribute('data-type', 'left-separator')

        return div
    }

    public addResizeCapability(
        table: HTMLTableElement,
        options: Partial<Options> = {}
    ) {
        this._options = {
            ...this._options,
            ...options
        }
        this._table = table
        const tableHeight = table.offsetHeight
        const cols = table.querySelectorAll('thead > tr:first-of-type > th')

        for (let i = 0; i < cols.length - 1; i++) {
            const column = cols[i]

            if ((column as HTMLElement).dataset.resizable === 'false') {
                continue
            }

            (column as HTMLElement).style.position = 'relative'

            const resizeSeparator = this._createResizeSeparator(tableHeight, i)
            column.appendChild(resizeSeparator)
            resizeSeparator.addEventListener(
                'mousedown',
                this._onMouseDown.bind(this)
            )

            const leftSeparator = this._createLeftSeparator(tableHeight)
            column.appendChild(leftSeparator)

            this._separators.push(resizeSeparator, leftSeparator)

            const onMouseEnterFn = this._onMouseEnter.bind(this)
            column.addEventListener('mouseenter', onMouseEnterFn)
            this._colEvents.push({
                column,
                type: 'mouseenter',
                evt: onMouseEnterFn
            })

            const onMouseLeaveFn = this._onMouseLeave.bind(this)
            column.addEventListener('mouseleave', onMouseLeaveFn)
            this._colEvents.push({
                column,
                type: 'mouseleave',
                evt: onMouseLeaveFn
            })
        }
    }

    public updateResizersHeight(height: number) {
        this._separators.forEach((el) => {
            el.style.height = height + 'px'
        })
    }

    public removeResizeCapability() {
        this._separators.forEach((separator) => {
            separator.remove()
        })

        this._colEvents.forEach(({ column, type, evt }) => {
            (column as HTMLElement).style.position = 'inherit'
            column.removeEventListener(type, evt)
        })

        this._currentColumn = null
        this._separators = []
    }
}
