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
                @update:selected="updateSeleted"
            />

            <div style="margin-top: 100px">
                <p>Infinite scrolling</p>
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :draggable="draggable"
                    class="sticky-header"
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
                    :pagination="{ rowsPerPage: 0 }"
                    virtual-scroll
                    :rows-per-page-options="[0]"
                    @virtual-scroll="onScroll"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DlTable, DlOptionGroup, DlSwitch, DlInput } from '../components'
import { defineComponent, ref, computed, nextTick, watch } from 'vue-demi'
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

export default defineComponent({
    components: {
        DlTable,
        DlSwitch,
        DlOptionGroup,
        DlInput
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

        const nextPage = ref(2)

        let allRows = []
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
        const lastPage = Math.ceil(allRows.length / pageSize)

        const computedRows = computed(() =>
            allRows.slice(0, pageSize * (nextPage.value - 1))
        )

        const onScroll = ({ to, ref }) => {
            const lastIndex = computedRows.value.length - 1

            if (
                infiniteLoading.value !== true &&
                nextPage.value < lastPage &&
                to === lastIndex
            ) {
                infiniteLoading.value = true

                setTimeout(() => {
                    nextPage.value++
                    nextTick(() => {
                        ref.refresh()
                        infiniteLoading.value = false
                    })
                }, 500)
            }
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
            infiniteLoading
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
