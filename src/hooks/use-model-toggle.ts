import { watch, nextTick, onMounted, getCurrentInstance, Ref } from 'vue-demi'

export const useModelToggleProps = {
    modelValue: Boolean
}

export const useModelToggleEmits = [
    'before-show',
    'show',
    'before-hide',
    'hide',
    'update:model-value'
]

export interface AnchorEvent extends KeyboardEvent {
    dlAnchorHandled?: boolean
}

export default function useModelToggle({
    showing,
    canShow, // optional
    handleShow, // optional
    handleHide, // optional
    processOnMount // optional
}: {
    showing: Ref<boolean>
    canShow: Function
    handleShow: Function
    handleHide: Function
    processOnMount: boolean
}) {
    const vm = getCurrentInstance()!
    const { props, emit, proxy } = vm

    let payload: AnchorEvent | undefined

    function toggle(evt: AnchorEvent) {
        if (showing.value === true) {
            hide(evt)
        } else {
            show(evt)
        }
    }

    function show(evt: AnchorEvent) {
        if (
            props.disabled === true ||
            (evt && evt.dlAnchorHandled === true) ||
            (canShow && canShow(evt) !== true)
        ) {
            return
        }

        emit(`update:model-value`, true)
        payload = evt

        nextTick(() => {
            if (payload === evt) {
                payload = null
            }
        })

        if (!props.modelValue) {
            processShow(evt)
        }
    }

    function processShow(evt: AnchorEvent) {
        if (showing.value === true) {
            return
        }

        showing.value = true

        emit('before-show', evt)

        if (handleShow) {
            handleShow(evt)
        } else {
            emit('show', evt)
        }
    }

    function hide(evt?: AnchorEvent) {
        if (props.disabled === true) {
            return
        }

        emit(`update:model-value`, false)
        payload = evt
        nextTick(() => {
            if (payload === evt) {
                payload = null
            }
        })

        if (!props.modelValue) {
            processHide(evt)
        }
    }

    function processHide(evt?: AnchorEvent) {
        if (!showing.value) {
            return
        }

        showing.value = false

        emit('before-hide', evt)

        if (handleHide) {
            handleHide(evt)
        } else {
            emit('hide', evt)
        }
    }

    function processModelChange(val: boolean) {
        if (props.disabled === true && val === true) {
            emit(`update:model-value`, false)
        } else if (val !== showing.value) {
            const fn = val === true ? processShow : processHide
            fn(payload as AnchorEvent)
        }
    }

    watch(
        () => props.modelValue as boolean,
        (val) => processModelChange(val)
    )

    if (processOnMount) {
        onMounted(() => {
            return processModelChange(props.modelValue as boolean)
        })
    }

    // expose public methods
    const publicMethods = { show, hide, toggle }
    Object.assign(proxy!, publicMethods)

    return publicMethods
}
