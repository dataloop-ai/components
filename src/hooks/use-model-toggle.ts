import {
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
    Ref,
    PropType,
    isVue2
} from 'vue-demi'

const modelValueNaming = isVue2 ? 'model-value' : 'modelValue'

const staticUseModelToggleProps: any = {
    modelValue: {
        type: Boolean as PropType<boolean>,
        default: false
    }
}

staticUseModelToggleProps[`onUpdate:${modelValueNaming}`] = [Function, Array]

export const useModelToggleProps = staticUseModelToggleProps as {
    modelValue: {
        type: PropType<boolean>
        default: boolean
    }
    'onUpdate:model-value': (FunctionConstructor | ArrayConstructor)[]
}

export const useModelToggleEmits = [
    'before-show',
    'show',
    'before-hide',
    'hide',
    'update:mode-value'
]

export interface AnchorEvent extends KeyboardEvent {
    dlAnchorHandled?: boolean
}

// handleShow/handleHide -> removeTick(), self (& emit show)

export default function ({
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
            (evt !== void 0 && evt.dlAnchorHandled === true) ||
            (canShow !== void 0 && canShow(evt) !== true)
        ) {
            return
        }

        const listener =
            props[`onUpdate:${modelValueNaming}`] !== void 0 ||
            (vm!.proxy! as any)?.$listeners?.[`update:${modelValueNaming}`] !==
                void 0

        if (listener === true) {
            emit(`update:${modelValueNaming}`, true)
            payload = evt

            nextTick(() => {
                if (payload === evt) {
                    payload = void 0
                }
            })
        }

        if (!props.modelValue || listener === false) {
            processShow(evt)
        }
    }

    function processShow(evt: AnchorEvent) {
        if (showing.value === true) {
            return
        }

        showing.value = true

        emit('before-show', evt)

        if (handleShow !== void 0) {
            handleShow(evt)
        } else {
            emit('show', evt)
        }
    }

    function hide(evt: AnchorEvent) {
        if (props.disabled === true) {
            return
        }

        const listener =
            props[`onUpdate:${modelValueNaming}`] !== void 0 ||
            (vm!.proxy! as any)?.$listeners?.[`update:${modelValueNaming}`] !==
                void 0

        if (listener === true) {
            emit(`update:${modelValueNaming}`, false)
            payload = evt
            nextTick(() => {
                if (payload === evt) {
                    payload = void 0
                }
            })
        }

        if (!props.modelValue || listener === false) {
            processHide(evt)
        }
    }

    function processHide(evt: AnchorEvent) {
        if (!showing.value) {
            return
        }

        showing.value = false

        emit('before-hide', evt)

        if (handleHide !== void 0) {
            handleHide(evt)
        } else {
            emit('hide', evt)
        }
    }

    function processModelChange(val: boolean) {
        if (props.disabled === true && val === true) {
            if (props[`onUpdate:${modelValueNaming}`] !== void 0) {
                emit(`update:${modelValueNaming}`, false)
            }
        } else if ((val === true) !== showing.value) {
            const fn = val === true ? processShow : processHide
            fn(payload as AnchorEvent)
        }
    }

    watch(() => props.modelValue as boolean, processModelChange, { deep: true })

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
