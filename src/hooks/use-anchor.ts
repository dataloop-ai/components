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

interface AnchorElements {
    hide: Function
    toggle?: Function
    toggleKey: Function
    contextClick: Function
    prevent: Function
}

export const useAnchorProps = {
    target: {
        type: [String, Boolean],
        default: true
    },
    noParentEvent: Boolean,
    contextMenu: Boolean
}

export function CheckAnchorElVisibility(
    domElement: any,
    options: { triggerPercentage?: number } = {}
) {
    const { triggerPercentage } = options
    const intersectionRatio = triggerPercentage ?? 1
    return new Promise((resolve) => {
        const o = new IntersectionObserver(([entry]) => {
            resolve(entry.intersectionRatio >= intersectionRatio)
            o.disconnect()
        })
        o.observe(domElement)
    })
}

export default function useAnchor(
    options: {
        configureAnchorEl?: Function
        toggleKey?: string | number
        ignoreEvents?: string | string[]
    } = {}
) {
    const { props, proxy, emit } = getCurrentInstance()!
    const { toggleKey } = options
    let { configureAnchorEl, ignoreEvents } = options

    const anchorEl: Ref<HTMLElement | Element | null> = ref(null)

    let touchTimer: number

    function canShow(evt: TouchEvent) {
        // abort with no parent configured or on multi-touch
        return anchorEl?.value === null
            ? false
            : !evt || !evt.touches || evt.touches.length <= 1
    }

    const anchorEvents: Partial<AnchorElements> = {}

    if (!configureAnchorEl && proxy) {
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
                if (isKeyCode(evt, toggleKey) && anchorEvents.toggle) {
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

            let evts: any[]

            const filteredEvents = (events: string[]) => {
                if (!ignoreEvents) {
                    return events
                }

                ignoreEvents = Array.isArray(ignoreEvents)
                    ? ignoreEvents
                    : [ignoreEvents]

                return events.filter((evt) => ignoreEvents.includes(evt))
            }

            if (context === true) {
                evts = [
                    [
                        anchorEl.value,
                        ...filteredEvents(['mousedown', 'hide', 'passive'])
                    ],
                    [
                        anchorEl.value,
                        ...filteredEvents([
                            'contextmenu',
                            'contextClick',
                            'notPassive'
                        ])
                    ]
                ]
            } else {
                evts = [
                    [
                        anchorEl.value,
                        ...filteredEvents(['click', 'toggle', 'passive'])
                    ],
                    [
                        anchorEl.value,
                        ...filteredEvents(['keyup', 'toggleKey', 'passive'])
                    ]
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
                    el = null
                }
            }

            if (el) {
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
            emit('update:model-value', false)
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
