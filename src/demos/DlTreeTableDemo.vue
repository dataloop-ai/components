<template>
    <div style="width: 900px; align-items: inherit">
        <div>
            <div class="settings">
                <dl-switch
                    left-label="bordered"
                    value="bordered"
                    :model-value="borderState"
                    @update:model-value="updateBorderedState"
                />
                <dl-switch
                    left-label="dense"
                    value="dense"
                    :model-value="denseState"
                    @update:model-value="updateDenseState"
                />
                <dl-switch
                    left-label="virtual scroll"
                    value="vScroll"
                    :model-value="virtualScroll"
                    @update:model-value="updateVirtualScrollState"
                />
                <dl-switch
                    left-label="resizable"
                    value="resizable"
                    :model-value="resizableState"
                    @update:model-value="updateResizableState"
                />
                <dl-input
                    v-model="filter"
                    title="Filter"
                    style="width: 220px"
                    placeholder="Filter option"
                    size="m"
                    type="text"
                />
                <div>
                    <p>Separator</p>
                    <DlOptionGroup
                        v-model="separator"
                        inline
                        :options="[
                            {
                                label: 'Horizontal (default)',
                                value: 'horizontal'
                            },
                            { label: 'Vertical', value: 'vertical' },
                            { label: 'Cell', value: 'cell' },
                            { label: 'None', value: 'none' }
                        ]"
                    />
                </div>

                <div>
                    <p>Selection</p>
                    <DlOptionGroup
                        v-model="selection"
                        inline
                        :options="[
                            { label: 'none', value: 'none' },
                            { label: 'single', value: 'single' },
                            { label: 'multiple', value: 'multiple' }
                        ]"
                    />
                </div>

                <div>
                    <p>Loading</p>
                    <DlOptionGroup
                        v-model="loading"
                        inline
                        :options="[
                            { label: 'True', value: true },
                            { label: 'False', value: false }
                        ]"
                    />
                </div>
            </div>
            <DlTreeTable
                :selected="selected"
                :separator="separator"
                :columns="tableColumns"
                :bordered="bordered"
                :draggable="draggable"
                :dense="dense"
                class="sticky-header"
                :filter="filter"
                :selection="selection"
                :loading="loading"
                :rows="tableRows"
                :resizable="resizable"
                row-key="name"
                color="dl-color-secondary"
                title="Table Title"
                :virtual-scroll="vScroll"
                style="height: 500px"
                :rows-per-page-options="rowsPerPageOptions"
                @row-click="log"
                @th-click="log"
                @update:selected="updateSeleted"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {
    DlTable,
    DlOptionGroup,
    DlSwitch,
    DlInput,
    DlButton,
    DlTreeTable
} from '../components'
import { defineComponent, ref, computed, nextTick } from 'vue-demi'
import { times, cloneDeep } from 'lodash'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true
    },
    {
        name: 'calories',
        align: 'center',
        label: 'Calories',
        field: 'calories',
        sortable: true
    },
    { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    }
]

const rows = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%'
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%'
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%'
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%'
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%'
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%'
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%'
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%'
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
    },
    ...times(100, (index) => ({
        name: 'KitKat' + index,
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
    }))
]

const rows2 = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6,
        carbs: 24,
        protein: 4,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
        children: [
            {
                name: 'Eclair1',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%'
            }
        ]
    },
    {
        name: 'Eclair2',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        level: 2
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%',
        children: [
            {
                name: 'Eclair3',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%',
                children: [
                    {
                        name: 'Eclair4',
                        calories: 262,
                        fat: 16,
                        carbs: 23,
                        protein: 6,
                        sodium: 337,
                        calcium: '6%',
                        iron: '7%',
                        children: [
                            {
                                name: 'Eclair5',
                                calories: 262,
                                fat: 16,
                                carbs: 23,
                                protein: 6,
                                sodium: 337,
                                calcium: '6%',
                                iron: '7%',
                                children: [
                                    {
                                        name: 'Eclair6',
                                        calories: 262,
                                        fat: 16,
                                        carbs: 23,
                                        protein: 6,
                                        sodium: 337,
                                        calcium: '6%',
                                        iron: '7%',
                                        children: [
                                            {
                                                name: 'EclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclair',
                                                calories: 262,
                                                fat: 16,
                                                carbs: 23,
                                                protein: 6,
                                                sodium: 337,
                                                calcium: '6%',
                                                iron: '7%'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Eclair7',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        children: [
            {
                name: 'Eclair8',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%'
            }
        ],
        level: 2
    },
    {
        name: 'Eclair9',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        level: 3
    }
]

type Rows = (typeof rows)[0]

interface RowsWithIndex extends Rows {
    index?: number
}

export default defineComponent({
    components: {
        DlSwitch,
        DlOptionGroup,
        DlInput,
        DlTreeTable
    },
    setup() {
        const filter = ref('')
        const selected = ref([])
        const selection = ref('none')
        const separator = ref('horizontal')
        const bordered = ref(false)
        const loading = ref(false)
        const dense = ref(false)
        const vScroll = ref(false)
        const resizable = ref(false)
        const borderState = ref([])
        const denseState = ref([])
        const virtualScroll = ref([])
        const resizableState = ref([])
        const tableRows = ref(cloneDeep(rows2))
        const draggable = ref('both')
        const tableColumns = ref(columns)
        const rowsPerPageOptions = ref([10, 12, 14, 16])

        const infiniteLoading = ref(false)

        const nextPageNumber = ref(2)

        let allRows: RowsWithIndex[] = []
        for (let i = 0; i < 100; i++) {
            allRows = allRows.concat(
                cloneDeep(rows)
                    .slice(0)
                    .map((r) => ({ ...r }))
            )
        }
        allRows.forEach((row, index) => {
            row.index = index
        })

        const pageSize = 50
        const lastPageNumber = Math.ceil(allRows.length / pageSize)

        const computedRows = computed(() =>
            allRows.slice(0, pageSize * (nextPageNumber.value - 1))
        )

        const onScroll = ({ to, ref }: { to: number; ref: any }) => {
            const lastIndex = computedRows.value.length - 1

            if (
                infiniteLoading.value !== true &&
                nextPageNumber.value < lastPageNumber &&
                to === lastIndex
            ) {
                infiniteLoading.value = true

                setTimeout(() => {
                    nextPageNumber.value++
                    nextTick(() => {
                        ref.refresh()
                        infiniteLoading.value = false
                    })
                }, 500)
            }
        }

        const pagination = ref({
            sortBy: 'desc',
            descending: false,
            page: 2,
            rowsPerPage: 3
            // rowsNumber: xx if getting data from a server
        })

        const pagesNumber = computed(() => {
            return Math.ceil(rows.length / pagination.value.rowsPerPage)
        })

        function fixPagination(p: typeof pagination.value) {
            if (p.page < 1) {
                p.page = 1
            }
            if (p.rowsPerPage !== void 0 && p.rowsPerPage < 1) {
                p.rowsPerPage = 0
            }
            return p
        }

        const lastRowIndex = computed(() => {
            const { page, rowsPerPage } = pagination.value
            return page * rowsPerPage
        })

        const setPagination = (val: Partial<typeof pagination.value>) => {
            pagination.value = fixPagination({
                ...pagination.value,
                ...val
            })
        }

        function firstPage() {
            setPagination({ page: 1 })
        }

        function prevPage() {
            const { page } = pagination.value
            if (page > 1) {
                setPagination({ page: page - 1 })
            }
        }

        function nextPage() {
            const { page, rowsPerPage } = pagination.value

            if (
                lastRowIndex.value > 0 &&
                page * rowsPerPage < tableRows.value.length
            ) {
                setPagination({ page: page + 1 })
            }
        }

        const isLastPage = computed(
            () => pagination.value.page >= pagesNumber.value
        )

        const isFirstPage = computed(() => pagination.value.page === 1)

        function lastPage() {
            setPagination({ page: pagesNumber.value })
        }

        return {
            filter,
            selected,
            selection,
            separator,
            bordered,
            loading,
            dense,
            vScroll,
            resizable,
            denseState,
            borderState,
            virtualScroll,
            resizableState,
            tableRows,
            draggable,
            tableColumns,
            rowsPerPageOptions,
            onScroll,
            computedRows,
            infiniteLoading,
            pagination,
            pagesNumber,
            firstPage,
            lastPage,
            nextPage,
            prevPage,
            isLastPage,
            isFirstPage
        }
    },

    methods: {
        updateSeleted(payload: any) {
            this.selected = payload
        },
        updateBorderedState(val: boolean[]): void {
            this.borderState = val

            this.bordered = val.length !== 0
        },
        updateVirtualScrollState(val: boolean[]): void {
            this.virtualScroll = val

            this.vScroll = val.length !== 0
        },
        updateDenseState(val: boolean[]): void {
            this.denseState = val

            this.dense = val.length !== 0
        },
        updateResizableState(val: boolean[]): void {
            this.resizableState = val

            this.resizable = val.length !== 0
        },
        log(...args: any[]) {
            console.log(...args)
        }
    }
})
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    width: 100%;
    max-width: 600px;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    & > * {
        flex-grow: 1;
    }
}

.sticky-header {
    ::v-deep .dl-table__top,
    ::v-deep .dl-table__bottom,
    ::v-deep thead tr:first-child th {
        /* bg color is important for th; just specify one */
        background-color: var(--dl-color-panel-background);
    }
    ::v-deep thead tr th {
        position: sticky !important;
        z-index: 1;
    }
    ::v-deep thead tr:first-child th {
        top: 0;
    }
    /* this is when the loading indicator appears */
    &.dl-table--loading thead tr:last-child th {
        /* height of all previous header rows */
        top: 40px;
    }
}
</style>
