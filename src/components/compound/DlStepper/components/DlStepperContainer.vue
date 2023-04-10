<template>
    <transition
        name="fade"
        appear
        :style="cssVars"
    >
        <div>
            <slot />
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlStepperContainer',
    props: {
        duration: {
            type: Number,
            default: 0.3
        },
        transition: Boolean
    },
    computed: {
        cssVars(): Record<string, string> {
            return {
                '--dl-transition-duration':
                    (this.transition ? this.duration : 0) + 's'
            }
        }
    }
})
</script>

<style lang="scss" scoped>
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
