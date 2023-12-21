<template>
    <div>
        <span>List</span>
        <dl-list
            ref="listRef"
            class="item-list"
        >
            <dl-top-scroll @scroll-to-top="handleListScrollToTop" />
            <dl-list-item
                v-for="row in rows"
                :key="row.id"
            >
                {{ row.name }}
            </dl-list-item>
            <dl-bottom-scroll @scroll-to-bottom="handleListScrollToBottom" />
        </dl-list>
        <div style="margin-top: 100px">
            <p>Infinite scrolling With custom data and weird expandable</p>
            <dl-table
                :loading="loading"
                :rows="rows"
                :columns="columns"
                style="height: 500px; width: 600px"
                row-key="index"
                infinite-scroll
                expandable-rows
                :rows-per-page-options="[rowsPerPage]"
                @scroll-to-bottom="handleTableScrollToBottom"
                @scroll-to-top="handleTableScrollToTop"
            >
                <template #body-cell-expandable-content="{ row }">
                    <div>
                        {{ row }}
                    </div>
                    <div>
                        {{ row }}
                    </div>
                    <div>
                        {{ row }}
                    </div>
                    <div>
                        {{ row }}
                    </div>
                    <div>
                        {{ row }}
                    </div>
                </template>
            </dl-table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlTopScroll from '../components/shared/DlInfiniteScroll/DlTopScroll.vue'
import DlBottomScroll from '../components/shared/DlInfiniteScroll/DlBottomScroll.vue'
import { DlList } from '../components/essential'
import { DlListItem } from '../components/basic'
import { DlTable } from '../components/compound'
import { columns } from './DlTableDemo.vue'
import { cloneDeep, times } from 'lodash'

const getRows = (count: number) =>
    times(count, (index) => ({
        name: 'KitKat' + index,
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
    }))

const items = getRows(10000)

export default defineComponent({
    components: {
        DlTopScroll,
        DlBottomScroll,
        DlList,
        DlListItem,
        DlTable
    },
    setup() {
        const loading = ref(false)
        const scrollOffset = 500
        const rowsPerPage = 30
        const sliceIndex = { from: 0, to: 0 }
        const rows = ref(cloneDeep(items.slice(0, 30)))
        const listRef = ref(null)

        const handleInfiniteScroll = (
            rowsPerPage: number,
            direction: 'top' | 'bottom',
            maxLength: number,
            ref: HTMLElement
        ) => {
            loading.value = true
            setTimeout(() => {
                if (!sliceIndex.to) sliceIndex.to = rowsPerPage
                if (direction === 'bottom') {
                    sliceIndex.to += rowsPerPage
                    if (rows.value.length > maxLength) {
                        sliceIndex.from += rowsPerPage
                        ref.scrollTop -= scrollOffset
                    }
                } else {
                    sliceIndex.from -= rowsPerPage
                    if (rows.value.length > maxLength) {
                        sliceIndex.to -= rowsPerPage
                        ref.scrollTop += scrollOffset
                    }
                    if (sliceIndex.from < 0) {
                        sliceIndex.from = 0
                    }
                }
                rows.value = items.slice(sliceIndex.from, sliceIndex.to)
                loading.value = false
            }, 500)
        }
        const handleListScrollToBottom = () => {
            handleInfiniteScroll(rowsPerPage, 'bottom', 100, listRef.value.$el)
        }
        const handleListScrollToTop = () => {
            handleInfiniteScroll(rowsPerPage, 'top', 100, listRef.value.$el)
        }
        const handleTableScrollToBottom = (
            rowsPerPage: number,
            ref: HTMLElement
        ) => {
            handleInfiniteScroll(rowsPerPage, 'bottom', 100, ref)
        }
        const handleTableScrollToTop = (
            rowsPerPage: number,
            ref: HTMLElement
        ) => {
            handleInfiniteScroll(rowsPerPage, 'top', 100, ref)
        }

        return {
            items,
            rows,
            columns,
            loading,
            listRef,
            rowsPerPage,
            handleListScrollToBottom,
            handleListScrollToTop,
            handleTableScrollToBottom,
            handleTableScrollToTop
        }
    }
})
</script>

<style scoped>
.item-list {
    height: 300px;
    overflow-y: auto;
    padding: 10px;
}
</style>
