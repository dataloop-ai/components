import { ComputedRef } from 'vue-demi'

export type VirtualScrollParamsType = {
    virtualScrollLength: ComputedRef<number>
    getVirtualScrollTarget: () => HTMLElement | undefined
    getVirtualScrollEl: () => HTMLElement
    virtualScrollItemSizeComputed?: ComputedRef<number>
    debounceValue?: number
}
