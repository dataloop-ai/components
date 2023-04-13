<template>
    <transition
        :enter-active-class="transition.enter"
        :leave-active-class="transition.leave"
    >
        <div
            v-show="isActive"
            id="DlToastContainer"
            ref="root"
            class="toast-item"
            :class="[
                `toast-item--${type}`,
                `toast-item--${position}`,
                classItem
            ]"
            :style="{ width }"
        >
            <dl-alert
                class="alert"
                :type="type"
                :closable="closable"
                :dark-mode="false"
                close-button-position="center"
                @update:model-value="closeToast"
            >
                <span
                    class="toast-message"
                    data-test="message-text"
                />
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
import { DlAlert } from '../../../basic'
import { Positions, Types } from '../utils/config'
import { removeElement } from '../utils/render'
import { Animation } from '../types'

export default defineComponent({
    name: 'ToastComponent',
    components: { DlAlert },
    props: {
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'success',
            validator(value: string): boolean {
                return Object.values(Types as unknown).includes(value)
            }
        },
        classItem: {
            type: String,
            default: ''
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
            default: Positions.bottom,
            validator(value: string): boolean {
                return Object.values(Positions as unknown).includes(value)
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
    setup(props: any) {
        const { position, duration, message, collapseCount } = props
        const root = ref(null)
        let parentTop: HTMLElement = null
        let parentBottom: HTMLElement = null
        const toastParentPosition = ref(null)
        const isActive = ref(false)
        function closeToastMessage(): void {
            isActive.value = false
            setTimeout(() => removeElement(root.value), 200)
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
                case Positions.top:
                case Positions.top_right:
                case Positions.top_left:
                    toastParentPosition.value = 'top'
                    return parentTop
                case Positions.bottom:
                case Positions.bottom_right:
                case Positions.bottom_left:
                    toastParentPosition.value = 'bottom'
                    return parentBottom
            }
        })

        const transition = computed((): Animation => {
            switch (position) {
                case Positions.top:
                case Positions.top_right:
                case Positions.top_left:
                    return {
                        enter: 'dl-toast--fade-in-down',
                        leave: 'dl-toast--fade-out'
                    }
                case Positions.bottom:
                case Positions.bottom_right:
                case Positions.bottom_left:
                    return {
                        enter: 'dl-toast--fade-in-up',
                        leave: 'dl-toast--fade-out'
                    }
            }
        })

        onMounted(() => {
            showNotice()
        })

        function showNotice(): void {
            const parent = correctParent.value
            const container = root.value.closest('.dl-toast-container--pending')
            root.value.querySelector('.toast-message').innerHTML = message
            parent.insertAdjacentElement('afterbegin', root.value)
            container?.remove()
            isActive.value = true
            if (duration) {
                setTimeout(() => {
                    closeToastMessage()
                }, duration * 1000)
            }
            if (collapseCount && collapseCount < parent.childNodes.length) {
                setTimeout(() => removeElement(parent.lastElementChild), 200)
            }
        }
        function closeToast(val: boolean) {
            if (!val) removeElement(root.value)
        }

        return {
            root,
            transition,
            isActive,
            closeToast,
            correctParent
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

#DlToastContainer {
    --dl-color-negative: var(--dl-color-alert-error);
    --dl-color-negative-background: var(--dl-color-alert-error-background);
    --dl-color-warning: var(--dl-color-alert-warn);
    --dl-color-warning-background: var(--dl-color-alert-warn-background);
    --dl-color-positive: var(--dl-color-alert-success);
    --dl-color-positive-background: var(--dl-color-alert-success-background);
    --dl-color-info: var(--dl-color-alert-info);
    --dl-color-info-background: var(--dl-color-alert-info-background);
    --dl-color-darker: var(--dl-color-alert-text);

    .alert {
        .close-btn {
            align-items: center !important;
        }
    }
}
</style>
