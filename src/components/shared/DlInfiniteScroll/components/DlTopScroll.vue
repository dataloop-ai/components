<template>
    <div
        ref="topRow"
        class="infinite-scroll-top"
    />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch } from 'vue-demi'
import { createIntersectionObserver } from '../utils'

export default defineComponent({
    props: {
        containerRef: {
            // todo: fix typing here
            type: null as any as PropType<HTMLElement>,
            default: null
        }
    },
    emits: ['scroll-to-top'],
    setup(props, { emit }) {
        const { containerRef } = toRefs(props)
        const topRow = ref(null)
        const observer = ref(null)

        const initObserver = () => {
            if (!topRow.value) {
                return
            }

            observer.value?.disconnect()
            observer.value = null

            observer.value = createIntersectionObserver(
                containerRef.value,
                () => {
                    emit('scroll-to-top')
                }
            )
            observer.value.observe(topRow.value as HTMLElement)
        }

        watch([containerRef, topRow], initObserver, { immediate: true })

        return {
            topRow
        }
    }
})
</script>

<style scoped lang="scss">
.infinite-scroll-top {
    content: '';
    height: 3px;
}
</style>
createIntersectionObservercreateIntersectionObserver./utils/create-observer./utils/createIntersectionObserver
