import { isMobileOrTablet } from '.'
import { getScrollbarWidth } from './scroll'

let vpLeft: number | undefined
let vpTop: number | undefined

export function validatePosition(pos: string) {
    const parts = pos.split(' ')
    if (parts.length !== 2) {
        return false
    }
    if (['top', 'center', 'bottom'].includes(parts[0]) !== true) {
        return false
    }
    if (
        ['left', 'middle', 'right', 'start', 'end'].includes(parts[1]) !== true
    ) {
        return false
    }
    return true
}

export function validateOffset(val: number[]) {
    if (!val) {
        return true
    }
    if (val.length !== 2) {
        return false
    }
    if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
        return false
    }
    return true
}

const horizontalPos = {
    'start#ltr': 'left',
    'end#ltr': 'right'
}

const positions = ['left', 'middle', 'right']

positions.forEach((pos) => {
    (horizontalPos as { [key: string]: string })[`${pos}#ltr`] = pos
})

interface AnchorProps {
    top: number
    left: number
    right: number
    bottom: number
    width: number
    height: number
    middle: number
    center: number
}

export type ParsedPosition = {
    vertical: keyof AnchorProps
    horizontal: keyof AnchorProps
}

interface TargetProps {
    top: number
    center: number
    bottom: number
    left: number
    middle: number
    right: number
}

export function parsePosition(pos: string): ParsedPosition {
    const parts = pos.split(' ')
    const vertical = parts[0] as keyof AnchorProps
    const horizontal = (horizontalPos as { [key: string]: keyof AnchorProps })[
        `${parts[1]}#ltr`
    ]
    return {
        vertical,
        horizontal
    }
}

export function getAnchorProps(el: HTMLElement, offset: number[]) {
    let { top, left, right, bottom, width, height } = el.getBoundingClientRect()

    if (offset !== void 0) {
        top -= offset[1]
        left -= offset[0]
        bottom += offset[1]
        right += offset[0]

        width += offset[0]
        height += offset[1]
    }

    return {
        top,
        left,
        right,
        bottom,
        width,
        height,
        middle: left + (right - left) / 2,
        center: top + (bottom - top) / 2
    }
}

export function getTargetProps(el: HTMLElement) {
    return {
        top: 0,
        center: el.offsetHeight / 2,
        bottom: el.offsetHeight,
        left: 0,
        middle: el.offsetWidth / 2,
        right: el.offsetWidth
    }
}

interface PositionConfig {
    el: HTMLElement
    offset: number[]
    anchorEl: HTMLElement
    anchorOrigin: ParsedPosition
    selfOrigin: any
    maxHeight?: string
    maxWidth?: string
    absoluteOffset?: any
    fit?: boolean // fit the size to the content
    cover?: boolean
}

interface ElementStyle {
    maxHeight?: string
    maxWidth?: string
    visibility?: string
    minWidth?: string
    minHeight?: string
    top?: string
    left?: string
}

// cfg: { el, anchorEl, anchorOrigin, selfOrigin, offset, absoluteOffset, cover, fit, maxHeight, maxWidth }
export function setPosition(cfg: PositionConfig) {
    const isMobile = isMobileOrTablet()

    if (isMobile && window.visualViewport !== void 0) {
        // uses the dl-position-engine CSS class

        const el = document.body.style
        const { offsetLeft: left, offsetTop: top } = window.visualViewport

        if (left !== vpLeft) {
            el.setProperty('--dl-pe-left', left + 'px')
            vpLeft = left
        }
        if (top !== vpTop) {
            el.setProperty('--dl-pe-top', top + 'px')
            vpTop = top
        }
    }

    let anchorProps: AnchorProps

    // scroll position might change
    // if max-height/-width changes, so we
    // need to restore it after we calculate
    // the new positioning
    const { scrollLeft, scrollTop } = cfg.el!

    if (cfg.absoluteOffset === void 0) {
        anchorProps = getAnchorProps(cfg.anchorEl, cfg.offset)
    } else {
        const { top: anchorTop, left: anchorLeft } =
            cfg.anchorEl.getBoundingClientRect()
        const top = anchorTop + cfg.absoluteOffset.top
        const left = anchorLeft + cfg.absoluteOffset.left

        anchorProps = {
            top,
            left,
            width: 1,
            height: 1,
            right: left + 1,
            center: top,
            middle: left,
            bottom: top + 1
        }
    }

    let elStyle: ElementStyle = {
        maxHeight: cfg.maxHeight,
        maxWidth: cfg.maxWidth,
        visibility: 'visible'
    }

    if (cfg.fit === true || cfg.cover === true) {
        elStyle.minWidth = cfg.maxWidth || anchorProps.width + 'px'
        elStyle.maxWidth = cfg.maxWidth || anchorProps.width + 'px'

        if (cfg.cover === true) {
            elStyle.minHeight = anchorProps.height + 'px'
        }
    }

    Object.assign(cfg.el!.style, elStyle)

    const targetProps = getTargetProps(cfg.el as HTMLElement)
    const verticalAnchorOrigin: keyof AnchorProps = cfg.anchorOrigin.vertical
    const verticalSelfOrigin: keyof TargetProps = cfg.selfOrigin.vertical
    const horizontalSelfOrigin: keyof TargetProps = cfg.selfOrigin.horizontal

    const props: {
        top: number
        left: number
        maxHeight?: number
        maxWidth?: number
    } = {
        top:
            anchorProps[verticalAnchorOrigin] - targetProps[verticalSelfOrigin],
        left:
            anchorProps[cfg.anchorOrigin.horizontal] -
            targetProps[horizontalSelfOrigin]
    }

    applyBoundaries(
        props,
        anchorProps,
        targetProps,
        cfg.anchorOrigin,
        cfg.selfOrigin
    )

    elStyle = {
        top: props.top + 'px',
        left: props.left + 'px'
    }

    if (props.maxHeight !== void 0) {
        elStyle.maxHeight = props.maxHeight + 'px'

        if (anchorProps.height > props.maxHeight) {
            elStyle.minHeight = elStyle.maxHeight
        }
    }

    if (props.maxWidth !== void 0) {
        elStyle.maxWidth = props.maxWidth + 'px'

        if (anchorProps.width > props.maxWidth) {
            elStyle.minWidth = elStyle.maxWidth
        }
    }

    Object.assign(cfg.el!.style, elStyle)

    // restore scroll position
    if (cfg.el!.scrollTop !== scrollTop) {
        cfg.el!.scrollTop = scrollTop
    }
    if (cfg.el!.scrollLeft !== scrollLeft) {
        cfg.el!.scrollLeft = scrollLeft
    }
}

interface Position {
    top: number
    left: number
}

export function setForcedPosition(
    cfg: Partial<PositionConfig>,
    position: Position
) {
    // scroll position might change
    // if max-height/-width changes, so we
    // need to restore it after we calculate
    // the new positioning
    const { scrollLeft, scrollTop } = cfg.el!

    const props: {
        top: number
        left: number
    } = position

    const elStyle: ElementStyle = {
        top: props.top + 'px',
        left: props.left + 'px'
    }

    Object.assign(cfg.el!.style, elStyle)

    // restore scroll position
    if (cfg.el!.scrollTop !== scrollTop) {
        cfg.el!.scrollTop = scrollTop
    }
    if (cfg.el!.scrollLeft !== scrollLeft) {
        cfg.el!.scrollLeft = scrollLeft
    }
}

function applyBoundaries(
    props: {
        top: number
        left: number
        maxHeight?: number
        maxWidth?: number
    },
    anchorProps: AnchorProps,
    targetProps: TargetProps,
    anchorOrigin: ParsedPosition,
    selfOrigin: ParsedPosition
) {
    const currentHeight = targetProps.bottom
    const currentWidth = targetProps.right
    const margin = getScrollbarWidth()
    const innerHeight = window.innerHeight - margin
    const innerWidth = document.body.clientWidth

    if (props.top < 0 || props.top + currentHeight > innerHeight) {
        if (selfOrigin.vertical === 'center') {
            props.top =
                anchorProps[anchorOrigin.vertical] > innerHeight / 2
                    ? Math.max(0, innerHeight - currentHeight)
                    : 0
            props.maxHeight = Math.min(currentHeight, innerHeight)
        } else if (anchorProps[anchorOrigin.vertical] > innerHeight / 2) {
            const anchorY = Math.min(
                innerHeight,
                anchorOrigin.vertical === 'center'
                    ? anchorProps.center
                    : anchorOrigin.vertical === selfOrigin.vertical
                    ? anchorProps.bottom
                    : anchorProps.top
            )
            props.maxHeight = Math.min(currentHeight, anchorY)
            props.top = Math.max(0, anchorY - currentHeight)
        } else {
            props.top = Math.max(
                0,
                anchorOrigin.vertical === 'center'
                    ? anchorProps.center
                    : anchorOrigin.vertical === selfOrigin.vertical
                    ? anchorProps.top
                    : anchorProps.bottom
            )
            props.maxHeight = Math.min(currentHeight, innerHeight - props.top)
        }
    }

    if (props.left < 0 || props.left + currentWidth > innerWidth) {
        props.maxWidth = Math.min(currentWidth, innerWidth)
        if (selfOrigin.horizontal === 'middle') {
            props.left =
                anchorProps[anchorOrigin.horizontal] > innerWidth / 2
                    ? Math.max(0, innerWidth - currentWidth)
                    : 0
        } else if (anchorProps[anchorOrigin.horizontal] > innerWidth / 2) {
            const anchorX = Math.min(
                innerWidth,
                anchorOrigin.horizontal === 'middle'
                    ? anchorProps.middle
                    : anchorOrigin.horizontal === selfOrigin.horizontal
                    ? anchorProps.right
                    : anchorProps.left
            )
            props.maxWidth = Math.min(currentWidth, anchorX)
            props.left = Math.max(0, anchorX - props.maxWidth)
        } else {
            props.left = Math.max(
                0,
                anchorOrigin.horizontal === 'middle'
                    ? anchorProps.middle
                    : anchorOrigin.horizontal === selfOrigin.horizontal
                    ? anchorProps.left
                    : anchorProps.right
            )
            props.maxWidth = Math.min(currentWidth, innerWidth - props.left)
        }
    }
}
