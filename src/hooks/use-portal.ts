import { ref, onUnmounted, Ref, ComponentInternalInstance } from 'vue-demi'

import { addFocusWaitFlag, removeFocusWaitFlag } from '../utils/focus-manager'
import { createGlobalNode, removeGlobalNode } from '../utils/global-nodes'
import { portalList } from '../utils/portal'

function isOnGlobalDialog(vm: any) {
    vm = vm.parent

    while (vm !== void 0 && vm !== null) {
        if (vm.type.name === 'DlGlobalDialog') {
            return true
        }
        if (vm.type.name === 'DlDialog' || vm.type.name === 'DlMenu') {
            return false
        }

        vm = vm.parent
    }

    return false
}

// Warning!
// You MUST specify "inheritAttrs: false" in your component

export default function (
    vm: ComponentInternalInstance | null,
    innerRef: Ref<HTMLElement | null>,
    checkGlobalDialog = false,
    config: {
        parentId?: string
        parentClass?: string
        parentStyle?: string
    } = {}
) {
    // showing, including while in show/hide transition
    const portalIsActive = ref(false)

    const { proxy } = vm!
    const { parentId, parentClass, parentStyle } = config

    // showing & not in any show/hide transition
    const portalIsAccessible = ref(false)

    // let portalEl = null
    const portalEl: any = ref(null)
    const focusObj = {}
    const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm)

    function showPortal(isReady = false) {
        if (isReady === true) {
            removeFocusWaitFlag(focusObj)
            portalIsAccessible.value = true
            return
        }

        portalIsAccessible.value = false

        if (portalIsActive.value === false) {
            if (onGlobalDialog === false && portalEl.value === null) {
                portalEl.value = createGlobalNode(parentId)
                portalEl.value.className =
                    portalEl.value.className + (parentClass || '')
                portalEl.value.style.cssText =
                    portalEl.value.style.cssText + (parentStyle || '')
            }

            portalIsActive.value = true

            // register portal
            portalList.push(proxy!)

            addFocusWaitFlag(focusObj)
        }
    }

    function hidePortal(isReady = false) {
        portalIsAccessible.value = false

        if (isReady !== true) {
            return
        }

        removeFocusWaitFlag(focusObj)
        portalIsActive.value = false

        // unregister portal
        const index = portalList.indexOf(proxy!)
        if (index > -1) {
            portalList.splice(index, 1)
        }

        if (portalEl.value !== null) {
            removeGlobalNode(portalEl.value)
            portalEl.value = null
        }
    }

    onUnmounted(() => {
        hidePortal(true)
    })

    // expose publicly needed stuff for portal utils
    Object.assign(proxy!, { __dlPortalInnerRef: innerRef })

    return {
        showPortal,
        hidePortal,
        portalEl,
        portalIsActive,
        portalIsAccessible
    }
}
