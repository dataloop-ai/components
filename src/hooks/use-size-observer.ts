import { onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue-demi'
import { isEllipsisActive } from '../utils/is-ellipsis-active'
import { get } from 'lodash'

export function useSizeObserver(elRef: Ref, ...refsToWatch: any[]) {
    const entryLevel = 'target'
    const widthRef = ref(0)
    const heightRef = ref(0)
    const hasEllipsis = ref(false)
    const borderBoxSize = ref(null)
    const disposing = ref(false)

    const calcEllipsis = (el: HTMLElement) => {
        hasEllipsis.value = isEllipsisActive(el)
    }
    const resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                hasEllipsis.value = isEllipsisActive(get(entry, entryLevel))
                widthRef.value = entry.contentRect.width
                heightRef.value = entry.contentRect.height
                borderBoxSize.value = entry.borderBoxSize
            }
        }
    )

    watch(elRef, () => {
        if (disposing.value) {
            return
        }
        if (elRef.value) {
            calcEllipsis(elRef.value)
        }
    })
    for (const ref of refsToWatch) {
        watch(ref, () => {
            if (disposing.value) {
                return
            }
            if (elRef.value) {
                calcEllipsis(elRef.value)
            }
        })
    }

    onMounted(() => {
        if (elRef.value) {
            resizeObserver.observe(elRef.value)
        }
    })
    onBeforeUnmount(() => {
        disposing.value = true
        if (elRef.value) {
            resizeObserver.unobserve(elRef.value)
        }
    })

    return {
        widthRef,
        heightRef,
        hasEllipsis,
        borderBoxSize
    }
}
