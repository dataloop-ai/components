<template>
    <dl-teleport
        v-if="portalIsActive"
        :to="portalEl"
    >
        <transition
            name="fade"
            appear
        >
            <div
                v-if="showing"
                :id="uuid"
                ref="innerRef"
                tabIndex="-1"
                :class="classes"
                :style="styles"
                @click="onClick"
            >
                <slot />
            </div>
        </transition>
    </dl-teleport>
</template>

<script lang="ts">
import {
    h as _h,
    defineComponent,
    onBeforeUnmount,
    getCurrentInstance,
    ref,
    watch,
    computed,
    PropType,
    Ref,
    isVue2,
    toRefs
} from 'vue-demi'

import useWindowSize from '../../../hooks/use-window-size'
import useAnchor, {
    CheckAnchorElVisibility,
    useAnchorProps
} from '../../../hooks/use-anchor'
import useScrollTarget from '../../../hooks/use-scroll-target'
import useModelToggle, {
    useModelToggleProps,
    useModelToggleEmits,
    AnchorEvent
} from '../../../hooks/use-model-toggle'
import usePortal from '../../../hooks/use-portal'
import useTransition, {
    useTransitionProps
} from '../../../hooks/use-transition'
import useTick from '../../../hooks/use-tick'
import useTimeout from '../../../hooks/use-timeout'

import { closePortalMenus } from '../../../utils/portal'
import { getScrollTarget } from '../../../utils/scroll'
import DlTeleport from '../../../utils/teleport'
import { removeEscapeKey } from '../../../utils/escape-key'
import {
    removeClickOutside,
    ClickOutsideEvent
} from '../../../utils/click-outside'
import { addFocusFn } from '../../../utils/focus-manager'

import {
    validatePosition,
    validateOffset,
    setPosition,
    parsePosition
} from '../../../utils/position-engine'
import {
    handleClickOutside,
    getAnchorOrigin,
    handleWatcherEvents,
    setOffsetOnShow,
    avoidAutoCloseFn,
    updateUnwatchPosition,
    refocusTargetFn,
    conditionalHandler
} from './utils'
import { isMobileOrTablet } from '../../../utils'
import { v4 } from 'uuid'
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation'

export default defineComponent({
    name: 'DlMenu',
    components: {
        DlTeleport
    },
    inheritAttrs: false,
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        ...useAnchorProps,
        ...useModelToggleProps,
        ...useTransitionProps,
        disabled: Boolean,
        persistent: Boolean,
        autoClose: Boolean,

        noRefocus: Boolean,

        fitContainer: Boolean,
        fitContent: Boolean,
        cover: Boolean,

        square: Boolean,

        anchor: {
            type: String,
            default: 'bottom left',
            validator: validatePosition
        },
        self: {
            type: String,
            default: 'top left',
            validator: validatePosition
        },
        offset: {
            type: Array,
            default: () => [0, 0],
            validator: validateOffset
        },

        scrollTarget: {
            type: String as PropType<Element | string>,
            default: null
        },

        touchPosition: Boolean,

        maxHeight: {
            type: String,
            default: null
        },
        maxWidth: {
            type: String,
            default: null
        },
        menuClass: {
            type: String,
            default: ''
        },
        arrowNavItems: {
            type: [String, Array, Object],
            default: () => [] as any[]
        },
        zIndex: {
            type: [Number, String],
            default: 'var(--dl-z-index-menu)'
        },
        /**
         * the % of the parent element that triggers the tooltips visibility
         */
        triggerPercentage: {
            type: Number,
            default: 1
        },
        toggleKey: {
            type: String,
            default: 'Enter'
        }
    },

    emits: [
        ...useModelToggleEmits,
        'click',
        'escapekey',
        'highlightedIndex',
        'handleSelectedItem'
    ],

    setup(props, { attrs }) {
        const vm = getCurrentInstance()

        let refocusTarget: HTMLElement | Element | null = null
        let absoluteOffset: Record<any, any> | undefined
        let unwatchPosition: Function | undefined
        let avoidAutoClose: boolean = false

        const proxy = vm!.proxy!
        const emit = vm!.emit!

        const innerRef: Ref<HTMLElement | null> = ref(null)
        const showing = ref(false)
        const { toggleKey } = toRefs(props)

        const { registerTick, removeTick } = useTick()
        const { registerTimeout, removeTimeout } = useTimeout()
        const { transitionStyle } = useTransition(props, showing)
        const {
            localScrollTarget,
            changeScrollEvent,
            unconfigureScrollTarget
        } = useScrollTarget(props, configureScrollTarget)

        const { anchorEl, canShow } = useAnchor({ toggleKey: toggleKey.value })

        const screen = useWindowSize()

        const classes = computed(
            () =>
                ' ' +
                props.menuClass +
                (props.square === true ? ' dl-menu--square' : '')
        )

        const { hide } = useModelToggle({
            showing,
            canShow,
            handleShow,
            handleHide,
            processOnMount: true
        })

        const {
            showPortal,
            hidePortal,
            portalEl,
            portalIsActive,
            portalIsAccessible
        } = usePortal(vm, innerRef)

        const clickOutsideProps = {
            anchorEl,
            innerRef,
            onClickOutside: (e: AnchorEvent) =>
                handleClickOutside(e, {
                    persistent: props.persistent,
                    showing: showing.value,
                    fn: hide
                })
        }

        const anchorOrigin = computed(() =>
            getAnchorOrigin(props.anchor, props.cover)
        )

        const selfOrigin = computed(() =>
            props.cover === true
                ? anchorOrigin.value
                : parsePosition(props.self || 'top start')
        )

        const onClick = props.autoClose === true ? onAutoClose : () => {}

        const handlesFocus = computed(
            () => showing.value === true && props.persistent !== true
        )

        watch(handlesFocus, (val) =>
            handleWatcherEvents(val, onEscapeKey, clickOutsideProps)
        )

        function focus() {
            addFocusFn(() => {
                let node = innerRef.value as unknown as HTMLElement

                if (node && node.contains(document.activeElement) !== true) {
                    node =
                        node.querySelector('[autofocus], [data-autofocus]') ||
                        node
                    node.focus({ preventScroll: true })
                }
            })
        }

        const isMobile = computed(() => isMobileOrTablet())

        function handleShow(evt: MouseEvent | TouchEvent) {
            isMenuOpen.value = true
            removeTick()
            removeTimeout()

            refocusTarget =
                props.noRefocus === false ? document.activeElement : null

            showPortal()
            configureScrollTarget()

            absoluteOffset = null

            const offsetOnShow = setOffsetOnShow(evt as TouchEvent, {
                contextMenu: props.contextMenu,
                touchPosition: props.touchPosition,
                anchorEl,
                absoluteOffset
            })

            absoluteOffset = offsetOnShow as Record<any, any> | undefined

            if (!unwatchPosition) {
                unwatchPosition = watch(() => screen, updatePosition, {
                    deep: true
                })
            }

            registerTick(
                () => {
                    updatePosition()
                },
                { continuous: true }
            )

            registerTimeout(
                () => {
                    // required in order to avoid the "double-tap needed" issue
                    avoidAutoClose = avoidAutoCloseFn(isMobile.value, {
                        avoidAutoClose,
                        autoClose: props.autoClose,
                        innerRef
                    })

                    updatePosition()
                    showPortal(true) // done showing portal
                    emit('show', evt)
                },
                isVue2 ? 5 : props.transitionDuration
            )
        }

        function handleHide(evt: ClickOutsideEvent) {
            isMenuOpen.value = false
            removeTick()
            removeTimeout()
            hidePortal()

            anchorCleanup(true)
            refocusTarget = refocusTargetFn(evt, refocusTarget as HTMLElement)

            registerTimeout(
                () => {
                    hidePortal(true) // done hiding, now destroy
                    emit('hide', evt)
                },
                isVue2 ? 5 : props.transitionDuration
            )
        }

        function anchorCleanup(hiding: boolean) {
            absoluteOffset = null

            unwatchPosition = updateUnwatchPosition(unwatchPosition)

            conditionalHandler(hiding || showing.value, () => {
                unconfigureScrollTarget()
                removeClickOutside(clickOutsideProps)
                removeEscapeKey(onEscapeKey)
            })

            conditionalHandler(!hiding, () => {
                refocusTarget = null
            })
        }

        function configureScrollTarget() {
            if (anchorEl.value !== null || props.scrollTarget) {
                (localScrollTarget as Ref<any>).value = getScrollTarget(
                    anchorEl.value as HTMLElement,
                    props.scrollTarget
                )
                changeScrollEvent(
                    (localScrollTarget as Ref<any>).value,
                    updatePosition
                )
            }
        }

        function onAutoClose(e: MouseEvent) {
            // if auto-close, then the ios double-tap fix which
            // issues a click should not close the menu
            avoidAutoClose = conditionalHandler(
                !avoidAutoClose,
                () => {
                    closePortalMenus(proxy, e)
                    emit('click', e)
                },
                avoidAutoClose
            ) as boolean
        }

        function onEscapeKey(evt: AnchorEvent) {
            emit('escapekey')
            hide(evt)
        }

        const updatePosition = async () => {
            const el = innerRef.value

            if (el === null || anchorEl.value === null) {
                return
            }

            const isAnchorElVisible = await CheckAnchorElVisibility(
                anchorEl.value,
                {
                    triggerPercentage: props.triggerPercentage
                }
            )

            if (!isAnchorElVisible) {
                hide()
                return
            }

            setPosition({
                el,
                offset: props.offset as number[],
                anchorEl: anchorEl.value as HTMLElement,
                anchorOrigin: anchorOrigin.value,
                selfOrigin: selfOrigin.value,
                absoluteOffset,
                fitContainer: props.fitContainer,
                fitContent: props.fitContent,
                cover: props.cover,
                maxHeight: props.maxHeight,
                maxWidth: props.maxWidth
            })
        }

        onBeforeUnmount(anchorCleanup as any)

        // expose public methods
        Object.assign(proxy, { focus, updatePosition })

        const isMenuOpen = ref(false)
        const navItems = computed(() => props.arrowNavItems)
        const { selectedItem, highlightedIndex } = useArrowNavigation(
            navItems,
            isMenuOpen
        )
        watch(selectedItem, (value: any) => {
            emit('handleSelectedItem', value)
        })
        watch(highlightedIndex, (value: any) => {
            emit('highlightedIndex', value)
        })

        return {
            uuid: `dl-menu-${v4()}`,
            onClick,
            portalIsAccessible,
            anchorEl,
            showing,
            innerRef,
            portalEl: isVue2 ? '[data-test-id="portal"]' : portalEl,
            portalIsActive,
            classes: 'dl-menu dl-position-engine scroll' + classes.value,
            styles: [
                attrs.style,
                transitionStyle.value,
                {
                    '--menu-z-index': props.zIndex ?? 'var(--dl-z-index-menu)'
                }
            ] as any,
            selectedItem,
            highlightedIndex
        }
    }
})
</script>

<style scoped lang="scss">
.dl-menu {
    position: fixed !important;
    display: inline-block;
    max-width: 95vw;
    border: 1px solid var(--dl-color-separator);

    box-shadow: var(--dl-menu-shadow);
    background: var(--dl-color-panel-background);
    border-radius: 2px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: var(--dl-menu-scrollbar-width, 5px);
    }
    outline: 0;
    max-height: 65vh;
    z-index: var(--menu-z-index);

    &--square {
        border-radius: 0;
    }
}

.dl-position-engine {
    margin-top: var(--dl-pe-top, 0) !important;
    margin-left: var(--dl-pe-left, 0) !important;
    will-change: auto;
    visibility: collapse; // needed for animation - is removed on first positioning
}

.scroll {
    overflow: auto;
}

.fade-enter,
.fade-enter-active {
    animation: fade-in var(--dl-transition-duration);
}

.fade-leave-active,
.fade-leave-to {
    animation: fade-in var(--dl-transition-duration) reverse;
}
@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
