import { isVue2 } from 'vue-demi'

const getSlotByVersion = (slot: any) => {
    if (!slot) return slot
    if (isVue2) {
        return () => slot
    }
    return slot
}

export default getSlotByVersion
