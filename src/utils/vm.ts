// used directly by docs too
export function getParentVm(vm: any) {
    if (Object(vm?.$parent) === vm?.$parent) {
        return vm.$parent
    }

    vm = vm.$?.parent

    while (Object(vm) === vm) {
        if (Object(vm.proxy) === vm.proxy) {
            return vm.proxy
        }

        vm = vm?.parent
    }
}
