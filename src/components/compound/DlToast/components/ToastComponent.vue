<template>
    <transition
        :enter-active-class="transitionState.enter"
        :leave-active-class="transitionState.leave"
    >
        <div
            v-show="isActive"
            :id="`DlToastContainer-${uuid}`"
            ref="root"
            class="toast-item DlToastContainer"
            :class="[`toast-item--${type}`, `toast-item--${position}`]"
            :style="{ width }"
        >
            <dl-alert
                class="alert"
                :type="type"
                :closable="closable"
                icon-size="16px"
                :dark-mode="false"
                close-button-position="center"
                style="position: relative"
                @update:model-value="closeToast"
            >
                <slot name="message">
                    <div
                        class="toast-text"
                        :class="{
                            'toast-text--single': !multiLine,
                            'toast-text--with-title': !!title
                        }"
                    >
                        <div v-if="title" class="toast-title">
                            {{ title }}
                        </div>
                        <div
                            v-if="html"
                            class="toast-message"
                            data-test="message-text"
                            v-html="message"
                        />
                        <div
                            v-else
                            class="toast-message"
                            :class="{ 'toast-message--pre-line': multiLine }"
                            data-test="message-text"
                        >
                            {{ message }}
                        </div>

                        <div v-if="caption" class="toast-caption">
                            <div v-if="html" v-html="caption" />
                            <div v-else>
                                {{ caption }}
                            </div>
                        </div>
                    </div>
                </slot>
                <template v-if="actions && actions.length" #actions>
                    <dl-button
                        v-for="(action, idx) in actions"
                        :key="idx"
                        :label="action.label"
                        :icon="action.icon"
                        :color="action.textColor || 'dl-alert-border-color'"
                        :text-color="action.textColor || 'dl-alert-border-color'"
                        :hover-border-color="action.textColor || 'dl-alert-border-color'"
                        :hover-text-color="action.textColor || 'dl-alert-border-color'"
                        :hover-bg-color="'transparent'"
                        :pressed-bg-color="'transparent'"
                        :styles="action.styles || defaultActionButtonStyles"
                        :filled="false"
                        outlined
                        no-wrap
                        overflow
                        @click="onActionClick(action)"
                    />
                </template>
                <dl-badge
                    v-if="count"
                    with-border
                    floating
                    align="top"
                    :color="badgeColor"
                    :text-color="
                        type === 'warning'
                            ? 'var(--dl-color-alert-text)'
                            : 'var(--dl-color-text-buttons)'
                    "
                    style="
                        display: grid;
                        text-align: center;
                        width: fit-content;
                        padding: 3px;
                        min-width: 1em;
                        top: -5px;
                    "
                >
                    {{ count + 1 }}
                </dl-badge>
            </dl-alert>
        </div>
    </transition>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    getCurrentInstance,
    onBeforeMount,
    onMounted,
    PropType,
    ref
} from 'vue-demi'
import { DlAlert, DlBadge, DlButton } from '../../../'
import { DlToastAction, DlToastTypes, DlToastPositions } from '../types'
import { removeElement } from '../utils/render'
import { Animation } from '../types'
import { v4 } from 'uuid'

const DEFAULT_ACTION_BUTTON_STYLES =
    'min-width:73px; max-width:100px; height:24px; max-height:24px; padding:0 8px; border-radius:2px;'

export default defineComponent({
    name: 'ToastComponent',
    components: { DlAlert, DlBadge, DlButton },
    props: {
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            default: ''
        },
        html: {
            type: Boolean,
            default: false
        },
        multiLine: {
            type: Boolean,
            default: true
        },
        actions: {
            type: Array as PropType<DlToastAction[]>,
            default: (): DlToastAction[] => []
        },
        type: {
            type: String,
            required: true,
            validator(value: DlToastTypes): boolean {
                return Object.values(DlToastTypes).includes(value)
            }
        },
        width: {
            type: String,
            default: 'auto'
        },
        duration: {
            type: Number,
            default: 10
        },
        position: {
            type: String,
            default: DlToastPositions.BOTTOM,
            validator(value: DlToastPositions): boolean {
                return Object.values(DlToastPositions).includes(value)
            }
        },
        closable: {
            type: Boolean,
            default: true
        },
        collapseCount: {
            type: Number,
            default: 5
        }
    },
    emits: ['removed'],
    setup(props: any, { emit, slots }) {
        const uuid = v4()
        const { position, duration, message, collapseCount } = props
        const root = ref(null)
        const count = ref(0)
        let parentTop: HTMLElement = null
        let parentBottom: HTMLElement = null
        const toastParentPosition = ref(null)

        const isActive = ref(false)
        function closeToastMessage(): void {
            isActive.value = false
            clearTimeout(timeoutId.value)

            emit('removed')
            removeElement(root.value)
        }
        onBeforeMount(() => {
            setupContainer()
        })
        function setupContainer(): void {
            parentTop = document.getElementById('DlToastContainerTop')
            parentBottom = document.getElementById('DlToastContainerBottom')
            if (parentTop && parentBottom) return
            if (!parentTop) {
                parentTop = document.createElement('div')
                parentTop.id = 'DlToastContainerTop'
            }
            if (!parentBottom) {
                parentBottom = document.createElement('div')
                parentBottom.id = 'DlToastContainerBottom'
            }
            const container = document.body
            container.appendChild(parentTop)
            container.appendChild(parentBottom)
        }

        const correctParent = computed(() => {
            switch (position) {
                case DlToastPositions.TOP:
                case DlToastPositions.TOP_RIGHT:
                case DlToastPositions.TOP_LEFT:
                    toastParentPosition.value = 'top'
                    return parentTop
                case DlToastPositions.BOTTOM:
                case DlToastPositions.BOTTOM_RIGHT:
                case DlToastPositions.BOTTOM_LEFT:
                    toastParentPosition.value = 'bottom'
                    return parentBottom
            }
        })

        const transitionState = computed((): Animation => {
            switch (position) {
                case DlToastPositions.TOP:
                case DlToastPositions.TOP_RIGHT:
                case DlToastPositions.TOP_LEFT:
                    return {
                        enter: 'dl-toast--fade-in-down',
                        leave: 'dl-toast--fade-out'
                    }
                case DlToastPositions.BOTTOM:
                case DlToastPositions.BOTTOM_RIGHT:
                case DlToastPositions.BOTTOM_LEFT:
                    return {
                        enter: 'dl-toast--fade-in-up',
                        leave: 'dl-toast--fade-out'
                    }
            }
        })

        onMounted(() => {
            showNotice()
        })

        const timeoutId = ref(null)

        const setHideTimeout = () => {
            if (timeoutId.value) {
                clearTimeout(timeoutId.value)
            }

            timeoutId.value = setTimeout(() => {
                closeToastMessage()
                timeoutId.value = null
            }, duration * 1000)
        }

        function showNotice(): void {
            const parent = correctParent.value
            const container = root.value?.closest(
                '.dl-toast-container--pending'
            )
            const messageContainer = root.value?.querySelector('.toast-message')
            if (messageContainer && slots?.message) {
                messageContainer.innerHTML = message
            }
            parent.insertAdjacentElement('afterbegin', root.value)
            container?.remove()
            isActive.value = true
            if (duration) {
                setHideTimeout()
            }
            if (collapseCount && collapseCount < parent.childNodes.length) {
                closeToastMessage()
            }
        }
        function closeToast(val: boolean) {
            if (!val) {
                closeToastMessage()
            }
        }

        const updateCount = (val: number) => {
            count.value = val
            setHideTimeout()
        }

        const onActionClick = (action: DlToastAction) => {
            action?.handler?.()
            if (action?.closeOnClick) {
                closeToastMessage()
            }
        }

        const badgeColor = computed(() => {
            switch (props.type) {
                case DlToastTypes.SUCCESS:
                    return 'var(--dl-color-alert-success)'
                case DlToastTypes.WARNING:
                    return 'var(--dl-color-alert-warn)'
                case DlToastTypes.ERROR:
                    return 'var(--dl-color-alert-error)'
                case DlToastTypes.INFO:
                    return 'var(--dl-color-alert-info)'
                case DlToastTypes.DISCOVERY:
                    return 'var(--dl-color-discovery)'
            }
        })

        return {
            uuid,
            root,
            transitionState,
            isActive,
            closeToast,
            correctParent,
            updateCount,
            count,
            onActionClick,
            defaultActionButtonStyles: DEFAULT_ACTION_BUTTON_STYLES,
            badgeColor
        }
    }
})
</script>

<style lang="scss" scoped>
.toast-text {
    min-width: 0;
    flex: 1 1 auto;
}

.toast-title {
    font-size: var(--dl-font-size-alert-title, 16px);
    line-height: 150%;
    margin-bottom: 2px;
}

.toast-text--single {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toast-caption {
    margin-top: 2px;
    opacity: 0.8;
}

.toast-message--pre-line {
    white-space: pre-line;
}

.toast-item {
    display: inline-flex;
    align-items: center;
    pointer-events: auto;
    min-width: 400px;
    max-width: 900px;
    margin: 5px;
    cursor: default;
    animation-duration: 150ms;

    &.toast-item--top,
    &.toast-item--bottom {
        align-self: center;
    }

    &.toast-item--top-right,
    &.toast-item--bottom-right {
        align-self: flex-end;
    }

    &.toast-item--top-left,
    &.toast-item--bottom-left {
        align-self: flex-start;
    }
}

// using unique class to identify the changes

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.dl-toast--fade-out {
    animation-name: fadeOut;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translate3d(0, -100%, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

.dl-toast--fade-in-down {
    animation-name: fadeInDown;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

.dl-toast--fade-in-up {
    animation-name: fadeInUp;
}

// animations
.fade-enter-active,
.fade-leave-active {
    transition: opacity 150ms ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>

<style lang="scss">
#DlToastContainerTop {
    position: fixed;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: var(--dl-z-index-toast);
    pointer-events: none;
    flex-direction: column;
    .root {
        width: 100% !important;
    }
}
#DlToastContainerBottom {
    position: fixed;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: var(--dl-z-index-toast);
    pointer-events: none;
    flex-direction: column-reverse;
    .root {
        width: 100% !important;
    }
}

.DlToastContainer {
    --dl-color-negative: var(--dl-color-alert-error);
    --dl-color-negative-background: var(--dell-red-200);
    --dl-color-warning: var(--dl-color-alert-warn);
    --dl-color-warning-background: var(--dell-yellow-200);
    --dl-color-positive: var(--dl-color-alert-success);
    --dl-color-positive-background: var(--dell-green-200);
    --dl-color-info: var(--dl-color-alert-info);
    --dl-color-info-background: var(--dell-blue-200);
    --dl-color-darker: var(--dl-color-alert-text);
    --dl-alert-align-button: center;
}
</style>
