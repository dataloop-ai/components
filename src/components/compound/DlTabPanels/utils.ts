import { isVue2, VNode } from 'vue-demi'

export const getSlot = (isVue2: boolean, slot: any) => {
    if (isVue2 && typeof slot !== 'function') {
        return slot
    }
    return slot()
}

export const getChildrenFromSlot = (slot?: any): VNode[] => {
    if (typeof slot !== 'undefined') {
        const newSlot = getSlot(isVue2, slot)
        if (isVue2) {
            return newSlot
        }
        return Array.from(newSlot[0].children as VNode[])
    }
    return []
}
