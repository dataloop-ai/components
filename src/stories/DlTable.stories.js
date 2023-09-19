import {
    DlTable,
    DlTh,
    DlTr,
    DlTd,
    DlButton,
    DlMenu,
    DlList,
    DlTypography,
    DlOptionGroup
} from '../'
import { times } from 'lodash'
import { onBeforeMount, ref } from 'vue-demi'
import './assets/tables.scss'

const tableColumns = [
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
        align: 'left',
        label: 'Calories',
        field: 'calories',
        sortable: true
    },
    {
        name: 'fat',
        label: 'Fat (g)',
        field: 'fat',
        align: 'left',
        sortable: true
    },
    { name: 'carbs', label: 'Carbs (g)', align: 'left', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', align: 'left', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', align: 'left', field: 'sodium' },
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        align: 'left',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        align: 'left',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
    }
]

const tableRows = [
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

export default {
    title: 'Library/Components/DlTable',
    component: DlTable,
    argTypes: {
        rowKey: {
            name: 'row-key',
            defaultValue: 'name',
            description:
                'Property of each row that defines the unique key of each row',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'name' }
            }
        },
        bordered: {
            name: 'bordered',
            type: { name: 'boolean', required: false },
            description: 'Applies a default border to the component',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        dense: {
            name: 'dense',
            type: { name: 'boolean', required: false },
            description: 'Each cell occupies less white space',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        separator: {
            name: 'separator',
            defaultValue: 'horizontal',
            description:
                'Use a separator/border between rows, columns or all cells',
            control: { type: 'select' },
            options: ['horizontal', 'vertical', 'cell', 'none']
        },
        draggable: {
            name: 'draggable',
            defaultValue: 'none',
            description:
                'Allows the user to drag the rows or columns in different positions',
            control: { type: 'select' },
            options: ['rows', 'columns', 'none', 'both']
        },
        title: {
            name: 'title',
            defaultValue: '',
            description: 'Show a title at the top of the table',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        color: {
            name: 'color',
            defaultValue: 'dl-color-secondary',
            description:
                'Color name for the component from the Dl color schema',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        },
        loading: {
            name: 'loading',
            type: { name: 'boolean', required: false },
            description: 'Put the table into loading state',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        resizable: {
            name: 'resizable',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            description:
                'Allow the user to resize the columns by dragging their edges',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hideNoData: {
            name: 'hideNoData',
            type: { name: 'boolean', required: false },
            description: 'Hide the default no data bottom layer',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hideHeader: {
            name: 'hideHeader',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Hide table header layer',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hideBottom: {
            name: 'hideBottom',
            type: { name: 'boolean', required: false },
            description:
                'Hide table bottom layer regardless of what it has to display',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        virtualScroll: {
            name: 'virtualScroll',
            type: { name: 'boolean', required: false },
            description: 'Enable virtual scrolling on the table component',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hidePagination: {
            name: 'hidePagination',
            type: { name: 'boolean', required: false },
            description: 'Hide the page navigator at the bottom of the table',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hideSelectedBanner: {
            name: 'hideSelectedBanner',
            type: { name: 'boolean', required: false },
            description: 'Hide the selected rows banner (if any)',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        loadingLabel: {
            name: 'loadingLabel',
            defaultValue: 'Loading',
            description:
                'Override default text to display when table is in loading state',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Loading' }
            }
        },
        noResultsLabel: {
            name: 'noResultsLabel',
            defaultValue: 'No Results',
            description:
                'Override default text to display when user filters the table and no matched results are found',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'No Results' }
            }
        },
        noDataLabel: {
            name: 'noDataLabel',
            defaultValue: 'No Data',
            description:
                'Override default text to display when no data is available',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'No Data' }
            }
        },
        titleClass: {
            name: 'titleClass',
            defaultValue: '',
            description:
                "CSS classes to apply to the title (if using 'title' prop)",
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        tableStyle: {
            name: 'tableStyle',
            defaultValue: '',
            description: 'CSS styles to apply to the table wrapper',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        tableClass: {
            name: 'tableClass',
            defaultValue: '',
            description: 'CSS classes to apply to the table wrapper',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        tableHeaderStyle: {
            name: 'tableHeaderStyle',
            description: 'CSS styles to apply to the table header wrapper',
            defaultValue: '',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        tableHeaderClass: {
            name: 'tableHeaderClass',
            defaultValue: '',
            description: 'CSS classes to apply to the table header wrapper',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        selectedRowsLabel: {
            name: 'selectedRowsLabel',
            defaultValue: (value) => `${value} records selected`,
            description: 'Text to display when user selected at least one row',
            control: 'text',
            table: {
                type: { summary: 'text' },
                defaultValue: {
                    summary: (value) => `${value} records selected`
                }
            }
        },
        pagination: {
            name: 'pagination',
            control: 'object',
            description:
                'Pagination object that defines how pagination will work',
            defaultValue: {
                sortBy: 'name',
                descending: false,
                page: 1,
                rowsPerPage: 25,
                rowsNumber: 10,
                maxDisplayRange: 7
            },
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: {
                        sortBy: 'name',
                        descending: false,
                        page: 1,
                        rowsPerPage: 25,
                        rowsNumber: 10,
                        maxDisplayRange: 7
                    }
                }
            }
        },
        rowsPerPageOptions: {
            name: 'rowsPerPageOptions',
            control: 'object',
            description: 'Choose how many rows fit per page indiviually',
            defaultValue: [10, 15, 20, 25, 50],
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: [10, 15, 20, 25, 50]
                }
            }
        },
        filter: {
            name: 'filter',
            control: 'text',
            description: 'String to filter table with',
            defaultValue: '',
            table: {
                type: { summary: 'text' },
                defaultValue: {
                    summary: ''
                }
            }
        },
        virtualScrollTarget: {
            name: 'virtualScrollTarget',
            control: 'text',
            description:
                'CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one',
            defaultValue: '',
            table: {
                type: { summary: 'text' },
                defaultValue: {
                    summary: ''
                }
            }
        },
        binaryStateSort: {
            name: 'binaryStateSort',
            description:
                'Skip the third state (unsorted) when user toggles column sort direction',
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: {
                    summary: false
                }
            }
        },
        columnSortOrder: {
            name: 'columnSortOrder',
            description: 'Choose the order columns will display in',
            control: 'select',
            defaultValue: 'asc',
            options: ['asc', 'des'],
            table: {
                type: { summary: 'select' },
                defaultValue: 'asc'
            }
        },
        visibleColumns: {
            name: 'visibleColumns',
            description: 'Array of Strings defining column names',
            control: 'object',
            defaultValue: [
                'name',
                'calories',
                'fat',
                'carbs',
                'protein',
                'sodium',
                'calcium',
                'iron'
            ],
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: [
                        'name',
                        'calories',
                        'fat',
                        'carbs',
                        'protein',
                        'sodium',
                        'calcium',
                        'iron'
                    ]
                }
            }
        },
        selection: {
            name: 'selection',
            control: 'select',
            description: 'Selection type',
            defaultValue: 'none',
            options: ['single', 'multiple', 'none'],
            table: {
                type: { summary: 'select' },
                defaultValue: {
                    summary: 'none'
                }
            }
        },
        selected: {
            name: 'selected',
            control: 'object',
            defaultValue: [],
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: []
                }
            }
        },
        expanded: {
            name: 'expanded',
            control: 'object',
            description: 'Keeps the user selection array',
            defaultValue: [],
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: []
                }
            }
        },
        columns: {
            name: 'columns',
            control: 'object',
            description: 'The column definitions (Array of Objects)',
            defaultValue: tableColumns,
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: 'none'
                }
            }
        },
        rows: {
            name: 'rows',
            control: 'object',
            description: 'The row definitions (Array of Objects)',
            defaultValue: tableRows,
            table: {
                type: { summary: 'object' },
                defaultValue: {
                    summary: 'none'
                }
            }
        }
    }
}

const DefaultTemplate = (args) => ({
    components: { DlTable },
    setup() {
        const columns = ref([])
        const rows = ref([])
        const selected = ref([])

        onBeforeMount(() => {
            rows.value = tableRows
            columns.value = tableColumns
            selected.value = args.selected
        })

        const updateSelected = (payload) => {
            selected.value = payload
        }

        return {
            args,
            columns,
            rows,
            selected,
            updateSelected
        }
    },
    template: `
    <div style="padding: 50px">
    <dl-table
    :columns="columns"
    :rows="rows"
    style="height: 500px"
    v-bind="args"
    :selected="selected"
    @update:selected="updateSelected"
    />
    </div>
   `
})
export const DefaultPreview = DefaultTemplate.bind({})
DefaultPreview.args = {}

const ExpandingRowsTemplate = (args) => ({
    components: { DlTable, DlTr, DlTh, DlTd, DlButton },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows)
        const expandedIndex = ref(-1)

        const setExpandedIndex = (index) => {
            if (index === expandedIndex.value) {
                expandedIndex.value = -1
                return
            }

            expandedIndex.value = index
        }

        return {
            args,
            columns,
            rows,
            setExpandedIndex,
            expandedIndex
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            title="Treats"
            v-bind="args"
            :rows="rows"
            :columns="columns"
            row-key="name"
        >
            <template v-slot:header="props">
                <dl-tr :props="props">
                    <dl-th auto-width />
                    <dl-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        {{ col.label }}
                    </dl-th>
                </dl-tr>
            </template>
            <template v-slot:body="props">
                <dl-tr :props="props">
                    <dl-td auto-width>
                        <dl-button
                            :icon="expandedIndex === props.rowIndex ? 'icon-dl-down-chevron' : 'icon-dl-right-chevron'"
                            text-color="dl-color-darker"
                            style="padding: 0; border-width: 0!important; :active: border-width: 0"
                            size="s"
                            flat
                            @click="setExpandedIndex(props.rowIndex)"
                        />
                    </dl-td>
                    <dl-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        {{ col.value }}
                    </dl-td>
                </dl-tr>
                <dl-tr v-show="expandedIndex === props.rowIndex" :props="props" style="background-color: var(--dl-color-fill);">
                    <dl-td colspan="100%" style="padding: 16px 16px 16px 32px;">
                        <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
                    </dl-td>
                </dl-tr>
            </template>
        </dl-table>
    </div>
   `
})
export const ExpandingRowsPreview = ExpandingRowsTemplate.bind({})
ExpandingRowsPreview.args = {}

const CellBackgroundTemplate = (args) => ({
    components: { DlTable, DlTr, DlTh, DlTd, DlButton },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows)

        return {
            args,
            columns,
            rows
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            title="Treats"
            v-bind="args"
            :rows="rows"
            :columns="columns"
            row-key="name"
        >
            <template v-slot:header="props">
                <dl-tr :props="props">
                    <dl-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        {{ col.label }}
                    </dl-th>
                </dl-tr>
            </template>
            <template #body-cell-calories="props">
                <dl-td :props="props" bgColor="#FFE1E1">
                    {{ props.col.label }}
                </dl-td>
            </template> -->
        </dl-table>
    </div>
   `
})
export const CellBackgroundPreview = CellBackgroundTemplate.bind({})
CellBackgroundPreview.args = {}

const ControlVisibleColumnsTemplate = (args) => ({
    components: {
        DlTable,
        DlTr,
        DlTh,
        DlTd,
        DlButton,
        DlList,
        DlOptionGroup,
        DlTypography,
        DlMenu
    },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows)

        return {
            args,
            columns,
            rows
        }
    },
    template: `
        <div style="padding: 50px">
        <dl-table
         :rows="rows"
         :columns="columns"
         title="Editable Columns"
         has-editable-columns
         />
         </div>
   `
})
export const ControlVisibleColumnsPreview = ControlVisibleColumnsTemplate.bind(
    {}
)
ControlVisibleColumnsPreview.args = {}

const StickyHeaderAndColumnTemplate = (args) => ({
    components: {
        DlTable,
        DlTr,
        DlTh,
        DlTd,
        DlButton,
        DlList,
        DlOptionGroup,
        DlTypography,
        DlMenu
    },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows)
        const visibleColumns = ref([
            'name',
            'calories',
            'fat',
            'carbs',
            'protein',
            'sodium',
            'calcium',
            'iron'
        ])

        const options = columns.value.map((item) => ({
            label: item.label,
            value: item.name
        }))

        return {
            args,
            columns,
            rows,
            visibleColumns,
            options
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            class="my-sticky-header-column-table"
            v-bind="args"
            :rows="rows"
            :columns="columns"
            :visibleColumns="visibleColumns"
            row-key="name"
        >
        </dl-table>
    </div>
   `
})
export const StickyHeaderAndColumnPreview = StickyHeaderAndColumnTemplate.bind(
    {}
)
StickyHeaderAndColumnPreview.args = {}

const StickyHeaderAndColumnTemplate2 = (args) => ({
    components: {
        DlTable,
        DlTr,
        DlTh,
        DlTd,
        DlButton,
        DlList,
        DlOptionGroup,
        DlTypography,
        DlMenu
    },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows)
        const visibleColumns = ref([
            'name',
            'calories',
            'fat',
            'carbs',
            'protein',
            'sodium',
            'calcium',
            'iron'
        ])

        const options = columns.value.map((item) => ({
            label: item.label,
            value: item.name
        }))

        return {
            args,
            columns,
            rows,
            visibleColumns,
            options
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            class="my-sticky-header-column-table-2"
            v-bind="args"
            :rows="rows"
            :columns="columns"
            :visibleColumns="visibleColumns"
            row-key="name"
        >
        </dl-table>
    </div>
   `
})
export const StickyHeaderAndColumnPreview2 =
    StickyHeaderAndColumnTemplate2.bind({})
StickyHeaderAndColumnPreview2.args = {}

const AddRowTemplate = (args) => ({
    components: {
        DlTable,
        DlTr,
        DlTh,
        DlTd,
        DlButton
    },
    setup() {
        const columns = ref(tableColumns)
        const rows = ref(tableRows.slice(0, 4))

        const isEditing = ref(false)

        const newRow = ref({
            name: '',
            calories: '',
            fat: '',
            carbs: '',
            protein: '',
            sodium: '',
            calcium: '',
            iron: ''
        })

        const visibleColumns = ref([
            'name',
            'calories',
            'fat',
            'carbs',
            'protein',
            'sodium',
            'calcium',
            'iron'
        ])

        const handleChange = (e) => {
            newRow.value = {
                ...newRow.value,
                [e.target.name]: e.target.value
            }
        }

        const addNewRow = () => {
            rows.value = [...rows.value, newRow.value]

            newRow.value = {
                name: '',
                calories: '',
                fat: '',
                carbs: '',
                protein: '',
                sodium: '',
                calcium: '',
                iron: ''
            }

            isEditing.value = false
        }

        return {
            args,
            columns,
            rows,
            visibleColumns,
            isEditing,
            newRow,
            handleChange,
            addNewRow
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            title="Treats"
            v-bind="args"
            :rows="rows"
            :columns="columns"
            :visibleColumns="visibleColumns"
            row-key="name"
        >
       
        <template #bottom-row="props">
        <dl-tr v-if="isEditing">
                <dl-td v-for="option in visibleColumns"> 
                    <input class="add-row-input" :name="option" :placeholder="option" :value="newRow[option]" @input="handleChange($event)" />
                </dl-td>
           
        </dl-tr>
        <dl-tr>
        <dl-button v-if="isEditing === false" @click="isEditing = true" flat icon="icon-dl-add" label="Add New Row" />
        <dl-button v-if="isEditing === true" @click="addNewRow" flat icon="icon-dl-add" label="Save" />
        </dl-tr>
        </template> 
        </dl-table>
    </div>
   `
})

export const AddRowPreview = AddRowTemplate.bind({})
AddRowPreview.args = {}

ControlVisibleColumnsPreview.args = {}

const EmptyTableTemplate = (args) => ({
    components: {
        DlTable
    },
    setup() {
        const columns = ref(tableColumns)
        const options = columns.value.map((item) => ({
            label: item.label,
            value: item.name
        }))

        return {
            args,
            columns,
            rows: [],
            options
        }
    },
    template: `
    <div style="padding: 50px">
        <dl-table
            v-bind="args"
            :rows="rows"
            :columns="columns"
            row-key="name"
        >
        </dl-table>
    </div>
   `
})
export const EmptyTablePreview = EmptyTableTemplate.bind({})
EmptyTablePreview.args = {}
