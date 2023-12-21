<template>
    <div
        ref="bottomRow"
        class="infinite-scroll-bottom"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createObserver } from './create-observer'
export default defineComponent({
    emits: ['scroll-to-bottom'],
    mounted() {
        createObserver(() => {
            this.$emit('scroll-to-bottom')
        }).observe(this.$refs.bottomRow as HTMLElement)
    }
})
</script>
