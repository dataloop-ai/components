import { ComputedRef } from 'vue-demi'

export type VirtualScrollParamsType = {
    dynamicId: ComputedRef<string>
    virtualScrollLength: ComputedRef<number>
    getVirtualScrollTarget: () => HTMLElement | undefined
    getVirtualScrollEl: () => HTMLElement
    virtualScrollItemSizeComputed?: ComputedRef<number>
    debounceValue?: number
}
