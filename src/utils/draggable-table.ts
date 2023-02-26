import { debounce } from 'lodash'

function getTargetRow(target: any) {
    const elemName = target.tagName.toLowerCase()
    const elemClassList = Array.from(target.classList) as string[]

    if (elemName == 'tr') return target
    if (elemClassList.includes('icon-dl-drag')) return target.closest('tr')
}

function removeColumnBoundaries(eventTarget: any) {
    const leftSeparator = eventTarget.querySelector(
        '[data-type="left-separator"]'
    ) as HTMLElement
    const resizeSeparator = eventTarget.querySelector(
        '[data-type="resize-separator"]'
    ) as HTMLElement

    if (leftSeparator) {
        leftSeparator.style.backgroundColor = 'transparent'
    }

    if (resizeSeparator) {
        resizeSeparator.style.backgroundColor = 'transparent'
    }
    eventTarget.style.cursor = 'inherit'
}

function getMouseCoords(event: any, root?: HTMLDivElement) {
    if (root) {
        const rootPos = root.getBoundingClientRect()

        return {
            x: event.clientX - rootPos.x - 16,
            y: event.clientY - rootPos.y - 8
        }
    }

    return {
        x: event.clientX,
        y: event.clientY
    }
}

function getStyle(target: HTMLElement, styleName: any) {
    const compStyle = getComputedStyle(target)
    const style = compStyle[styleName]
    return style ? style : null
}

function isIntersecting(
    min0: number,
    max0: number,
    min1: number,
    max1: number
) {
    return max0 >= min1 && min0 <= max1
}

function getRows(table: HTMLTableElement) {
    return table.querySelectorAll('tbody tr')
}

export function applyDraggableRows(
    table: HTMLTableElement,
    vm?: any,
    root?: HTMLDivElement
) {
    const tbody = table.querySelector('tbody')!

    let currRow: any = null
    let dragElem: any = null
    let oldIndex = 0
    let newIndex = 0
    let mouseDownX = 0
    let mouseDownY = 0
    let mouseX = 0
    let mouseY = 0
    let mouseDrag = false
    let rowHeight = 0
    let wasMoved = false

    function bindMouse() {
        table.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button != 0) return true

        const target = getTargetRow(event.target)

        if (target) {
            table.style.userSelect = 'none'
            rowHeight = target.cells[0].getBoundingClientRect().height

            currRow = target
            addDraggableRow(target)

            const coords = getMouseCoords(event, root)

            mouseDownX = coords.x
            mouseDownY = coords.y

            mouseDrag = true
            table.classList.add('mouse-drag')
        }
    }

    function handleMouseMove() {
        if (!mouseDrag) return

        const coords = getMouseCoords(event, root)

        mouseX = coords.x
        mouseY = coords.y

        moveRow(mouseX, mouseY)
    }

    function handleMouseUp() {
        if (!mouseDrag) return

        currRow.classList.remove('dl-table__is-dragging')
        table.removeChild(dragElem)

        if (oldIndex !== newIndex) vm?.emit('row-reorder', oldIndex, newIndex)

        dragElem = null
        mouseDrag = false
        table.classList.remove('mouse-drag')
        wasMoved = false

        table.style.userSelect = 'auto'
    }

    function swapRow(row: any, index: number) {
        const currIndex = Array.from(tbody.children).indexOf(currRow)
        const row1 = currIndex > index ? currRow : row
        const row2 = currIndex > index ? row : currRow

        newIndex = index + 1
        wasMoved = oldIndex !== newIndex
        tbody.insertBefore(row1, row2)
    }

    function moveRow(x: number, y: number) {
        dragElem.style.top = y + 'px'
        dragElem.style.left = x + 'px'

        const dPos = dragElem.getBoundingClientRect()
        const currStartY = dPos.y
        const currEndY = currStartY + dPos.height
        const rows = getRows(table)

        for (let i = 0; i < rows.length; i++) {
            const rowElem = rows[i] as HTMLTableRowElement
            const rowSize = rowElem.cells[0].getBoundingClientRect()
            const rowStartY = rowSize.y
            const rowEndY = rowStartY + rowSize.height

            if (
                currRow !== rowElem &&
                isIntersecting(currStartY, currEndY, rowStartY, rowEndY)
            ) {
                if (Math.abs(currStartY - rowStartY) < rowSize.height / 2)
                    swapRow(rowElem, i)
            }
        }
    }

    function addDraggableRow(target: any) {
        target.classList.add('dl-table__is-dragging')
        dragElem = target.cloneNode(true)
        oldIndex = target.rowIndex
        newIndex = target.rowIndex

        dragElem.classList.add('dl-table__drag')
        dragElem.style.height = `${rowHeight}px`
        for (let i = 0; i < target.children.length; i++) {
            const oldTD = target.children[i]
            const newTD = dragElem.children[i]
            newTD.style.width = getStyle(oldTD, 'width')
            newTD.style.height = getStyle(oldTD, 'height')
            newTD.style.padding = getStyle(oldTD, 'padding')
            newTD.style.margin = getStyle(oldTD, 'margin')
        }

        table.appendChild(dragElem)

        const tPos = target.getBoundingClientRect()
        const dPos = dragElem.getBoundingClientRect()
        dragElem.style.bottom = dPos.y - tPos.y - tPos.height + 'px'
        dragElem.style.left = '-1px'

        document.dispatchEvent(
            new MouseEvent('mousemove', {
                view: window,
                cancelable: true,
                bubbles: true
            })
        )
    }

    bindMouse()

    function unsubscribeEvents() {
        table.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    return unsubscribeEvents
}

export function applyDraggableColumns(
    table: HTMLTableElement,
    vm?: any,
    draggableElement?: HTMLDivElement,
    root?: HTMLDivElement
) {
    let colIndex: number | null = null
    let newColIndex = -1
    let dragElem: any = null
    let mouseDownX = 0
    let mouseDownY = 0
    let mouseX = 0
    let mouseY = 0
    let mouseDrag = false
    let colHeight = 0

    function bindMouse() {
        table.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button != 0) return true

        const target: any = getTargetCol(event.target as Element)

        if (target) {
            colHeight = table.getBoundingClientRect().height

            colIndex = target.cellIndex
            newColIndex = colIndex

            if (vm.props.resizable) {
                removeColumnBoundaries(target)
            }
            addDraggableColumn(colIndex)

            const coords = getMouseCoords(event)

            mouseDownX = coords.x
            mouseDownY = coords.y

            mouseDrag = true
            // table.classList.add('mouse-drag')
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (!mouseDrag) return

        const coords = getMouseCoords(event, root)

        mouseX = coords.x
        mouseY = coords.y

        moveCol(mouseX, mouseY)
    }

    function handleMouseUp() {
        if (!mouseDrag) return

        Array.from(table.rows).forEach((row) => {
            row.cells[
                newColIndex === -1 ? colIndex : newColIndex
            ].classList.remove('dl-table__selected')
        })

        vm.emit('col-reorder', colIndex, newColIndex)
        table.removeChild(dragElem)

        dragElem = null
        mouseDrag = false
        table.classList.remove('mouse-drag')
        newColIndex = -1
    }

    function addDraggableColumn(index: number) {
        dragElem = draggableElement.cloneNode()
        dragElem.classList.add('dl-table__drag--col')

        const tableParent = table.parentElement
        const {
            bottom: bottomLimit,
            top: topLimit,
            height
        } = tableParent.getBoundingClientRect()

        dragElem.style.height = `${height}px`

        Array.from(table.rows).forEach((row, rowIndex) => {
            const rowTop = row.getBoundingClientRect().top

            if (rowIndex !== 0 && (rowTop > bottomLimit || rowTop < topLimit)) {
                return
            }

            if (row.classList.contains('dl-tr')) {
                dragElem.appendChild(row.cells[index]?.cloneNode(true) || {})

                row.cells[index].classList.add('dl-table__selected')
            }
        })

        table.appendChild(dragElem)
    }

    function getTargetCol(target: Element) {
        if (target.classList.contains('empty-col')) return null

        if (target.tagName === 'th') return target

        // if a nested element in <th /> was clicked
        return target.closest('th')
    }

    function moveCol(x: number, y: number) {
        dragElem.style.top = y + 'px'
        dragElem.style.left = x + 'px'

        const { x: draggedColStartX } = dragElem.getBoundingClientRect()
        const cols = getFirstRowCells()

        let currentIndex = newColIndex

        for (let i = cols.length - 1; i > newColIndex; i--) {
            const col = cols[i] as HTMLTableCellElement
            const { x: colStartX, width: colWidth } =
                col.getBoundingClientRect()

            const leftToRight = draggedColStartX >= colStartX + colWidth / 2

            if (leftToRight) {
                currentIndex = i
                break
            }
        }

        if (currentIndex !== newColIndex) {
            moveAfter(currentIndex)
            return
        }

        const start = vm.props.draggable === 'columns' ? 0 : 1

        for (let i = start; i < newColIndex; i++) {
            const col = cols[i] as HTMLTableCellElement
            const { x: colStartX, width: colWidth } =
                col.getBoundingClientRect()
            const colEndX = colStartX + colWidth

            const rightToLeft = draggedColStartX <= colEndX - colWidth / 2

            if (rightToLeft) {
                currentIndex = i
                break
            }
        }

        if (currentIndex !== newColIndex) {
            moveBefore(currentIndex)
        }
    }

    const moveBefore = (index: number) => {
        requestAnimationFrame(() => {
            Array.from(table.rows).forEach((row) => {
                row.insertBefore(row.cells[newColIndex], row.cells[index])
            })

            newColIndex = index
        })
    }

    const moveAfter = (index: number) => {
        requestAnimationFrame(() => {
            Array.from(table.rows).forEach((row) => {
                row.insertBefore(row.cells[index], row.cells[newColIndex])
            })

            newColIndex = index
        })
    }

    function getFirstRowCells() {
        return table.rows[0].cells
    }

    if (table) {
        bindMouse()
    }

    function unsubscribeEvents() {
        table.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    return unsubscribeEvents
}
