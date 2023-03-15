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
                :closable="true"
            >
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="message" />
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
import { Positions } from '../helpers/config'
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
            default: 'success'
        },
        duration: {
            type: Number,
            default: 10
        },
        position: {
            type: String,
            default: Positions.BOTTOM,
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
        let parentTop = ref(null)
        let parentBottom = ref(null)
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
                case Positions.TOP:
                case Positions.TOP_RIGHT:
                case Positions.TOP_LEFT:
                    toastParentPosition.value = 'top'
                    return parentTop
                case Positions.BOTTOM:
                case Positions.BOTTOM_RIGHT:
                case Positions.BOTTOM_LEFT:
                    toastParentPosition.value = 'bottom'
                    return parentBottom
            }
        })

        const transition = computed((): Animation => {
            switch (position) {
                case Positions.TOP:
                case Positions.TOP_RIGHT:
                case Positions.TOP_LEFT:
                    return {
                        enter: 'v-toast--fade-in-down',
                        leave: 'v-toast--fade-out'
                    }
                case Positions.BOTTOM:
                case Positions.BOTTOM_RIGHT:
                case Positions.BOTTOM_LEFT:
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
            const wrapper = root.value.parentElement
            const parent = correctParent.value
            if (toastParentPosition.value === 'top') {
                root.value.style.marginBottom = `${spaceBetweenMessages}px`
            } else {
                root.value.style.marginTop = `${spaceBetweenMessages}px`
            }
            parent.insertAdjacentElement('afterbegin', root.value)
            parent.style.padding = `${indentFromScreenBorder}px`
            removeElement(wrapper)
            isActive.value = true
            if (duration && activeDuration) {
                setTimeout(() => {
                    closeToastMessage()
                }, duration * 1000)
            }
        }

        return {
            root,
            transition,
            isActive
        }
    }
})
</script>

<style src="../styles/styles.scss" lang="scss"></style>
