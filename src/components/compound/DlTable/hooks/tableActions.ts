import { isVue2, computed } from 'vue-demi'

export const useTableActionsV2Props = {
    rowClick: {
        type: Function,
        default: null as Function | null
    },
    rowDoubleClick: {
        type: Function,
        default: null as Function | null
    },
    rowContextmenu: {
        type: Function,
        default: null as Function | null
    }
}

export const useTableActionsV3Props = {
    onRowClick: {
        type: Function,
        default: null as Function | null
    },
    onRowDoubleClick: {
        type: Function,
        default: null as Function | null
    },
    onRowContextmenu: {
        type: Function,
        default: null as Function | null
    }
}

export const useTableActionsProps = isVue2
    ? useTableActionsV2Props
    : useTableActionsV3Props

const toHandlerKey = (event: string) =>
    'on' +
    event
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

/**
 * Whether the parent bound a listener for `event` (kebab-case),
 * on Vue 2 ($listeners) and Vue 3 (vnode props).
 */
export function hasListener(vm: any, event: string) {
    if (!vm) return false
    if (isVue2) {
        return !!vm.proxy?.$listeners?.[event]
    }
    const vnodeProps = vm.vnode?.props || {}
    const key = toHandlerKey(event)
    return !!(vnodeProps[key] || vnodeProps[key + 'Once'])
}

export function useTableActions(props: any, vm?: any) {
    const hasClickEvent = computed(
        () =>
            !!(props.onRowClick || props.rowClick) ||
            hasListener(vm, 'row-click')
    )

    const hasDblClickEvent = computed(
        () =>
            !!(props.onRowDoubleClick || props.rowDoubleClick) ||
            hasListener(vm, 'row-dblclick')
    )

    const hasContextMenuEvent = computed(
        () =>
            !!(props.onRowContextmenu || props.rowContextmenu) ||
            hasListener(vm, 'row-contextmenu')
    )

    const hasAnyAction = computed(
        () =>
            hasClickEvent.value ||
            hasDblClickEvent.value ||
            hasContextMenuEvent.value
    )

    return {
        hasClickEvent,
        hasDblClickEvent,
        hasContextMenuEvent,
        hasAnyAction
    }
}
