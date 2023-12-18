// The hook was created based on Quasar: https://github.com/quasarframework/quasar/blob/dev/ui/src/components/virtual-scroll/use-virtual-scroll.js

import { debounce } from 'lodash'
import {
    ref,
    computed,
    watch,
    onActivated,
    onDeactivated,
    onBeforeMount,
    onBeforeUnmount,
    nextTick,
    getCurrentInstance,
    ComputedRef,
    Ref
} from 'vue-demi'
import { noop } from '../../../utils/events'
import { DlVirtualScrollParamsType } from './types/VirtualScrollParamsType'

export interface ScrollDetails {
    scrollStart: number
    scrollViewSize: number
    scrollMaxSize: number
    offsetStart: number
    offsetEnd: number
}

export interface GridStyles {
    gridStyles: object
    gridClass: string
}

const aggBucketSize = 1000

const scrollToEdges = [
    'start',
    'center',
    'end',
    'start-force',
    'center-force',
    'end-force'
]

const filterProto = Array.prototype.filter

const setOverflowAnchor =
    window.getComputedStyle(document.body).overflowAnchor === void 0
        ? noop
        : function (contentEl: HTMLElement | null, index: number) {
              if (contentEl === null) {
                  return
              }

              if ((contentEl as any)._dlOverflowAnimationFrame !== void 0) {
                  cancelAnimationFrame(
                      (contentEl as any)._dlOverflowAnimationFrame
                  )
              }

              (contentEl as any)._dlOverflowAnimationFrame =
                  requestAnimationFrame(() => {
                      if (contentEl === null) {
                          return
                      }

                      (contentEl as any)._dlOverflowAnimationFrame = void 0

                      const children = (contentEl.children ||
                          []) as HTMLCollection

                      const chilrensWithAnchor = filterProto.call(
                          children,
                          (el) => el.dataset && el.dataset.dlVsAnchor !== void 0
                      )

                      for (const element of chilrensWithAnchor) {
                          delete element.dataset.dlVsAnchor
                      }

                      const el = children[index] as HTMLElement

                      if (el && el.dataset) {
                          el.dataset.dlVsAnchor = ''
                      }
                  })
          }

function sumFn(acc: number, h: number) {
    return acc + h
}

function getScrollDetails(
    parent: any,
    child: any,
    beforeRef: HTMLElement | null,
    afterRef: HTMLElement | null,
    horizontal: boolean,
    stickyStart: number,
    stickyEnd: number
): ScrollDetails {
    const parentCalc =
        parent === window
            ? document.scrollingElement || document.documentElement
            : parent
    const propElSize = horizontal === true ? 'offsetWidth' : 'offsetHeight'
    const details = {
        scrollStart: 0,
        scrollViewSize: -stickyStart - stickyEnd,
        scrollMaxSize: 0,
        offsetStart: -stickyStart,
        offsetEnd: -stickyEnd
    }

    if (horizontal === true) {
        if (parent === window) {
            details.scrollStart =
                window.pageXOffset ||
                window.scrollX ||
                document.body.scrollLeft ||
                0
            details.scrollViewSize += document.documentElement.clientWidth
        } else {
            details.scrollStart = parentCalc.scrollLeft
            details.scrollViewSize += parentCalc.clientWidth
        }
        details.scrollMaxSize = parentCalc.scrollWidth
    } else {
        if (parent === window) {
            details.scrollStart =
                window.pageYOffset ||
                window.scrollY ||
                document.body.scrollTop ||
                0
            details.scrollViewSize += document.documentElement.clientHeight
        } else {
            details.scrollStart = parentCalc.scrollTop
            details.scrollViewSize += parentCalc.clientHeight
        }
        details.scrollMaxSize = parentCalc.scrollHeight
    }

    if (beforeRef !== null) {
        for (
            let el = beforeRef.previousElementSibling;
            el !== null;
            el = el.previousElementSibling
        ) {
            if (el.classList.contains('dl-virtual-scroll--skip') === false) {
                details.offsetStart += (el as HTMLElement)[propElSize]
            }
        }
    }

    if (afterRef !== null) {
        for (
            let el = afterRef.nextElementSibling;
            el !== null;
            el = el.nextElementSibling
        ) {
            if (el.classList.contains('dl-virtual-scroll--skip') === false) {
                details.offsetEnd += (el as HTMLElement)[propElSize]
            }
        }
    }

    if (child !== parent) {
        const parentRect = parentCalc.getBoundingClientRect()
        const childRect = child?.getBoundingClientRect()

        if (childRect) {
            if (horizontal === true) {
                details.offsetStart += childRect.left - parentRect.left
                details.offsetEnd -= childRect.width
            } else {
                details.offsetStart += childRect.top - parentRect.top
                details.offsetEnd -= childRect.height
            }
        }

        if (parent !== window) {
            details.offsetStart += details.scrollStart
        }
        details.offsetEnd += details.scrollMaxSize - details.offsetStart
    }

    return details
}

function setScroll(parent: any, scroll: string | number, horizontal: boolean) {
    if (scroll === 'end') {
        scroll = (parent === window ? document.body : parent)[
            horizontal === true ? 'scrollWidth' : 'scrollHeight'
        ]
    }

    if (parent === window) {
        if (horizontal === true) {
            window.scrollTo(
                scroll as number,
                window.pageYOffset ||
                    window.scrollY ||
                    document.body.scrollTop ||
                    0
            )
        } else {
            window.scrollTo(
                window.pageXOffset ||
                    window.scrollX ||
                    document.body.scrollLeft ||
                    0,
                scroll as number
            )
        }
    } else if (horizontal === true) {
        parent.scrollLeft = scroll
    } else {
        parent.scrollTop = scroll
    }
}

function sumSize(sizeAgg: number[], size: number[], from: number, to: number) {
    if (from >= to) {
        return 0
    }

    const lastTo = size.length
    const fromAgg = Math.floor(from / aggBucketSize)
    const toAgg = Math.floor((to - 1) / aggBucketSize) + 1

    let total = sizeAgg.slice(fromAgg, toAgg).reduce(sumFn, 0)

    if (from % aggBucketSize !== 0) {
        total -= size.slice(fromAgg * aggBucketSize, from).reduce(sumFn, 0)
    }
    if (to % aggBucketSize !== 0 && to !== lastTo) {
        total -= size.slice(to, toAgg * aggBucketSize).reduce(sumFn, 0)
    }

    return total
}

export const commonVirtScrollProps = {
    virtualScrollSliceSize: {
        type: [Number, String],
        default: null as number
    },

    virtualScrollSliceRatioBefore: {
        type: [Number, String],
        default: 1
    },

    virtualScrollSliceRatioAfter: {
        type: [Number, String],
        default: 1
    },

    virtualScrollItemSize: {
        type: [Number, String],
        default: 0
    },

    virtualScrollStickySizeStart: {
        type: [Number, String],
        default: 0
    },

    virtualScrollStickySizeEnd: {
        type: [Number, String],
        default: 0
    },

    tableColspan: [Number, String]
}

export const commonVirtPropsList = Object.keys(commonVirtScrollProps)

export const useVirtualScrollProps = {
    virtualScrollHorizontal: Boolean,
    onVirtualScroll: Function,
    ...commonVirtScrollProps
}

export function useVirtualScroll({
    virtualScrollLength,
    getVirtualScrollTarget,
    getVirtualScrollEl,
    virtualScrollItemSizeComputed, // optional
    debounceValue,
    preventScrollTo
}: DlVirtualScrollParamsType) {
    const vm = getCurrentInstance()

    const { props, emit, proxy } = vm

    let scrollAnimationFrameId: number | null = null
    let changedRangeAnimationFrameId: number | null = null

    onBeforeUnmount(() => {
        resetAnimationFrame(scrollAnimationFrameId)
        resetAnimationFrame(changedRangeAnimationFrameId)
    })

    const resetAnimationFrame = (frameId: number | null) => {
        if (frameId) {
            cancelAnimationFrame(frameId)
        }
        frameId = null
    }

    let prevScrollStart: number | undefined
    let prevToIndex: number
    let localScrollViewSize: number | undefined
    let virtualScrollSizesAgg: number[] = []
    let virtualScrollSizes: number[]

    const virtualScrollPaddingBefore: Ref<number> = ref(0)
    const virtualScrollPaddingAfter: Ref<number> = ref(0)
    const virtualScrollSliceSizeComputed: Ref<Record<string, any>> = ref({})

    const beforeRef: Ref<HTMLElement | null> = ref(null)
    const afterRef: Ref<HTMLElement | null> = ref(null)
    const contentRef: Ref<HTMLElement | null> = ref(null)

    const virtualScrollSliceRange = ref({ from: 0, to: 0 })

    const colspanAttr = computed(() =>
        props.tableColspan !== void 0 ? props.tableColspan : 100
    ) as ComputedRef<number>

    if (virtualScrollItemSizeComputed === void 0) {
        virtualScrollItemSizeComputed = computed(
            () => props.virtualScrollItemSize
        ) as ComputedRef<number>
    }

    const needsReset = computed(() => virtualScrollItemSizeComputed!.value)

    const needsSliceRecalc = computed(
        () =>
            needsReset.value +
            ';' +
            props.virtualScrollSliceRatioBefore +
            ';' +
            props.virtualScrollSliceRatioAfter
    )

    watch(needsSliceRecalc, () => {
        setVirtualScrollSize()
    })
    watch(needsReset, reset)

    function reset() {
        localResetVirtualScroll(prevToIndex, true)
    }

    function refresh(toIndex: number) {
        localResetVirtualScroll(toIndex === void 0 ? prevToIndex : toIndex)
    }

    function scrollTo(toIndex: number, edge?: string) {
        const scrollEl = getVirtualScrollTarget()

        if (
            scrollEl === void 0 ||
            scrollEl === null ||
            scrollEl.nodeType === 8
        ) {
            return
        }

        const scrollDetails = getScrollDetails(
            scrollEl,
            getVirtualScrollEl(),
            beforeRef.value,
            afterRef.value,
            props.virtualScrollHorizontal as boolean,
            props.virtualScrollStickySizeStart as number,
            props.virtualScrollStickySizeEnd as number
        )

        if (localScrollViewSize !== scrollDetails.scrollViewSize) {
            setVirtualScrollSize(scrollDetails.scrollViewSize)
        }

        setVirtualScrollSliceRange(
            scrollEl,
            scrollDetails,
            Math.min(
                virtualScrollLength.value - 1,
                Math.max(0, parseInt(toIndex as any, 10) || 0)
            ),
            0,
            scrollToEdges.indexOf(edge!) > -1
                ? edge
                : prevToIndex > -1 && toIndex > prevToIndex
                ? 'end'
                : 'start'
        )
    }

    function localOnVirtualScrollEvt() {
        const scrollEl = getVirtualScrollTarget()

        if (
            scrollEl === void 0 ||
            scrollEl === null ||
            scrollEl.nodeType === 8
        ) {
            return
        }

        const scrollDetails = getScrollDetails(
            scrollEl,
            getVirtualScrollEl(),
            beforeRef.value,
            afterRef.value,
            props.virtualScrollHorizontal as boolean,
            props.virtualScrollStickySizeStart as number,
            props.virtualScrollStickySizeEnd as number
        )
        const listLastIndex = virtualScrollLength.value - 1
        const listEndOffset =
            scrollDetails.scrollMaxSize -
            scrollDetails.offsetStart -
            scrollDetails.offsetEnd -
            virtualScrollPaddingAfter.value

        if (prevScrollStart === scrollDetails.scrollStart) {
            return
        }

        if (scrollDetails.scrollMaxSize <= 0) {
            setVirtualScrollSliceRange(scrollEl, scrollDetails, 0, 0)
            return
        }

        if (localScrollViewSize !== scrollDetails.scrollViewSize) {
            setVirtualScrollSize(scrollDetails.scrollViewSize)
        }

        updateVirtualScrollSizes(virtualScrollSliceRange.value.from)

        const scrollMaxStart = Math.floor(
            scrollDetails.scrollMaxSize -
                Math.max(
                    scrollDetails.scrollViewSize,
                    scrollDetails.offsetEnd
                ) -
                Math.min(
                    virtualScrollSizes[listLastIndex],
                    scrollDetails.scrollViewSize / 2
                )
        )

        if (
            scrollMaxStart > 0 &&
            Math.ceil(scrollDetails.scrollStart) >= scrollMaxStart
        ) {
            setVirtualScrollSliceRange(
                scrollEl,
                scrollDetails,
                listLastIndex,
                scrollDetails.scrollMaxSize -
                    scrollDetails.offsetEnd -
                    virtualScrollSizesAgg.reduce(sumFn, 0)
            )

            return
        }

        let toIndex = 0
        let listOffset = scrollDetails.scrollStart - scrollDetails.offsetStart
        let offset = listOffset

        if (
            listOffset <= listEndOffset &&
            listOffset + scrollDetails.scrollViewSize >=
                virtualScrollPaddingBefore.value
        ) {
            listOffset -= virtualScrollPaddingBefore.value
            toIndex = virtualScrollSliceRange.value.from
            offset = listOffset
        } else {
            for (
                let j = 0;
                listOffset >= virtualScrollSizesAgg[j] &&
                toIndex < listLastIndex;
                j++
            ) {
                listOffset -= virtualScrollSizesAgg[j]
                toIndex += aggBucketSize
            }
        }

        while (listOffset > 0 && toIndex < listLastIndex) {
            listOffset -= virtualScrollSizes[toIndex]
            if (listOffset > -scrollDetails.scrollViewSize) {
                toIndex++
                offset = listOffset
            } else {
                offset = virtualScrollSizes[toIndex] + listOffset
            }
        }

        setVirtualScrollSliceRange(scrollEl, scrollDetails, toIndex, offset)
    }

    function setVirtualScrollSliceRange(
        scrollEl: HTMLElement,
        scrollDetails: ScrollDetails,
        toIndex: number,
        offset: number,
        align?: string
    ) {
        const alignForce =
            typeof align === 'string' && align.indexOf('-force') > -1
        const alignEnd =
            alignForce === true ? align.replace('-force', '') : align
        const alignRange = alignEnd !== void 0 ? alignEnd : 'start'

        let from = Math.max(
            0,
            toIndex - virtualScrollSliceSizeComputed.value[alignRange]
        )
        let to = from + virtualScrollSliceSizeComputed.value.total

        if (to > virtualScrollLength.value) {
            to = virtualScrollLength.value
            from = Math.max(0, to - virtualScrollSliceSizeComputed.value.total)
        }

        prevScrollStart = scrollDetails.scrollStart

        const rangeChanged =
            from !== virtualScrollSliceRange.value.from ||
            to !== virtualScrollSliceRange.value.to

        if (rangeChanged === false && alignEnd === void 0) {
            emitScroll(toIndex)
            return
        }

        const { activeElement } = document
        const contentEl = contentRef.value
        if (
            rangeChanged === true &&
            contentEl !== null &&
            contentEl !== activeElement &&
            contentEl.contains(activeElement) === true
        ) {
            contentEl.addEventListener('focusout', onBlurRefocusFn)

            setTimeout(() => {
                contentEl !== null &&
                    contentEl.removeEventListener('focusout', onBlurRefocusFn)
            })
        }

        setOverflowAnchor(contentEl, toIndex - from)

        const sizeBefore =
            alignEnd !== void 0
                ? virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0)
                : 0

        if (rangeChanged === true) {
            // vue key matching algorithm works only if
            // the array of VNodes changes on only one of the ends
            // so we first change one end and then the other

            const tempTo =
                to >= virtualScrollSliceRange.value.from &&
                from <= virtualScrollSliceRange.value.to
                    ? virtualScrollSliceRange.value.to
                    : to

            virtualScrollSliceRange.value = { from, to: tempTo }
            virtualScrollPaddingBefore.value = sumSize(
                virtualScrollSizesAgg,
                virtualScrollSizes,
                0,
                from
            )
            virtualScrollPaddingAfter.value = sumSize(
                virtualScrollSizesAgg,
                virtualScrollSizes,
                to,
                virtualScrollLength.value
            )

            resetAnimationFrame(changedRangeAnimationFrameId)

            changedRangeAnimationFrameId = requestAnimationFrame(() => {
                if (
                    virtualScrollSliceRange.value.to !== to &&
                    prevScrollStart === scrollDetails.scrollStart
                ) {
                    virtualScrollSliceRange.value = {
                        from: virtualScrollSliceRange.value.from,
                        to
                    }
                    virtualScrollPaddingAfter.value = sumSize(
                        virtualScrollSizesAgg,
                        virtualScrollSizes,
                        to,
                        virtualScrollLength.value
                    )
                }
            })
        }

        resetAnimationFrame(scrollAnimationFrameId)

        scrollAnimationFrameId = requestAnimationFrame(() => {
            // if the scroll was changed give up
            // (another call to setVirtualScrollSliceRange before animation frame)
            if (prevScrollStart !== scrollDetails.scrollStart) {
                return
            }

            if (rangeChanged === true) {
                updateVirtualScrollSizes(from)
            }

            const sizeAfter = virtualScrollSizes
                .slice(from, toIndex)
                .reduce(sumFn, 0)
            const posStart =
                sizeAfter +
                scrollDetails.offsetStart +
                virtualScrollPaddingBefore.value
            const posEnd = posStart + virtualScrollSizes[toIndex]

            let scrollPosition = posStart + offset

            if (alignEnd !== void 0) {
                const sizeDiff = sizeAfter - sizeBefore
                const scrollStart = scrollDetails.scrollStart + sizeDiff

                scrollPosition =
                    alignForce !== true &&
                    scrollStart < posStart &&
                    posEnd < scrollStart + scrollDetails.scrollViewSize
                        ? scrollStart
                        : alignEnd === 'end'
                        ? posEnd - scrollDetails.scrollViewSize
                        : posStart -
                          (alignEnd === 'start'
                              ? 0
                              : Math.round(
                                    (scrollDetails.scrollViewSize -
                                        virtualScrollSizes[toIndex]) /
                                        2
                                ))
            }

            prevScrollStart = scrollPosition

            setScroll(
                scrollEl,
                scrollPosition,
                props.virtualScrollHorizontal as boolean
            )

            emitScroll(toIndex)
        })
    }

    function updateVirtualScrollSizes(from: number) {
        const contentEl = contentRef.value

        if (contentEl) {
            const children = filterProto.call(
                contentEl.children,
                (el) =>
                    el.classList &&
                    el.classList.contains('dl-virtual-scroll--skip') === false
            )
            const childrenLength = children.length
            const sizeFn =
                props.virtualScrollHorizontal === true
                    ? (el: HTMLElement) => el.getBoundingClientRect().width
                    : (el: HTMLElement) => el.offsetHeight

            let index = from
            let size
            let diff

            for (let i = 0; i < childrenLength; ) {
                size = sizeFn(children[i])
                i++

                while (
                    i < childrenLength &&
                    children[i].classList.contains(
                        'dl-virtual-scroll--with-prev'
                    ) === true
                ) {
                    size += sizeFn(children[i])
                    i++
                }

                diff = size - virtualScrollSizes[index]

                if (diff !== 0) {
                    virtualScrollSizes[index] += diff
                    virtualScrollSizesAgg[Math.floor(index / aggBucketSize)] +=
                        diff
                }

                index++
            }
        }
    }

    function onBlurRefocusFn() {
        contentRef.value !== null &&
            contentRef.value !== void 0 &&
            contentRef.value.focus()
    }

    function localResetVirtualScroll(toIndex?: number, fullReset?: boolean) {
        const defaultSize = 1 * virtualScrollItemSizeComputed.value

        if (fullReset === true || Array.isArray(virtualScrollSizes) === false) {
            virtualScrollSizes = []
        }

        const oldVirtualScrollSizesLength = virtualScrollSizes.length

        virtualScrollSizes.length = virtualScrollLength.value

        for (
            let i = virtualScrollLength.value - 1;
            i >= oldVirtualScrollSizesLength;
            i--
        ) {
            virtualScrollSizes[i] = defaultSize
        }

        const jMax = Math.floor((virtualScrollLength.value - 1) / aggBucketSize)
        virtualScrollSizesAgg = []
        for (let j = 0; j <= jMax; j++) {
            let size = 0
            const iMax = Math.min(
                (j + 1) * aggBucketSize,
                virtualScrollLength.value
            )
            for (let i = j * aggBucketSize; i < iMax; i++) {
                size += virtualScrollSizes[i]
            }
            virtualScrollSizesAgg.push(size)
        }

        prevToIndex = -1
        prevScrollStart = void 0

        virtualScrollPaddingBefore.value = sumSize(
            virtualScrollSizesAgg,
            virtualScrollSizes,
            0,
            virtualScrollSliceRange.value.from
        )
        virtualScrollPaddingAfter.value = sumSize(
            virtualScrollSizesAgg,
            virtualScrollSizes,
            virtualScrollSliceRange.value.to,
            virtualScrollLength.value
        )

        if (toIndex >= 0) {
            updateVirtualScrollSizes(virtualScrollSliceRange.value.from)
            nextTick(() => {
                scrollTo(toIndex)
            })
        } else {
            onVirtualScrollEvt()
        }
    }

    function setVirtualScrollSize(scrollViewSize?: number) {
        if (scrollViewSize === void 0 && typeof window !== 'undefined') {
            const scrollEl = getVirtualScrollTarget()

            if (
                scrollEl !== void 0 &&
                scrollEl !== null &&
                scrollEl.nodeType !== 8
            ) {
                scrollViewSize = getScrollDetails(
                    scrollEl,
                    getVirtualScrollEl(),
                    beforeRef.value,
                    afterRef.value,
                    props.virtualScrollHorizontal as boolean,
                    props.virtualScrollStickySizeStart as number,
                    props.virtualScrollStickySizeEnd as number
                ).scrollViewSize
            }
        }

        localScrollViewSize = scrollViewSize

        const virtualScrollSliceRatioBefore =
            parseFloat(props.virtualScrollSliceRatioBefore as string) || 0
        const virtualScrollSliceRatioAfter =
            parseFloat(props.virtualScrollSliceRatioAfter as string) || 0
        const multiplier =
            1 + virtualScrollSliceRatioBefore + virtualScrollSliceRatioAfter
        const view =
            scrollViewSize === void 0 || scrollViewSize <= 0
                ? 1
                : Math.ceil(
                      scrollViewSize / virtualScrollItemSizeComputed!.value
                  )

        const baseSize = Math.max(
            1,
            view,
            Math.ceil(
                ((props.virtualScrollSliceSize as number) > 0
                    ? (props.virtualScrollSliceSize as number)
                    : 10) / multiplier
            )
        )

        virtualScrollSliceSizeComputed.value = {
            total: Math.ceil(baseSize * multiplier),
            start: Math.ceil(baseSize * virtualScrollSliceRatioBefore),
            center: Math.ceil(baseSize * (0.5 + virtualScrollSliceRatioBefore)),
            end: Math.ceil(baseSize * (1 + virtualScrollSliceRatioBefore)),
            view
        }
    }

    function padVirtualScroll(
        tag: string,
        content: any[],
        create: Function,
        styles: GridStyles
    ) {
        const paddingSize =
            props.virtualScrollHorizontal === true ? 'width' : 'height'

        const style = {
            ['--dl-virtual-scroll-item-' + paddingSize]:
                virtualScrollItemSizeComputed.value + 'px'
        }

        return [
            tag === 'tbody'
                ? create(
                      tag,
                      {
                          class: 'dl-virtual-scroll__padding',
                          key: 'before',
                          ref: beforeRef
                      },
                      [
                          create('tr', [
                              create('td', {
                                  style: {
                                      [paddingSize]: `${virtualScrollPaddingBefore.value}px`,
                                      ...style
                                  },
                                  colspan: colspanAttr.value,
                                  attrs: {
                                      colspan: colspanAttr.value
                                  }
                              })
                          ])
                      ]
                  )
                : create(tag, {
                      class: 'dl-virtual-scroll__padding',
                      key: 'before',
                      ref: beforeRef,
                      style: {
                          [paddingSize]: `${virtualScrollPaddingBefore.value}px`,
                          ...style
                      }
                  }),

            create(
                tag,
                {
                    class: `dl-virtual-scroll__content ${styles?.gridClass}`,
                    style: styles?.gridStyles,
                    key: 'content',
                    ref: styles ? 'grid' : contentRef,
                    tabindex: -1
                },
                content.flat()
            ),

            tag === 'tbody'
                ? create(
                      tag,
                      {
                          class: 'dl-virtual-scroll__padding',
                          key: 'after',
                          ref: afterRef
                      },
                      [
                          create('tr', [
                              create('td', {
                                  style: {
                                      [paddingSize]: `${virtualScrollPaddingAfter.value}px`,
                                      ...style
                                  },
                                  colspan: colspanAttr.value,
                                  attrs: {
                                      colspan: colspanAttr.value
                                  }
                              })
                          ])
                      ]
                  )
                : create(tag, {
                      class: 'dl-virtual-scroll__padding',
                      key: 'after',
                      ref: afterRef,
                      style: {
                          [paddingSize]: `${virtualScrollPaddingAfter.value}px`,
                          ...style
                      }
                  })
        ]
    }

    function emitScroll(index: number) {
        if (prevToIndex !== index) {
            emit('virtual-scroll', {
                index,
                from: virtualScrollSliceRange.value.from,
                to: virtualScrollSliceRange.value.to - 1,
                direction: index < prevToIndex ? 'decrease' : 'increase',
                ref: proxy
            })

            prevToIndex = index
        }
    }

    setVirtualScrollSize()
    const onVirtualScrollEvt = debounce(
        localOnVirtualScrollEvt,
        debounceValue ?? 100
    )

    onBeforeMount(() => {
        setVirtualScrollSize()
    })

    let shouldActivate = false

    onDeactivated(() => {
        shouldActivate = true
    })

    onActivated(() => {
        if (shouldActivate !== true) {
            return
        }

        const scrollEl = getVirtualScrollTarget()

        if (
            prevScrollStart !== void 0 &&
            scrollEl !== void 0 &&
            scrollEl !== null &&
            scrollEl.nodeType !== 8
        ) {
            setScroll(
                scrollEl,
                prevScrollStart,
                props.virtualScrollHorizontal as boolean
            )
        } else {
            scrollTo(prevToIndex)
        }
    })

    onBeforeUnmount(() => {
        onVirtualScrollEvt.cancel()
    })

    // expose public methods
    Object.assign(proxy, { scrollTo, reset, refresh })

    return {
        virtualScrollSliceRange,
        virtualScrollSliceSizeComputed,

        setVirtualScrollSize,
        onVirtualScrollEvt,
        localResetVirtualScroll,
        padVirtualScroll,

        scrollTo,
        reset,
        refresh
    }
}
