<template>
    <div
        ref="bottomRow"
        class="infinite-scroll-bottom"
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
    emits: ['scroll-to-bottom'],
    setup(props, { emit }) {
        const { containerRef } = toRefs(props)
        const bottomRow = ref(null)
        const observer = ref(null)

        const initObserver = () => {
            if (!bottomRow.value) {
                return
            }

            observer.value?.disconnect()
            observer.value = null

            observer.value = createIntersectionObserver(
                containerRef.value,
                () => {
                    emit('scroll-to-bottom')
                }
            )
            observer.value.observe(bottomRow.value as HTMLElement)
        }

        watch([containerRef, bottomRow], initObserver, { immediate: true })

        return {
            bottomRow
        }
    }
})
</script>

<style scoped lang="scss">
.infinite-scroll-bottom {
    content: '';
    height: 3px;
}
</style>
createIntersectionObservercreateIntersectionObserver./utils/create-observer./utils/createIntersectionObserver
