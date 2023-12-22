<template>
    <div
        ref="bottomRow"
        class="infinite-scroll-bottom"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { createObserver } from './create-observer'
export default defineComponent({
    props: {
        containerRef: {
            type: Object as PropType<HTMLElement>,
            default: null
        }
    },
    emits: ['scroll-to-bottom'],
    mounted() {
        this.$nextTick(() => {
            createObserver(this.containerRef, () => {
                this.$emit('scroll-to-bottom')
            }).observe(this.$refs.bottomRow as HTMLElement)
        })
    }
})
</script>
