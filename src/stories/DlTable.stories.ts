// DlTable.stories.js|jsx|ts|tsx

import { DlTable } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { cloneDeep, isNumber, times } from 'lodash'
import { nextTick } from 'process'
import { computed, ref } from 'vue-demi'

const setupFunction = () => {
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
        rowsPerPage: 3,
        maxDisplayRange: 9
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

    const reorderRows = (newRows: any) => {
        tableRows.value = newRows
    }

    const updateColumns = (newColumns: any) => {
        console.log(newColumns)
        tableColumns.value = newColumns
    }

    return {
        reorderRows,
        updateColumns,
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
}

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
    ...times(1000, (index) => ({
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

type Story = StoryObj<typeof DlTable>

const meta: Meta<typeof DlTable> = {
    title: 'Library/Components/DlTable',
    component: DlTable
}
export default meta

export const DefaultTable: Story = {
    args: {
        rowKey: 'name',
        color: 'dl-color-secondary',
        title: 'Table Title',
        style: 'height: 500px'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlTable },
            props: args,
            setup: setupFunction,
            template: `
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
              @col-update="updateColumns"
              @row-reorder="reorderRows"
            />
           `
        }
    }
}

export const CustomRowBody: Story = {
    args: {
        rowKey: 'name',
        color: 'dl-color-secondary',
        title: 'Table Title',
        style: 'height: 500px'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlTable },
            props: args,
            setup: setupFunction,
            template: `
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
                <div style="width: 300px">
                    Custom row: {{ props.row.name }}
                </div>
                </template>
            </DlTable>
            </div>
            `
        }
    }
}

export const InfiniteScrolling: Story = {
    args: {
        rowKey: 'name',
        color: 'dl-color-secondary',
        title: 'Table Title',
        style: 'height: 500px'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlTable },
            props: args,
            setup: setupFunction,
            template: `
            <div style="margin-top: 100px">
            <p>Infinite scrolling</p>
            <DlTable
                :selected="selected"
                :separator="separator"
                :draggable="draggable"
                :filter="filter"
                :resizable="resizable"
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
            `
        }
    }
}

export const EditableColumns: Story = {
    args: {
        rowKey: 'name',
        color: 'dl-color-secondary',
        title: 'Table Title',
        style: 'height: 500px'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlTable },
            props: args,
            setup: setupFunction,
            template: `
            <div style="width: 900px">
            <p>With editable columns</p>
            <DlTable
                :rows="tableRows"
                :columns="tableColumns"
                title="Editable Columns"
                has-editable-columns
            />
            </div>
            `
        }
    }
}

export const EmptyData: Story = {
    args: {
        rowKey: 'name',
        color: 'dl-color-secondary',
        title: 'Table Title',
        style: 'height: 500px'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlTable },
            props: args,
            setup: setupFunction,
            template: `
            <div>
            <p>With empty data</p>
            <DlTable
                :rows="[]"
                :columns="tableColumns"
                title="empty data"
                no-data-label="NOoooooOOOOOoooooo"
             />
             </div>
            `
        }
    }
}
