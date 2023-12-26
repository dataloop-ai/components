<template>
    <div
        ref="containerRef"
        class="dl-infinite-scroll"
        :style="computedStyles"
        :class="computedClasses"
    >
        <DlTopScroll
            :container-ref="containerRef"
            @scroll-to-top="onScrollToTop"
        />
        <slot
            name="content"
            :items="displayItems"
        >
            <div
                v-for="item in displayItems"
                :key="itemKey(item)"
            >
                <slot :item="item" />
            </div>
        </slot>
        <DlBottomScroll
            :container-ref="containerRef"
            @scroll-to-bottom="onScrollToBottom"
        />
    </div>
</template>
<script lang="ts">
import { cloneDeep } from 'lodash'
import {
    computed,
    defineComponent,
    nextTick,
    PropType,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { DlTopScroll, DlBottomScroll } from './components'

const MAX_SLICE_SIZE = 100
const DEFAULT_SLICE_SIZE = 15
const MIN_SLICE_SIZE = 0

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
            default: DEFAULT_SLICE_SIZE,
            validator: (val: number) =>
                val <= MAX_SLICE_SIZE && val >= MIN_SLICE_SIZE
        },
        scrollDebounce: {
            type: Number,
            default: 100
        }
    },
    emits: ['scroll-to-top', 'scroll-to-bottom'],
    setup(props, { emit, attrs }) {
        const { items, pageSize, scrollDebounce } = toRefs(props)
        const containerRef = ref(null)
        const currentPage = ref(0)
        const pagesCount = ref(0)
        const itemPages = ref(new Map<number, Record<string, any>[]>())
        const lastOp = ref<string>('')

        const computedStyles = computed<any>(() => {
            return attrs.style
        })
        const computedClasses = computed<any>(() => {
            return attrs.class
        })

        const displayItems = computed(() => {
            const page = currentPage.value
            const items = cloneDeep(itemPages.value.get(page))

            const prevPage = cloneDeep(itemPages.value.get(page - 1))
            const nextPage = cloneDeep(itemPages.value.get(page + 1))

            const toDisplay = items ?? []

            if (prevPage?.length && nextPage?.length) {
                toDisplay.unshift(...prevPage.slice(-pageSize.value))
                toDisplay.push(...nextPage.slice(0, pageSize.value))
            } else if (prevPage?.length) {
                toDisplay.unshift(...prevPage.slice(-pageSize.value))
            } else if (nextPage?.length) {
                toDisplay.push(...nextPage.slice(0, pageSize.value))
            }

            nextTick(() => {
                if (lastOp.value === 'top' && page !== 0) {
                    containerRef.value.scrollTop +=
                        containerRef.value.scrollHeight * 0.333
                } else if (
                    lastOp.value === 'bottom' &&
                    page !== pagesCount.value
                ) {
                    if (currentPage.value - 1 === 0) {
                        return
                    }

                    containerRef.value.scrollTop -=
                        containerRef.value.scrollHeight * 0.333
                }
            })

            return toDisplay
        })

        const itemKey = (item: any) => {
            return item.id ?? item.key ?? JSON.stringify(item)
        }

        const onScrollToTop = () => {
            lastOp.value = 'top'
            if (currentPage.value <= 0) {
                emit('scroll-to-top')
            } else {
                currentPage.value--
            }
        }
        const onScrollToBottom = () => {
            lastOp.value = 'bottom'
            if (currentPage.value >= pagesCount.value - 1) {
                emit('scroll-to-bottom')
            } else {
                currentPage.value++
            }
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
                pages.set(i, arr.slice(start, end))
            }

            return pages
        }

        watch(
            [items, pageSize],
            () => {
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
            itemKey,
            computedStyles,
            computedClasses
        }
    }
})
</script>
<style scoped lang="scss">
.dl-infinite-scroll {
    overflow-y: auto;
    height: 100%;
    width: 100%;
    position: relative;
    // To not allow any weird scroll jumping behavior
    scroll-behavior: auto !important;
}
</style>
