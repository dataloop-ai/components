import { nextTick, ref, Ref } from 'vue-demi'
import { isEllipsisActive } from '../utils/is-ellipsis-active'

/**
 * Truncation check done on demand (pointerenter) instead of a ResizeObserver
 * per element. Meant for elements rendered in large numbers, like table cells.
 */
export function useLazyEllipsis(elRef: Ref<HTMLElement | null>) {
    const hasEllipsis = ref(false)

    const onPointerEnter = () => {
        const el = elRef.value
        if (!el) return
        const truncated = isEllipsisActive(el)
        if (truncated === hasEllipsis.value) return
        hasEllipsis.value = truncated
        // the tooltip binds its own mouseenter listener when it mounts,
        // which happens after the pointer is already inside the element
        if (truncated) {
            nextTick(() => el.dispatchEvent(new MouseEvent('mouseenter')))
        }
    }

    return { hasEllipsis, onPointerEnter }
}
