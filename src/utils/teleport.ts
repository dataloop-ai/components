import * as VueDemi from 'vue-demi'
// @ts-ignore
import Teleport2 from 'vue2-teleport'

let DlTeleport: any

if (VueDemi.isVue2) {
    DlTeleport = Teleport2
} else if (VueDemi.isVue3) {
    const v: any = VueDemi
    DlTeleport = v.Teleport
}

export default DlTeleport
