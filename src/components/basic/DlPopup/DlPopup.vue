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
            >
                <draggable-upper
                    v-if="draggable"
                    @move="movePopup"
                />
                <popup-header
                    v-if="hasHeaderSlot"
                    :title="title"
                    :additional-info="additionalInfo"
                    :subtitle="subtitle"
                    :with-close-button="withCloseButton"
                    @hide-button-clik="handleHideClick"
                >
                    <template
                        v-if="hasHeaderSlot"
                        #header
                    >
                        <slot name="header" />
                    </template>
                    <template
                        v-if="hasHideButtonSlot"
                        #hide-button
                    >
                        <slot name="hide-button" />
                    </template>
                </popup-header>
                <div class="popup-content">
                    <slot />
                </div>
                <div
                    v-if="hasFooterSlot"
                    class="popup-footer"
                >
                    <slot name="footer" />
                </div>
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
    isVue2
} from 'vue-demi'

import useWindowSize from '../../../hooks/use-window-size'
import useAnchor, { useAnchorProps } from '../../../hooks/use-anchor'
import useScrollTarget from '../../../hooks/use-scroll-target'
import useModelToggle, {
    useModelToggleProps,
    AnchorEvent
} from '../../../hooks/use-model-toggle'
import usePortal from '../../../hooks/use-portal'
import useTransition, {
    useTransitionProps
} from '../../../hooks/use-transition'
import useTick from '../../../hooks/use-tick'
import useTimeout from '../../../hooks/use-timeout'

import { getScrollTarget } from '../../../utils/scroll'
import DlTeleport from '../../../utils/teleport'
import { removeEscapeKey } from '../../../utils/escape-key'
import { addFocusout, removeFocusout } from '../../../utils/focusout'
import { childHasFocus } from '../../../utils/dom'
import {
    removeClickOutside,
    ClickOutsideEvent
} from '../../../utils/click-outside'
import { addFocusFn } from '../../../utils/focus-manager'

import {
    validatePosition,
    validateOffset,
    setPosition,
    parsePosition,
    setForcedPosition
} from '../../../utils/position-engine'
import {
    getAnchorOrigin,
    handleWatcherEvents,
    setOffsetOnShow,
    updateUnwatchPosition,
    refocusTargetFn,
    conditionalHandler,
    handleClickOutside
} from '../../essential/DlMenu/utils'
import DraggableUpper from './components/DraggableUpper.vue'
import PopupHeader from './components/PopupHeader.vue'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlPopup',
    components: {
        DlTeleport,
        PopupHeader,
        DraggableUpper
    },
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
        noFocus: Boolean,
        anchor: {
            type: String,
            default: 'center middle',
            validator: validatePosition
        },
        additionalInfo: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        withCloseButton: { type: Boolean, default: false },
        preventHide: { type: Boolean, default: false },
        disableCloseByEsc: { type: Boolean, default: false },
        hideOnClickOutside: { type: Boolean, default: false },
        self: {
            type: String,
            default: 'top middle',
            validator: validatePosition
        },
        offset: {
            type: Array,
            default: () => [0, 0],
            validator: validateOffset
        },
        scrollTarget: {
            type: String as PropType<Element | string>,
            default: void 0
        },
        touchPosition: Boolean,
        maxHeight: { type: String, default: 'auto' },
        maxWidth: { type: String, default: 'auto' },
        height: { type: String, default: 'auto' },
        width: { type: String, default: 'auto' },
        draggable: Boolean
    },
    emits: [
        'hide-button-click',
        'show',
        'before-show',
        'hide',
        'escape-key',
        'before-hide',
        'update:model-value'
    ],
    setup(props, { attrs, slots }) {
        const vm = getCurrentInstance()

        let refocusTarget: HTMLElement | Element | null = null
        let absoluteOffset: Record<any, any> | undefined
        let unwatchPosition: Function | undefined

        const proxy = vm!.proxy!

        const innerRef: Ref<HTMLElement | null> = ref(null)
        const showing = ref(false)

        const { registerTick, removeTick } = useTick()
        const { registerTimeout, removeTimeout } = useTimeout()
        const { transitionStyle } = useTransition(props, showing)
        const { localScrollTarget, changeScrollEvent } = useScrollTarget(
            props,
            configureScrollTarget
        )

        const { anchorEl, canShow } = useAnchor({})

        const screen = useWindowSize()

        const hasFooterSlot = computed(() => slots.footer !== undefined)

        const hasHeaderSlot = computed(() => slots.header !== undefined)

        const hasHideButtonSlot = computed(
            () => slots['hide-button'] !== undefined
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
                    persistent: !props.hideOnClickOutside,
                    showing: showing.value,
                    fn: hide
                })
        }

        const anchorOrigin = computed(() =>
            getAnchorOrigin(props.anchor, false)
        )

        const selfOrigin = computed(() =>
            parsePosition(props.self || 'top start')
        )

        const handlesFocus = computed(
            () => showing.value === true && props.persistent !== true
        )

        const stylesFromProps = computed(() => {
            return {
                '--popup-max-width': props.maxWidth,
                '--popup-max-height': props.maxHeight,
                '--popup-width': props.width,
                '--popup-height': props.height
            }
        })

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

        function handleShow(evt: MouseEvent | TouchEvent) {
            removeTick()
            removeTimeout()

            refocusTarget =
                props.noRefocus === false ? document.activeElement : null

            addFocusout(onFocusout)

            showPortal()

            absoluteOffset = void 0

            const offsetOnShow = setOffsetOnShow(evt as TouchEvent, {
                contextMenu: props.contextMenu,
                touchPosition: props.touchPosition,
                anchorEl,
                absoluteOffset
            })

            absoluteOffset = offsetOnShow as Record<any, any> | undefined

            if (unwatchPosition === void 0) {
                unwatchPosition = watch(() => screen, updatePosition, {
                    deep: true
                })
            }

            if (!props.noFocus) (document.activeElement as HTMLElement).blur()

            registerTick(() => {
                updatePosition()
                if (!props.noFocus) focus()
            })

            registerTimeout(() => {
                updatePosition()
                showPortal(true) // done showing portal
                proxy.$emit('show', evt)
            }, props.transitionDuration)
        }

        function handleHide(evt: ClickOutsideEvent) {
            removeTick()
            removeTimeout()
            hidePortal()

            anchorCleanup(true)
            refocusTarget = refocusTargetFn(evt, refocusTarget as HTMLElement)

            registerTimeout(() => {
                hidePortal(true) // done hiding, now destroy
                proxy.$emit('hide', evt)
            }, props.transitionDuration)
        }

        function anchorCleanup(hiding: boolean) {
            absoluteOffset = void 0

            unwatchPosition = updateUnwatchPosition(unwatchPosition)

            conditionalHandler(hiding || showing.value, () => {
                removeFocusout(onFocusout)
                removeClickOutside(clickOutsideProps)
                removeEscapeKey(onEscapeKey)
            })

            conditionalHandler(!hiding, () => {
                refocusTarget = null
            })
        }

        function configureScrollTarget() {
            if (anchorEl.value !== null || props.scrollTarget !== void 0) {
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

        function onFocusout(evt: MouseEvent) {
            // the focus is not in a vue child component
            conditionalHandler(
                handlesFocus.value === true &&
                    props.noFocus !== true &&
                    childHasFocus(
                        innerRef.value as HTMLElement,
                        evt.target as Node
                    ) !== true,
                focus
            )
        }

        function onEscapeKey(evt: AnchorEvent) {
            proxy.$emit('escape-key')
            if (!props.disableCloseByEsc) {
                hide(evt)
            }
        }

        function updatePosition() {
            const el = innerRef.value

            if (el === null || anchorEl.value === null) {
                return
            }

            setPosition({
                el,
                offset: props.offset as number[],
                anchorEl: anchorEl.value as HTMLElement,
                anchorOrigin: anchorOrigin.value,
                selfOrigin: selfOrigin.value,
                absoluteOffset,
                cover: false,
                maxHeight: props.maxHeight,
                maxWidth: props.maxWidth
            })
        }

        function movePopup(x: number, y: number) {
            const el = innerRef.value

            if (el === null || anchorEl.value === null) {
                return
            }

            setForcedPosition(
                {
                    el,
                    offset: props.offset as number[],
                    anchorEl: anchorEl.value as HTMLElement,
                    anchorOrigin: anchorOrigin.value,
                    selfOrigin: selfOrigin.value
                },
                {
                    top: y,
                    left: x
                }
            )
        }

        function handleHideClick(e: Event) {
            if (!props.preventHide) {
                hide(e as AnchorEvent)
            }
            proxy.$emit('hide-button-click', e)
        }

        onBeforeUnmount(anchorCleanup as any)

        // expose public methods
        Object.assign(proxy, { focus, updatePosition })

        return {
            uuid: `dl-popup-${v4()}`,
            portalIsAccessible,
            anchorEl,
            showing,
            handleHideClick,
            hasHideButtonSlot,
            hasFooterSlot,
            movePopup,
            hasHeaderSlot,
            innerRef,
            portalEl: isVue2 ? 'body' : portalEl,
            portalIsActive,
            classes: 'dl-popup dl-position-engine scroll',
            styles: [
                attrs.style,
                transitionStyle.value,
                stylesFromProps.value
            ] as any
        }
    }
})
</script>

<style>
.dl-popup {
    z-index: calc(var(--dl-z-index-menu) - 1);
    position: fixed !important;
    padding: 0 0 16px;
    border: 1px solid var(--dl-color-separator);
    display: flex;
    background-color: var(--dl-color-panel-background);
    flex-direction: column;
    max-width: var(--popup-max-width);
    max-height: var(--popup-max-height);
    width: var(--popup-width);
    height: var(--popup-height);
    /* TODO: Change to variable */
    box-shadow: 0px 3px 6px rgba(16, 30, 115, 0.15);
    border-radius: 2px;
}

.popup-content {
    max-width: 100%;
    padding: 0 16px;
}

.popup-footer {
    padding: 20px 16px 0px;
}
</style>
