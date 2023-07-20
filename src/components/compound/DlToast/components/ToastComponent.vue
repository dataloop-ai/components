<template>
    <transition
        :enter-active-class="transition.enter"
        :leave-active-class="transition.leave"
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
                icon-size="24px"
                :dark-mode="false"
                close-button-position="center"
                style="position: relative"
                @update:model-value="closeToast"
            >
                <span
                    class="toast-message"
                    data-test="message-text"
                />
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
    onBeforeMount,
    onMounted,
    ref
} from 'vue-demi'
import { DlAlert, DlBadge } from '../../../'
import { DlToastTypes, DlToastPositions } from '../types'
import { removeElement } from '../utils/render'
import { Animation } from '../types'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'ToastComponent',
    components: { DlAlert, DlBadge },
    props: {
        message: {
            type: String,
            required: true
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
    setup(props: any, { emit }) {
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
            setTimeout(() => {
                emit('removed')
                removeElement(root.value)
            }, 200)
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

        const transition = computed((): Animation => {
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
            const container = root.value.closest('.dl-toast-container--pending')
            root.value.querySelector('.toast-message').innerHTML = message
            parent.insertAdjacentElement('afterbegin', root.value)
            container?.remove()
            isActive.value = true
            if (duration) {
                setHideTimeout()
            }
            if (collapseCount && collapseCount < parent.childNodes.length) {
                setTimeout(() => {
                    emit('removed')
                    removeElement(parent.lastElementChild)
                }, 200)
            }
        }
        function closeToast(val: boolean) {
            if (!val) {
                emit('removed')
                removeElement(root.value)
            }
        }

        const updateCount = (val: number) => {
            count.value = val
            setHideTimeout()
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
            }
        })

        return {
            uuid,
            root,
            transition,
            isActive,
            closeToast,
            correctParent,
            updateCount,
            count,
            badgeColor
        }
    }
})
</script>

<style lang="scss" scoped>
.toast-item {
    display: inline-flex;
    align-items: center;
    pointer-events: auto;
    min-width: 400px;
    max-width: 900px;
    margin: 5px;
    cursor: pointer;
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
    --dl-color-negative-background: var(--dl-color-alert-error-background);
    --dl-color-warning: var(--dl-color-alert-warn);
    --dl-color-warning-background: var(--dl-color-alert-warn-background);
    --dl-color-positive: var(--dl-color-alert-success);
    --dl-color-positive-background: var(--dl-color-alert-success-background);
    --dl-color-info: var(--dl-color-alert-info);
    --dl-color-info-background: var(--dl-color-alert-info-background);
    --dl-color-darker: var(--dl-color-alert-text);
    --dl-alert-align-button: center;
}
</style>
