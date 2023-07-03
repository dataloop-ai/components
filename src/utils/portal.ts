import { getParentVm } from './vm'

export const portalList: any = []

export function getPortalVm(el: HTMLElement) {
    return portalList.find(
        (vm: any) =>
            vm.__dlPortalInnerRef.value !== null &&
            vm.__dlPortalInnerRef.value.contains(el)
    )
}

export function closePortalMenus(vm: any, evt: Event) {
    do {
        if (vm.$options.name === 'DlMenu') {
            vm.hide(evt)

            // is this a point of separation?
            if (vm.$props.separateClosePopup === true) {
                return getParentVm(vm)
            }
        } else if (vm.__dlPortalInnerRef) {
            // treat it as point of separation if parent is DlPopupProxy
            // (so mobile matches desktop behavior)
            // and hide it too
            const parent = getParentVm(vm)

            if (parent && parent.$options.name === 'DlPopupProxy') {
                vm.hide(evt)
                return parent
            } else {
                return vm
            }
        }

        vm = getParentVm(vm)
    } while (vm)
}

export function closePortals(vm: any, evt: Event, depth: number) {
    while (depth !== 0 && vm) {
        if (vm.__dlPortalInnerRef) {
            depth--

            if (vm.$options.name === 'DlMenu') {
                vm = closePortalMenus(vm, evt)
                continue
            }

            vm.hide(evt)
        }

        vm = getParentVm(vm)
    }
}
