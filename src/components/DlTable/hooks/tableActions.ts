import { isVue2, computed } from 'vue-demi'

export const useTableActionsV2Props = {
    rowClick: {
        type: Function,
        default: null as Function | null
    },
    rowDblclick: {
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
    onRowDblclick: {
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

export function useTableActions(props: any) {
    const hasClickEvent = computed(() =>
        Boolean(props.onRowClick || props.rowClick)
    )

    const hasDblClickEvent = computed(() =>
        Boolean(props.onRowDblclick || props.rowDblclick)
    )

    const hasContextMenuEvent = computed(() =>
        Boolean(props.onRowContextmenu || props.rowContextmenu)
    )

    const hasAnyAction = computed(() =>
        [
            hasClickEvent.value,
            hasDblClickEvent.value,
            hasContextMenuEvent.value
        ].some((item) => item === true)
    )

    return {
        hasClickEvent,
        hasDblClickEvent,
        hasContextMenuEvent,
        hasAnyAction
    }
}
