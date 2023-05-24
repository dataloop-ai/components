import { isVue2, h } from 'vue-demi'

export const createElement = (
    renderFn: Function,
    el: any,
    opts: any = {},
    slots: any
) => {
    if (isVue2) {
        return renderFn(el, opts, slots)
    }

    return h(el, opts, slots)
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
export function mergeSlot(slot: any, source: any) {
    return slot !== void 0 ? source.concat(slot()) : source
}

export const hSlot = (
    slots: any,
    elements: any = [],
    slotName: string = 'default'
) => {
    let renderSlots = isVue2 ? slots[slotName] || [] : slots[slotName]?.() || []

    if (elements.length > 0) renderSlots = renderSlots.concat(elements)
    if (isVue2) {
        return renderSlots
    }
    return () => renderSlots
}

export const textSlot = (slots: any, slotName: string = 'default') => {
    if (isVue2) {
        return slots[slotName]
    }

    return slots[slotName]?.()
}
