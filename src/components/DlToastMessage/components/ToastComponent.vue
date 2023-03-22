<template>
    <transition
        :enter-active-class="transition.enter"
        :leave-active-class="transition.leave"
    >
        <div
            v-show="isActive"
            ref="root"
            class="v-toast__item"
            :class="[
                `v-toast__item--${type}`,
                `v-toast__item--${position}`,
                classItem
            ]"
        >
            <dl-alert
                :type="type"
                :closable="closable"
                @update:model-value="(val) => closeToast(val)"
            >
                <span
                    class="v-toast__text"
                    data-test="message-text"
                />
            </dl-alert>
        </div>
    </transition>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onBeforeMount,
    computed,
    onMounted
} from 'vue-demi'
import DlAlert from '../../DlAlert.vue'
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
        }
    },
    setup(props) {
        const { position, duration, message } = props
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
            parentTop = document.querySelector('.v-toast.v-toast--top')
            parentBottom = document.querySelector('.v-toast.v-toast--bottom')
            if (parentTop && parentBottom) return
            if (!parentTop) {
                parentTop = document.createElement('div')
                parentTop.className = 'v-toast v-toast--top'
            }
            if (!parentBottom) {
                parentBottom = document.createElement('div')
                parentBottom.className = 'v-toast v-toast--bottom'
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
                        enter: 'v-toast--fade-in-down',
                        leave: 'v-toast--fade-out'
                    }
                case Positions.bottom:
                case Positions.bottom_right:
                case Positions.bottom_left:
                    return {
                        enter: 'v-toast--fade-in-up',
                        leave: 'v-toast--fade-out'
                    }
            }
        })

        onMounted(() => {
            showNotice()
        })

        function showNotice(): void {
            const parent = correctParent.value
            const container = root.value.closest('.v-toast--pending')
            root.value.querySelector('.v-toast__text').innerHTML = message
            parent.insertAdjacentElement('afterbegin', root.value)
            container?.remove()
            isActive.value = true
            if (duration) {
                setTimeout(() => {
                    closeToastMessage()
                }, duration * 1000)
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

<style lang="scss">
.v-toast {
    position: fixed;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 1052;
    pointer-events: none;
    &__text {
        min-width: 300px;
        max-width: 800px;
    }
    &__item {
        display: inline-flex;
        align-items: center;
        pointer-events: auto;
        margin-bottom: 5px;
        margin-top: 5px;
        cursor: pointer;
        animation-duration: 150ms;
        &.v-toast__item--top,
        &.v-toast__item--bottom {
            align-self: center;
        }

        &.v-toast__item--top-right,
        &.v-toast__item--bottom-right {
            align-self: flex-end;
        }

        &.v-toast__item--top-left,
        &.v-toast__item--bottom-left {
            align-self: flex-start;
        }
    }

    &.v-toast--top {
        flex-direction: column;
    }

    &.v-toast--bottom {
        flex-direction: column-reverse;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.v-toast--fade-out {
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

.v-toast--fade-in-down {
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

.v-toast--fade-in-up {
    animation-name: fadeInUp;
}

/**
 * Vue Transitions
 */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 150ms ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
