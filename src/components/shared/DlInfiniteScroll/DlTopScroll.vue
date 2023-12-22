<template>
    <div
        ref="topRow"
        class="infinite-scroll-top"
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
    emits: ['scroll-to-top'],
    mounted() {
        this.$nextTick(() => {
            createObserver(this.containerRef, () => {
                this.$emit('scroll-to-top')
            }).observe(this.$refs.topRow as HTMLElement)
        })
    }
})
</script>
