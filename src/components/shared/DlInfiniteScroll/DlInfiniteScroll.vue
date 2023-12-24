<template>
    <div
        ref="containerRef"
        class="dl-infinite-scroll"
    >
        <DlTopScroll
            :container-ref="containerRef"
            @scroll-to-top="onScrollToTop"
        />
        <div
            v-for="item in displayItems"
            :key="itemKey(item)"
        >
            <slot :item="item" />
        </div>
        <DlBottomScroll
            :container-ref="containerRef"
            @scroll-to-bottom="onScrollToBottom"
        />
    </div>
</template>
<script lang="ts">
import {
    computed,
    defineComponent,
    PropType,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { DlTopScroll, DlBottomScroll } from './components'

const MAX_SLICE_SIZE = 1000
const MIN_SLICE_SIZE = 50

export default defineComponent({
    name: 'DlInfiniteScroll',
    components: { DlTopScroll, DlBottomScroll },
    props: {
        items: {
            type: Array as PropType<Record<string, any>[]>,
            default: () => [] as Record<string, any>[]
        },
        pageSize: {
            type: Number,
            default: MIN_SLICE_SIZE,
            validator: (val: number) =>
                val <= MAX_SLICE_SIZE && val >= MIN_SLICE_SIZE
        }
    },
    emits: [],
    setup(props, { emit }) {
        const { items, pageSize } = toRefs(props)
        const containerRef = ref(null)
        const currentPage = ref(0)
        const pagesCount = ref(0)
        const itemPages = ref(new Map<number, Record<string, any>[]>())

        const displayItems = computed(() => {
            const page = currentPage.value
            const items = itemPages.value.get(page)
            return items ?? []
        })

        const itemKey = (item: any) => {
            return item.id ?? item.key ?? JSON.stringify(item)
        }

        const splitArrayIntoPages = (
            arr: Record<string, any>[],
            pageSize: number
        ): Map<number, any[]> => {
            pagesCount.value = Math.ceil(arr.length / pageSize)
            const pages = new Map<number, any[]>()

            for (let i = 0; i < pagesCount.value; i++) {
                const start = i * pageSize
                const end = start + pageSize
                pages.set(i + 1, arr.slice(start, end))
            }

            return pages
        }

        const onScrollToTop = () => {
            if (currentPage.value <= 0) {
                emit('scroll-to-top')
            } else {
                currentPage.value--
            }

            containerRef.value.scrollTop -= pageSize.value
        }
        const onScrollToBottom = () => {
            if (currentPage.value >= pagesCount.value - 1) {
                emit('scroll-to-top')
            } else {
                currentPage.value--
            }

            containerRef.value.scrollTop += pageSize.value
        }

        watch(
            [items, pageSize],
            () => {
                currentPage.value = 0
                itemPages.value = splitArrayIntoPages(
                    items.value,
                    pageSize.value
                )
            },
            { immediate: true }
        )

        return {
            containerRef,
            onScrollToTop,
            onScrollToBottom,
            displayItems,
            itemKey
        }
    }
})
</script>
<style scoped lang="scss"></style>
