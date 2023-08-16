export * from './types'

export type DlVirtualScrollEvent = {
    index: number
    from: number
    to: number
    direction: 'decrease' | 'increase'
    ref: any // A reference to the vue proxy component
}
