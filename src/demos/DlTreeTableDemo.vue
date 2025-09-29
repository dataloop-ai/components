<template>
    <div style="width: 900px; align-items: inherit">
        <div>
            <div class="settings">
                <div class="left-panel">
                    <div class="option-group">
                        <p>Separator:</p>
                        <DlOptionGroup
                            v-model="separator"
                            inline
                            :options="[
                                { label: 'Horizontal', value: 'horizontal' },
                                { label: 'Vertical', value: 'vertical' },
                                { label: 'Cell', value: 'cell' },
                                { label: 'None', value: 'none' }
                            ]"
                        />
                    </div>

                    <div class="option-group">
                        <p>Draggable:</p>
                        <DlOptionGroup
                            v-model="draggable"
                            inline
                            :options="[
                                { label: 'Rows', value: 'rows' },
                                { label: 'Columns', value: 'columns' },
                                { label: 'Both', value: 'both' },
                                { label: 'None', value: 'none' }
                            ]"
                        />
                    </div>

                    <div class="option-group">
                        <p>Selection:</p>
                        <DlOptionGroup
                            v-model="selection"
                            inline
                            :options="[
                                { label: 'None', value: 'none' },
                                { label: 'Single', value: 'single' },
                                { label: 'Multiple', value: 'multiple' }
                            ]"
                        />
                    </div>

                    <div class="filter-container">
                        <label for="filter">Filter:</label>
                        <dl-input
                            id="filter"
                            v-model="filter"
                            placeholder="Filter"
                            size="s"
                            type="text"
                        />
                    </div>
                </div>

                <div class="right-panel">
                    <button class="btn" @click="addRowPerPage">
                        Add Rows/Page
                    </button>

                    <div class="option-group">
                        <dl-switch
                            left-label="Bordered"
                            value="bordered"
                            :model-value="borderState"
                            @update:model-value="updateBorderedState"
                        />
                        <dl-switch
                            left-label="Dense"
                            value="dense"
                            :model-value="denseState"
                            @update:model-value="updateDenseState"
                        />
                        <dl-switch
                            left-label="Virtual Scroll"
                            value="vScroll"
                            :model-value="virtualScroll"
                            @update:model-value="updateVirtualScrollState"
                        />
                        <dl-switch
                            left-label="Resizable"
                            value="resizable"
                            :model-value="resizableState"
                            @update:model-value="updateResizableState"
                        />
                        <dl-switch
                            left-label="Disable Child Checkbox"
                            value="disableChildCheckbox"
                            :model-value="disableChildCheckboxState"
                            @update:model-value="
                                updateDisableChildCheckboxState
                            "
                        />
                    </div>
                </div>
            </div>
            <div style="margin-top: 100px">
                <DlTreeTable
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
                    row-key="id"
                    color="dl-color-secondary"
                    title="Table Title"
                    :virtual-scroll="vScroll"
                    style="height: 500px"
                    :rows-per-page-options="rowsPerPageOptions"
                    highlighted-row="Frozen Yogurt"
                    :disable-child-checkbox="disableChildCheckbox"
                    child-disabled-checkbox-tooltip="Child checkbox is disabled (parent is selected)"
                    @row-click="onRowClick"
                    @th-click="log"
                    @selected-items="selectedItems"
                    @row-reorder="reorderRows"
                    @col-update="updateColumns"
                />
            </div>
            <div style="padding-top: 300px">
                <p>Custom body cell</p>
                <DlTreeTable
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
                    @row-click="onRowClick"
                    @th-click="log"
                    @selectedItems="selectedItems"
                >
                    <template #body-cell-calories="prop">
                        <span style="color: green; margin-right: 10px">
                            calories: {{ prop.row.calories }}
                        </span>
                        <dl-icon
                            size="14px"
                            icon="icon-dl-info"
                            class="info-icon"
                        />
                    </template>
                    <template #body-cell-carbs="prop">
                        <span style="color: yellow">
                            carbs: {{ prop.row.carbs }}
                        </span>
                    </template>
                    <template #body-cell-iron="prop">
                        <span style="color: #1ae1dc">
                            iron: {{ prop.row.iron }}
                        </span>
                    </template>
                </DlTreeTable>
            </div>
            <div style="margin-top: 100px">
                <p>Custom table body slot</p>
                <DlTreeTable
                    class="sticky-header"
                    :separator="separator"
                    :columns="tableColumns"
                    color="dl-color-secondary"
                    style="height: 500px"
                >
                    <template #table-body>
                        <div style="width: 100px">
                            Custom body slot inside tree table
                        </div>
                    </template>
                </DlTreeTable>
            </div>
            <div style="margin-top: 100px">
                <p>Custom row body slot</p>
                <DlTreeTable
                    class="sticky-header"
                    :separator="separator"
                    :columns="tableColumns"
                    :rows="tableRows"
                    color="dl-color-secondary"
                    style="height: 500px"
                >
                    <template #row-body="{ row }">
                        <tr>
                            Custom row slot, row name:
                            {{
                                row.name
                            }}
                        </tr>
                    </template>
                </DlTreeTable>
            </div>
            <div>
                <p>With editable columns</p>
                <DlTreeTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    title="Editable Columns"
                    menu-class="editable-menu-class"
                    :visible-columns="tableColumns.slice(0, -1)"
                />
            </div>
            <div>
                <p>With nested field value</p>
                <div style="font-size: 12px">
                    Row array looks like this: {{ rows2 }}
                </div>
                <DlTreeTable
                    :rows="rows2"
                    :columns="columns2"
                    title="Nested Field"
                />
            </div>
            <div style="margin-top: 100px">
                <p>Empty State</p>
                <DlTreeTable
                    :separator="separator"
                    :columns="tableColumns"
                    :bordered="bordered"
                    :draggable="draggable"
                    :dense="dense"
                    class="sticky-header"
                    :filter="filter"
                    :selection="selection"
                    :loading="loading"
                    :rows="[]"
                    :resizable="resizable"
                    row-key="name"
                    color="dl-color-secondary"
                    title="Table Title"
                    :virtual-scroll="vScroll"
                    style="height: 500px"
                    :rows-per-page-options="rowsPerPageOptions"
                    is-empty
                    hide-pagination
                    @row-click="onRowClick"
                    @th-click="log"
                    @selectedItems="selectedItems"
                >
                    <template #no-data>
                        <div class="flex justify-center">
                            &lt slot#no-data > customizabled
                        </div>
                    </template>
                </DlTreeTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    DlOptionGroup,
    DlSwitch,
    DlInput,
    DlTreeTable,
    DlIcon
} from '../components'
import { defineComponent, ref, computed, nextTick, watch } from 'vue-demi'
import { times, cloneDeep } from 'lodash'
import { v4 } from 'uuid'
import { DlTableRow } from '../types'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        width: 100
    },
    {
        name: 'calories',
        align: 'center',
        label: 'Calories',
        field: 'calories',
        sortable: true,
        width: 100
    },
    {
        name: 'fat',
        label: 'Fat (g)',
        field: 'fat',
        sortable: true,
        align: 'center',
        width: 100
    },
    {
        name: 'carbs',
        label: 'Carbs (g)',
        field: 'carbs',
        align: 'center',
        width: 100
    },
    {
        name: 'protein',
        label: 'Protein (g)',
        field: 'protein',
        align: 'center',
        width: 100
    },
    {
        name: 'sodium',
        label: 'Sodium (mg)',
        field: 'sodium',
        align: 'center',
        width: 100
    },
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10),
        align: 'center',
        width: 100
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10),
        align: 'center',
        width: 100
    }
]

const rows = [
    {
        id: v4(),
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6,
        carbs: 24,
        protein: 4,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
        isExpanded: false,
        children: [
            {
                id: v4(),
                name: 'Eclair1',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%',
                isExpanded: false
            }
        ]
    },
    {
        id: v4(),
        name: 'Eclair2',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        isExpanded: false
    },
    {
        id: v4(),
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%',
        isExpanded: false,
        children: [
            {
                id: v4(),
                name: 'Eclair3.0',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%',
                isExpanded: false
            },
            {
                id: v4(),
                name: 'Eclair3',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%',
                isExpanded: false,
                children: [
                    {
                        id: v4(),
                        name: 'Eclair4',
                        calories: 262,
                        fat: 16,
                        carbs: 23,
                        protein: 6,
                        sodium: 337,
                        calcium: '6%',
                        iron: '7%',
                        isExpanded: false,
                        children: [
                            {
                                id: v4(),
                                name: 'Eclair5',
                                calories: 262,
                                fat: 16,
                                carbs: 23,
                                protein: 6,
                                sodium: 337,
                                calcium: '6%',
                                iron: '7%',
                                isExpanded: false,
                                children: [
                                    {
                                        id: v4(),
                                        name: 'Eclair6',
                                        calories: 262,
                                        fat: 16,
                                        carbs: 23,
                                        protein: 6,
                                        sodium: 337,
                                        calcium: '6%',
                                        iron: '7%',
                                        isExpanded: false,
                                        children: [
                                            {
                                                id: v4(),
                                                name: 'EclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclairEclair',
                                                calories: 262,
                                                fat: 16,
                                                carbs: 23,
                                                protein: 6,
                                                sodium: 337,
                                                calcium: '6%',
                                                iron: '7%',
                                                isExpanded: false
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
        id: v4(),
        name: 'Eclair7',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        isExpanded: false,
        children: [
            {
                id: v4(),
                name: 'Eclair8',
                calories: 262,
                fat: 16,
                carbs: 23,
                protein: 6,
                sodium: 337,
                calcium: '6%',
                iron: '7%',
                isExpanded: false
            }
        ]
    },
    {
        id: v4(),
        name: 'Eclair9',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
        isExpanded: false
    },
    ...times(5, (index) => ({
        id: v4(),
        name: 'KitKat' + index,
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%',
        isExpanded: false
    }))
]

const rows2 = [
    {
        name: {
            title: 'Row 1',
            subtitle: 'This row...'
        }
    },
    {
        name: {
            title: 'Row 2',
            subtitle: 'This other row...'
        }
    }
]
const columns2 = [
    {
        name: 'name',
        required: true,
        label: 'Nested value',
        align: 'left',
        field: 'name.subtitle',
        sortable: true,
        textTransform: 'uppercase',
        width: 100,
        hint: 'test hint'
    }
]
function markAllSelectable(list: DlTableRow[]): DlTableRow[] {
    return list.map((r) => ({
        ...r,
        isSelectable: true,
        ...(Array.isArray(r.children) && r.children.length
            ? { children: markAllSelectable(r.children) }
            : {})
    }))
}
export default defineComponent({
    components: {
        DlSwitch,
        DlOptionGroup,
        DlInput,
        DlTreeTable,
        DlIcon
    },
    setup() {
        const filter = ref('')
        const selectedData = ref([])
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
        const tableRows = ref(markAllSelectable(rows))
        const tableRowsVS = ref(cloneDeep(rows))
        const draggable = ref('both')
        const tableColumns = ref(columns)
        const rowsPerPageOptions = ref([10, 12, 14, 16])

        const infiniteLoading = ref(false)

        const nextPageNumber = ref(2)

        const disableChildCheckbox = ref(false)
        const disableChildCheckboxState = ref([])

        let allRows: DlTableRow[] = []
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

        const onRowClick = (item: any) => {
            console.log('onRowClick TreeTableDemo: ', item)
        }

        const reorderRows = (newRows: any[]) => {
            tableRows.value = newRows
        }
        const updateColumns = (newColumns: any) => {
            tableColumns.value = newColumns
        }
        return {
            reorderRows,
            updateColumns,
            filter,
            selectedData,
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
            tableRowsVS,
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
            isFirstPage,
            onRowClick,
            rows2,
            columns2,
            disableChildCheckbox,
            disableChildCheckboxState
        }
    },

    methods: {
        addRowPerPage() {
            this.rowsPerPageOptions.push(
                this.rowsPerPageOptions[this.rowsPerPageOptions.length - 1] + 2
            )
        },
        selectedItems(payload: any) {
            console.log('Demo updateSelected: ', payload)
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
        updateDisableChildCheckboxState(val: boolean[]): void {
            this.disableChildCheckboxState = val

            this.disableChildCheckbox = val.length !== 0
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
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    background-color: var(--dl-color-panel-background);
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

.left-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
}

.right-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

.btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
}

.option-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

p {
    font-weight: bold;
    font-size: 12px;
    margin: 0;
}

.dl-switch {
    display: flex;
    align-items: center;
    gap: 2px;
}

.filter-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

label {
    font-weight: bold;
    font-size: 12px;
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
