import { ComputedRef } from 'vue-demi'

export type DlVirtualScrollParamsType = {
    virtualScrollLength: ComputedRef<number>
    getVirtualScrollTarget: () => HTMLElement | undefined
    getVirtualScrollEl: () => HTMLElement
    virtualScrollItemSizeComputed?: ComputedRef<number>
    debounceValue?: number
    preventScrollTo?: boolean
}
