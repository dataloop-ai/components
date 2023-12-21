<template>
    <div
        ref="topRow"
        class="infinite-scroll-top"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createObserver } from './create-observer'
export default defineComponent({
    emits: ['scroll-to-top'],
    mounted() {
        createObserver(() => {
            this.$emit('scroll-to-top')
        }).observe(this.$refs.topRow as HTMLElement)
    }
})
</script>
