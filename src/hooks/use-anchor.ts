import {
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    getCurrentInstance,
    Ref
} from 'vue-demi'

import { addEvt, cleanEvt, prevent } from '../utils/events'
import { isKeyCode } from '../utils/key-composition'

interface AnchorEvent extends KeyboardEvent {
    dlAnchorHandled?: boolean
}

export const useAnchorProps = {
    target: {
        default: true
    },
    noParentEvent: Boolean,
    contextMenu: Boolean
}

export default function ({
    configureAnchorEl
}: {
    configureAnchorEl?: Function
}) {
    const { props, proxy, emit } = getCurrentInstance()!

    const anchorEl: Ref<HTMLElement | Element | null> = ref(null)

    let touchTimer: number

    function canShow(evt: TouchEvent) {
        // abort with no parent configured or on multi-touch
        return anchorEl?.value === null
            ? false
            : evt === void 0 ||
                  evt.touches === void 0 ||
                  evt.touches.length <= 1
    }

    interface AnchorElements {
        hide: Function
        toggle?: Function
        toggleKey: Function
        contextClick: Function
        prevent: Function
    }

    const anchorEvents: Partial<AnchorElements> = {}

    if (configureAnchorEl === void 0 && proxy) {
        // default configureAnchorEl is designed for
        // DlMenu & DlPopupProxy (which is why it's handled here)

        Object.assign(anchorEvents, {
            hide(evt: Event) {
                // @ts-ignore
                proxy.hide(evt)
            },

            toggle(evt: AnchorEvent) {
                // @ts-ignore
                proxy.toggle(evt)
                evt.dlAnchorHandled = true
            },

            toggleKey(evt: AnchorEvent) {
                if (isKeyCode(evt, 13) && anchorEvents.toggle !== void 0) {
                    anchorEvents.toggle(evt)
                }
            },

            contextClick(evt: AnchorEvent) {
                // @ts-ignore
                proxy.hide(evt)
                prevent(evt)
                nextTick(() => {
                    // @ts-ignore
                    proxy.show(evt)
                    evt.dlAnchorHandled = true
                })
            },

            prevent
        })

        configureAnchorEl = function (context = props.contextMenu) {
            if (props.noParentEvent === true || anchorEl.value === null) {
                return
            }

            let evts

            if (context === true) {
                evts = [
                    [anchorEl.value, 'mousedown', 'hide', 'passive'],
                    [
                        anchorEl.value,
                        'contextmenu',
                        'contextClick',
                        'notPassive'
                    ]
                ]
            } else {
                evts = [
                    [anchorEl.value, 'click', 'toggle', 'passive'],
                    [anchorEl.value, 'keyup', 'toggleKey', 'passive']
                ]
            }

            addEvt(anchorEvents, 'anchor', evts as string[][])
        }
    }

    function unconfigureAnchorEl() {
        cleanEvt(anchorEvents, 'anchor')
    }

    function setAnchorEl(el: HTMLElement | null) {
        if (!el) return
        anchorEl.value = el
        while (
            (anchorEl.value as HTMLElement).classList.contains(
                'dl-anchor--skip'
            )
        ) {
            anchorEl.value = (anchorEl.value as HTMLElement)
                .parentNode as HTMLElement
        }
        if (configureAnchorEl) {
            configureAnchorEl()
        }
    }

    function pickAnchorEl() {
        if (props.target === false || props.target === '') {
            anchorEl.value = null
        } else if (props.target === true && proxy) {
            setAnchorEl(proxy.$el.parentNode as HTMLElement)
        } else {
            let el = props.target

            if (typeof props.target === 'string') {
                try {
                    el = document.querySelector(props.target)
                } catch (err) {
                    el = void 0
                }
            }

            if (el !== void 0 && el !== null) {
                anchorEl.value = (el as any).$el || el // cannot use VUE type to work on both vue versions, so let it be any
                if (configureAnchorEl) {
                    configureAnchorEl()
                }
            } else {
                anchorEl.value = null
            }
        }
    }

    watch(
        () => props.contextMenu,
        (val) => {
            if (anchorEl.value !== null) {
                unconfigureAnchorEl()
                if (configureAnchorEl) {
                    configureAnchorEl(val)
                }
            }
        }
    )

    watch(
        () => props.target,
        () => {
            if (anchorEl.value !== null) {
                unconfigureAnchorEl()
            }

            pickAnchorEl()
        }
    )

    watch(
        () => props.noParentEvent,
        (val) => {
            if (anchorEl.value !== null) {
                if (val === true) {
                    unconfigureAnchorEl()
                } else {
                    if (configureAnchorEl) {
                        configureAnchorEl()
                    }
                }
            }
        }
    )

    onMounted(() => {
        pickAnchorEl()

        if (props.modelValue === true && anchorEl.value === null) {
            emit('update:modelValue', false)
        }
    })

    onBeforeUnmount(() => {
        clearTimeout(touchTimer)
        unconfigureAnchorEl()
    })

    return {
        anchorEl,
        canShow,
        anchorEvents
    }
}
