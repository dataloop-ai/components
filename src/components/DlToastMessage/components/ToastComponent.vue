<template>
    <transition
        :enter-active-class="transition.enter"
        :leave-active-class="transition.leave"
    >
        <div
            v-show="isActive"
            ref="root"
            class="v-toast__item"
            :class="[`v-toast__item--${type}`, `v-toast__item--${position}`]"
        >
            <dl-alert
                :type="type"
                :closable="closable"
                @update:model-value="(val) => closeToast(val)"
            >
                <!-- eslint-disable vue/no-v-html -->
                <span
                    :style="{ lineHeight: `${lineHeight}px` }"
                    class="v-toast__text"
                    data-test="message-text"
                    v-html="message"
                />
                <!--eslint-enable-->
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
import { Positions, Types } from '../helpers/config'
import { removeElement } from '../helpers/render'
import { Animation } from '../types'

export default defineComponent({
    name: 'ToastComponent',
    components: { DlAlert },
    props: {
        message: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'success',
            validator(value) {
                return Object.values(Types).includes(value)
            }
        },
        duration: {
            type: Number,
            default: 10
        },
        position: {
            type: String,
            default: Positions.bottom,
            validator(value) {
                return Object.values(Positions).includes(value)
            }
        },
        activeDuration: {
            type: Boolean,
            default: true
        },
        spaceBetweenMessages: {
            type: Number,
            default: 10
        },
        indentFromScreenBorder: {
            type: Number,
            default: 10
        },
        closable: {
            type: Boolean,
            default: true
        },
        lineHeight: {
            type: Number,
            default: 18
        }
    },
    setup(props) {
        const {
            position,
            duration,
            spaceBetweenMessages,
            indentFromScreenBorder,
            activeDuration
        } = props
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
            if (toastParentPosition.value === 'top') {
                root.value.style.marginBottom = `${spaceBetweenMessages}px`
            } else {
                root.value.style.marginTop = `${spaceBetweenMessages}px`
            }
            parent.insertAdjacentElement('afterbegin', root.value)
            parent.style.padding = `${indentFromScreenBorder}px`
            isActive.value = true
            if (duration && activeDuration) {
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

<style src="../styles/styles.scss" lang="scss"></style>
