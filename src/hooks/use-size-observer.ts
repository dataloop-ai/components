import { onBeforeUnmount, onMounted, ref, Ref } from 'vue-demi'
import { isEllipsisActive } from '../utils/is-ellipsis-active'

export function useSizeObserver(elRef: Ref) {
    const widthRef = ref(0)
    const heightRef = ref(0)
    const hasEllipsis = ref(false)
    const borderBoxSize = ref(null)
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            hasEllipsis.value = isEllipsisActive(entry.target)
            widthRef.value = entry.contentRect.width
            heightRef.value = entry.contentRect.height
            borderBoxSize.value = entry.borderBoxSize
        }
    })

    onMounted(() => elRef.value && resizeObserver.observe(elRef.value))
    onBeforeUnmount(() => elRef.value && resizeObserver.unobserve(elRef.value))

    return {
        widthRef,
        heightRef,
        hasEllipsis,
        borderBoxSize
    }
}
