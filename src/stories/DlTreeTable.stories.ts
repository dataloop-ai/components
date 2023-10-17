// DlTreeTable.stories.js|jsx|ts|tsx

import { DlTreeTable, DlIcon } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { cloneDeep, times } from 'lodash'
import { nextTick } from 'process'
import { v4 } from 'uuid'
import { computed, ref } from 'vue-demi'

const setupFunction = () => {
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
    const tableRows = ref(rows)
    const tableRowsVS = ref(cloneDeep(rows))
    const draggable = ref('both')
    const tableColumns = ref(columns)
    const rowsPerPageOptions = ref([10, 12, 14, 16])

    const infiniteLoading = ref(false)

    const nextPageNumber = ref(2)

    let allRows: any = []
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
        // console.log('onRowClick TreeTableDemo: ', item)
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
        onRowClick
    }
}

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

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        textTransform: 'uppercase',
        width: 100,
        hint: 'test hint'
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
        textTransform: 'lowercase',
        align: 'center',
        width: 100,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        textTransform: 'lowercase',
        align: 'center',
        width: 100,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    }
]

type Story = StoryObj<typeof DlTreeTable>

const meta: Meta<typeof DlTreeTable> = {
    title: 'Library/Components/DlTreeTable',
    component: DlTreeTable
}
export default meta

export const DefaultTreeTable: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlTreeTable },
            props: args,
            setup: setupFunction,
            template: `
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
                @selected-items="selectedItems"
                @row-reorder="reorderRows"
                @col-update="updateColumns"
            />
           `
        }
    }
}

export const CustomCellsTreeTable: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlTreeTable, DlIcon },
            props: args,
            setup: setupFunction,
            template: `
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
            `
        }
    }
}

export const CustomTableBody: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlTreeTable, DlIcon },
            props: args,
            setup: setupFunction,
            template: ` <DlTreeTable
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
                    `
        }
    }
}

export const EditableColumns: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlTreeTable, DlIcon },
            props: args,
            setup: setupFunction,
            template: `
            <div style="width: 900px">
            <p>With editable columns</p>
            <DlTreeTable
                :rows="tableRows"
                :columns="tableColumns"
                title="Editable Columns"
                :visible-columns="tableColumns.slice(0, -1)"
            />
            </div>
            `
        }
    }
}

export const EmptyState: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlTreeTable, DlIcon },
            props: args,
            setup: setupFunction,
            template: `
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
            `
        }
    }
}
