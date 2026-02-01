<template>
    <dl-teleport v-if="portalIsActive" :to="portalEl">
        <transition name="fade" appear>
            <div
                v-if="showing"
                :id="uuid"
                ref="innerRef"
                tabIndex="-1"
                :class="classes"
                class="capitalize"
                :style="styles"
            >
                <slot />
            </div>
        </transition>
    </dl-teleport>
</template>
<script lang="ts">
import {
    defineComponent,
    getCurrentInstance,
    ref,
    computed,
    watch,
    onBeforeUnmount,
    isVue2,
    Ref,
    PropType,
    onMounted
} from 'vue-demi'
import useAnchor, {
    CheckAnchorElVisibility,
    useAnchorProps
} from '../../../hooks/use-anchor'
import useModelToggle, { AnchorEvent } from '../../../hooks/use-model-toggle'
import usePortal from '../../../hooks/use-portal'
import useScrollTarget from '../../../hooks/use-scroll-target'
import useTick from '../../../hooks/use-tick'
import useTimeout from '../../../hooks/use-timeout'
import useTransition, {
    useTransitionProps
} from '../../../hooks/use-transition'
import {
    addEvt,
    cleanEvt,
    clearSelection,
    getColor,
    isMobileOrTablet,
    stringStyleToRecord
} from '../../../utils'
import {
    parsePosition,
    setPosition,
    validateOffset,
    validatePosition
} from '../../../utils/position-engine'
import { getScrollTarget } from '../../../utils/scroll'
import useWindowSize from '../../../hooks/use-window-size'
import {
    removeClickOutside,
    ClickOutsideEvent,
    addClickOutside
} from '../../../utils/click-outside'
import DlTeleport from '../../../utils/teleport'
import { v4 } from 'uuid'
import { isString } from 'lodash'

export default defineComponent({
    name: 'DlTooltip',
    components: {
        DlTeleport
    },
    inheritAttrs: false,
    props: {
        ...useAnchorProps,
        ...useTransitionProps,
        color: {
            type: String,
            required: false,
            default: 'dell-gray-800'
        },
        backgroundColor: {
            type: String,
            required: false,
            default: 'dell-white'
        },
        maxHeight: {
            type: String,
            default: null
        },
        maxWidth: {
            type: String,
            default: '240px'
        },
        anchor: {
            type: String,
            default: 'bottom middle',
            validator: validatePosition
        },
        self: {
            type: String,
            default: 'top middle',
            validator: validatePosition
        },
        capitalized: {
            type: Boolean,
            default: false
        },
        offset: {
            type: Array,
            default: () => [9, 9],
            validator: validateOffset
        },
        scrollTarget: {
            type: String as PropType<Element | string>,
            default: null
        },
        delay: {
            type: Number,
            default: 500
        },
        hideDelay: {
            type: Number,
            default: 0
        },
        textAlignment: {
            type: String,
            default: 'left',
            validator: (v: string) =>
                ['left', 'right', 'justify', 'center'].includes(v)
        },
        /**
         * the % of the parent element that triggers the tooltips visibility
         */
        triggerPercentage: {
            type: Number,
            default: 0.5
        },
        border: {
            type: String,
            default: null
        }
    },
    setup(props, { emit, attrs }) {
        let unwatchPosition: Function | undefined

        // @ts-ignore
        let observer: MutationObserver | undefined

        const vm = getCurrentInstance()

        const innerRef = ref(null)
        const showing = ref(false)

        const anchorOrigin = computed(() => parsePosition(props.anchor))
        const selfOrigin = computed(() => parsePosition(props.self))

        const { registerTick, removeTick } = useTick()
        const { registerTimeout, removeTimeout } = useTimeout()
        const { transitionStyle } = useTransition(props, showing)
        const { width, height } = useWindowSize()
        const {
            localScrollTarget,
            changeScrollEvent,
            unconfigureScrollTarget
        } = useScrollTarget(props, configureScrollTarget)

        const { anchorEl, canShow, anchorEvents } = useAnchor({
            configureAnchorEl
        })

        const { show, hide } = useModelToggle({
            showing,
            canShow,
            handleShow,
            handleHide,
            processOnMount: true
        })

        Object.assign(anchorEvents, { delayShow, delayHide })

        const { showPortal, hidePortal, portalIsActive, portalEl } = usePortal(
            vm,
            innerRef
        )

        const isMobile = computed(() => isMobileOrTablet())
        // if we're on mobile, let's improve the experience
        // by closing it when user taps outside of it
        if (isMobile.value === true) {
            const clickOutsideProps = {
                anchorEl,
                innerRef,
                onClickOutside(e: AnchorEvent) {
                    hide(e)
                    return true
                }
            }

            const hasClickOutside = computed(() => showing.value === true)

            watch(hasClickOutside, (val) => {
                const fn = val === true ? addClickOutside : removeClickOutside
                fn(clickOutsideProps)
            })

            onBeforeUnmount(() => {
                removeClickOutside(clickOutsideProps)
            })
        }

        function handleShow(evt: MouseEvent | TouchEvent) {
            removeTick()
            removeTimeout()

            showPortal()

            registerTick(() => {
                updatePosition()
                configureScrollTarget()
            })

            if (!unwatchPosition) {
                unwatchPosition = watch(
                    () =>
                        width +
                        '|' +
                        height +
                        '|' +
                        props.self +
                        '|' +
                        props.anchor,
                    updatePosition
                )
            }

            registerTimeout(() => {
                showPortal(true) // done showing portal
                emit('show', evt)
            }, props.transitionDuration)
        }

        function handleHide(evt: ClickOutsideEvent) {
            removeTick()
            removeTimeout()
            hidePortal()

            anchorCleanup()

            registerTimeout(() => {
                hidePortal(true) // done hiding, now destroy
                emit('hide', evt)
            }, props.transitionDuration)
        }

        function anchorCleanup() {
            if (observer) {
                observer.disconnect()
                observer = null
            }

            if (unwatchPosition) {
                unwatchPosition()
                unwatchPosition = null
            }

            unconfigureScrollTarget()
            cleanEvt(anchorEvents, 'tooltipTemp')
        }

        async function updatePosition() {
            const el = innerRef.value

            if (anchorEl.value === null || !el) {
                return
            }

            const isAnchorElVisible =
                props.triggerPercentage === 0
                    ? true
                    : await CheckAnchorElVisibility(anchorEl.value, {
                          triggerPercentage: props.triggerPercentage
                      })

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
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight
            })
        }

        function delayShow(evt: AnchorEvent) {
            if (isMobile.value === true) {
                clearSelection()
                document.body.classList.add('non-selectable')

                const target = anchorEl.value
                const evts = [
                    'touchmove',
                    'touchcancel',
                    'touchend',
                    'click'
                ].map((e) => [target, e, 'delayHide', 'passiveCapture'])

                addEvt(anchorEvents, 'tooltipTemp', evts)
            }

            registerTimeout(() => {
                show(evt)
            }, props.delay)
        }

        function delayHide(evt: AnchorEvent) {
            removeTimeout()

            if (isMobile.value === true) {
                cleanEvt(anchorEvents, 'tooltipTemp')
                clearSelection()
                // delay needed otherwise selection still occurs
                setTimeout(() => {
                    document.body.classList.remove('non-selectable')
                }, 10)
            }

            registerTimeout(() => {
                hide(evt)
            }, props.hideDelay)
        }

        function configureAnchorEl() {
            if (props.noParentEvent === true || anchorEl.value === null) {
                return
            }

            const evts =
                isMobile.value === true
                    ? [[anchorEl.value, 'touchstart', 'delayShow', 'passive']]
                    : [
                          [
                              anchorEl.value,
                              'mouseenter',
                              'delayShow',
                              'passive'
                          ],
                          [anchorEl.value, 'mouseleave', 'delayHide', 'passive']
                      ]

            addEvt(anchorEvents, 'anchor', evts)
        }

        function configureScrollTarget() {
            if (anchorEl.value !== null || props.scrollTarget) {
                ;(localScrollTarget as Ref<any>).value = getScrollTarget(
                    anchorEl.value as HTMLElement,
                    props.scrollTarget as Element
                )
                const fn = props.noParentEvent === true ? updatePosition : hide

                changeScrollEvent((localScrollTarget as Ref<any>).value, fn)
            }
        }

        function handleRouteChange(e: any) {
            if (showing.value === true) {
                hide(e as AnchorEvent)
            }
        }

        onMounted(() => {
            window.addEventListener('hashchange', handleRouteChange)
        })

        onBeforeUnmount(() => {
            anchorCleanup()
            window.removeEventListener('hashchange', handleRouteChange)
        })

        // expose public methods
        Object.assign(vm!.proxy, { updatePosition })

        return {
            uuid: (attrs.id as string)?.length
                ? (attrs.id as string)
                : `dl-tooltip-${v4()}`,
            portalIsActive,
            classes: ['dl-tooltip dl-position-engine', attrs.class],
            showing,
            innerRef,
            portalEl: isVue2 ? 'body' : portalEl,
            styles: [
                isString(attrs.style)
                    ? stringStyleToRecord(attrs.style)
                    : attrs.style,
                transitionStyle.value,
                {
                    '--dl-tooltip-color': getColor(
                        props.color,
                        'dl-color-tooltip-text'
                    ),
                    '--dl-tooltip-background': getColor(
                        props.backgroundColor,
                        'dl-color-tooltip-background'
                    ),
                    '--dl-tooltip-text-align': props.textAlignment,
                    '--dl-tooltip-text-transform': props.capitalized
                        ? 'capitalize'
                        : 'none',
                    '--dl-tooltip-border': props.border
                }
            ] as any
        }
    },
    template: 'dl-tooltip'
})
</script>

<style lang="scss" scoped>
.dl-tooltip {
    z-index: var(--dl-z-index-tooltip);
    position: fixed !important;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 16px;
    padding: var(--dl-tooltip-padding, 2px 5px);
    font-size: var(--dl-font-size-small);
    line-height: 16px;
    color: var(--dl-tooltip-color);
    background: var(--dl-tooltip-background);
    border: 1px solid var(--dl-tooltip-border, #eaeaea);
    border-radius: 0px;
    box-shadow: 0 2px 2px 0 var(--dell-shadow, rgba(0, 0, 0, 0.14));
    text-transform: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    text-align: var(--dl-tooltip-text-align);
    white-space: break-spaces;
    word-break: break-word;
    pointer-events: none;
}
.capitalize {
    white-space-collapse: collapse;
}
.capitalize::first-letter {
    text-transform: var(--dl-tooltip-text-transform);
}

.dl-position-engine {
    margin-top: var(--dl-pe-top, 0) !important;
    margin-left: var(--dl-pe-left, 0) !important;
    will-change: auto;
    visibility: collapse; // needed for animation - is removed on first positioning;
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
