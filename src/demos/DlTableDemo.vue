<template>
    <div style="width: 900px; align-items: inherit">
        <div>
            <div class="settings">
                <button @click="addRowPerPage">
                    Add Row Per Page
                </button>
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
                    <p>Draggable</p>
                    <DlOptionGroup
                        v-model="draggable"
                        inline
                        :options="[
                            { label: 'rows', value: 'rows' },
                            { label: 'columns', value: 'columns' },
                            { label: 'both', value: 'both' },
                            { label: 'none', value: 'none' }
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
            <DlTable
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

            <div style="margin-top: 100px">
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="tableColumns"
                    :bordered="bordered"
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
                    hide-pagination
                    is-empty
                    :empty-state-props="{
                        responsive: false,
                        style: 'min-height: 350px; width: 300px;',
                        bgSize: '130px',
                        bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                        title: 'Lorem ipsum',
                        subtitle:
                            'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                        info: 'To learn more about this analytics, read our documentation.'
                    }"
                    @row-click="log"
                    @th-click="log"
                    @update:selected="updateSeleted"
                >
                    <template #links="">
                        <div style="display: flex; gap: 5px; padding: 0 20px">
                            <dl-button
                                padding="0px"
                                icon="icon-dl-sdk-documentation"
                                flat
                                uppercase
                                label="SDK"
                            />
                            <div class="break" />
                            <dl-button
                                padding="0px"
                                icon="icon-dl-file"
                                flat
                                label="Documentation"
                            />
                            <div class="break" />
                            <dl-button
                                padding="0px"
                                icon="icon-dl-youtube"
                                flat
                                label="Video"
                            />
                        </div>
                    </template>
                </DlTable>
            </div>

            <div style="margin-top: 100px">
                Custom Slot `row-body`
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="tableColumns"
                    :bordered="bordered"
                    :dense="dense"
                    class="sticky-header"
                    :filter="filter"
                    :selection="selection"
                    :loading="loading"
                    :rows="tableRows"
                    :resizable="resizable"
                    row-key="id"
                    color="dl-color-secondary"
                    title="Table Title"
                    :virtual-scroll="vScroll"
                    style="height: 500px"
                    :rows-per-page-options="rowsPerPageOptions"
                    @row-click="log"
                    @th-click="log"
                    @update:selected="updateSeleted"
                >
                    <template #row-body="props">
                        <dl-tr :props="props">
                            <dl-td
                                v-for="(value, key) in Object.keys(props.row)"
                                :key="key"
                            >
                                {{ props.row[value] }}
                            </dl-td>
                        </dl-tr>
                    </template>
                </DlTable>
            </div>

            <div style="margin-top: 100px">
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="tableColumns"
                    :bordered="bordered"
                    :draggable="draggable"
                    :pagination="pagination"
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
                    hide-bottom
                    @row-click="log"
                    @update:selected="updateSeleted"
                >
                    <template #pagination="scope">
                        <dl-button
                            v-if="scope.pagesNumber > 2"
                            icon="icon-dl-first-page"
                            color="dl-color-secondary"
                            flat
                            :disabled="scope.isFirstPage"
                            @click="scope.firstPage"
                        />

                        <dl-button
                            icon="icon-dl-left-chevron"
                            color="dl-color-secondary"
                            flat
                            :disabled="scope.isFirstPage"
                            @click="scope.prevPage"
                        />

                        <dl-button
                            icon="icon-dl-right-chevron"
                            color="dl-color-secondary"
                            flat
                            :disabled="scope.isLastPage"
                            @click="scope.nextPage"
                        />

                        <dl-button
                            v-if="scope.pagesNumber > 2"
                            icon="icon-dl-last-page"
                            color="dl-color-secondary"
                            flat
                            :disabled="scope.isLastPage"
                            @click="scope.lastPage"
                        />
                    </template>
                </DlTable>

                <div>
                    <p>Custom pagination outside pagination slot</p>
                    <dl-button
                        v-if="pagesNumber > 2"
                        icon="icon-dl-first-page"
                        color="dl-color-secondary"
                        flat
                        :disabled="isFirstPage"
                        @click="firstPage"
                    />

                    <dl-button
                        icon="icon-dl-left-chevron"
                        color="dl-color-secondary"
                        flat
                        :disabled="isFirstPage"
                        @click="prevPage"
                    />

                    <dl-button
                        icon="icon-dl-right-chevron"
                        color="dl-color-secondary"
                        flat
                        :disabled="isLastPage"
                        @click="nextPage"
                    />

                    <dl-button
                        v-if="pagesNumber > 2"
                        icon="icon-dl-last-page"
                        color="dl-color-secondary"
                        flat
                        :disabled="isLastPage"
                        @click="lastPage"
                    />
                </div>

                <div style="margin-top: 100px">
                    <p>Infinite scrolling</p>
                    <DlTable
                        :selected="selected"
                        :separator="separator"
                        :draggable="draggable"
                        :filter="filter"
                        :selection="selection"
                        :dense="dense"
                        title="Treats"
                        color="dl-color-secondary"
                        :loading="infiniteLoading"
                        :rows="computedRows"
                        :columns="tableColumns"
                        style="height: 500px"
                        row-key="index"
                        virtual-scroll
                        @virtual-scroll="onScroll"
                    />
                </div>
            </div>
            <div>
                <h3>slots #no-data & #pagination declare together</h3>
                <h4>case 1: table with data</h4>
                <p>
                    rows should appear with slot#pagination, slot#no-data should
                    not
                </p>
                <DlTable
                    :rows="tableRows"
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
                    :resizable="resizable"
                    row-key="name"
                    color="dl-color-secondary"
                    title="Table Title"
                    :virtual-scroll="vScroll"
                    style="height: 200px"
                    :rows-per-page-options="rowsPerPageOptions"
                    @row-click="log"
                    @update:selected="updateSeleted"
                >
                    <template #pagination>
                        <div style="background-color: #4db1d3">
                            &lt slot#pagination >
                        </div>
                    </template>
                    <template #no-data>
                        <div style="background-color: #734145">
                            &lt slot#no-data > should not be visible
                        </div>
                    </template>
                </DlTable>
                <h4>case 2: table with no data</h4>
                <p>slot#no-data should appear, slot#pagination not</p>

                <DlTable
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
                    :resizable="resizable"
                    row-key="name"
                    color="dl-color-secondary"
                    title="Table Title"
                    :virtual-scroll="vScroll"
                    style="height: 200px"
                    :rows-per-page-options="rowsPerPageOptions"
                    @row-click="log"
                    @update:selected="updateSeleted"
                >
                    <template #pagination>
                        <div style="background-color: #734145">
                            &lt slot#pagination > should not be visible
                        </div>
                    </template>
                    <template #no-data>
                        <div style="background-color: #2f3c4b">
                            &lt slot#no-data >
                        </div>
                    </template>
                </DlTable>
            </div>

            <div>
                <p>Test reactive cells</p>
                first row:
                <div class="row">
                    <dl-input
                        v-for="(value, key) in tableRows[0]"
                        :key="key"
                        v-model="tableRows[0][key]"
                        :title="key"
                    />
                </div>

                <DlTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    title="Table Title"
                />
            </div>
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
    DlTr,
    DlTd
} from '../components'
import { defineComponent, ref, computed, nextTick } from 'vue-demi'
import { times, cloneDeep, isNumber } from 'lodash'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        textTransform: 'uppercase'
    },
    {
        name: 'calories',
        align: 'center',
        label: 'Calories',
        field: 'calories',
        sortable: true,
        textTransform: 'lowercase'
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
        textTransform: 'lowercase',
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        textTransform: 'lowercase',
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

type Rows = (typeof rows)[0]

interface RowsWithIndex extends Rows {
    index?: number
}

export default defineComponent({
    components: {
        DlTable,
        DlSwitch,
        DlOptionGroup,
        DlInput,
        DlButton,
        DlTr,
        DlTd
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
        const tableRows = ref(cloneDeep(rows))
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
            if (isNumber(p.rowsPerPage) && p.rowsPerPage < 1) {
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
        addRowPerPage() {
            this.rowsPerPageOptions.push(
                this.rowsPerPageOptions[this.rowsPerPageOptions.length - 1] + 2
            )
        },
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
        },
        filterMethod(
            rows: Record<string, any>[],
            filterTerms: string | Record<string, any>,
            cols: Record<string, any>[],
            cellValue: Function
        ) {
            const lowerTerms = filterTerms ? filterTerms.toLowerCase() : ''
            return rows.filter(
                (row) =>
                    !cols.some((col) => {
                        const val = cellValue(col, row) + ''
                        const haystack =
                            val === 'undefined' || val === 'null'
                                ? ''
                                : val.toLowerCase()
                        return haystack.indexOf(lowerTerms) > -1
                    })
            )
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
