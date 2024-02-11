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
                    </div>
                </div>
            </div>
            <DlTable
                :selected="selected"
                :separator="separator"
                :columns="tableColumns"
                :bordered="bordered"
                :draggable="draggable"
                :dense="dense"
                :pagination="{
                    rowsPerPage: 10,
                    page: 2
                }"
                class="sticky-header"
                :filter="filter"
                :selection="selection"
                :loading="loading"
                :rows="tableRows"
                :resizable="resizable"
                :rows-per-page-options="[30]"
                row-key="name"
                color="dl-color-secondary"
                title="Table Title"
                :virtual-scroll="vScroll"
                style="height: 500px"
                @row-click="log"
                @th-click="log"
                @update:selected="updateSeleted"
                @col-update="updateColumns"
                @row-reorder="reorderRows"
            />
            <div style="margin-top: 100px">
                Fit table columns
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="tableColumns"
                    fit-all-columns
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

                ALot of columns and fit
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="[...tableColumns, ...tableColumns]"
                    fit-all-columns
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
            </div>

            <div style="margin-top: 100px">
                Custom Slot row-body
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

            <div style="margin-top: 100px">
                Expandable Rows
                <DlTable
                    :expanded="expanded"
                    :columns="tableColumns"
                    expandable-rows
                    class="sticky-header"
                    :rows="tableRows"
                    row-key="id"
                    style="height: 500px"
                    :rows-per-page-options="rowsPerPageOptions"
                    @row-click="log"
                    @th-click="log"
                    @update:selected="updateSeleted"
                    @update:expanded="updateExpanded"
                >
                    <template #body-cell-expandable-content="{ row }">
                        <div
                            v-if="
                                [
                                    tableRows[0].name,
                                    tableRows[1].name,
                                    tableRows[2].name
                                ].includes(row.name)
                            "
                            class="expanded-row"
                        >
                            This is some more information about {{ row.name }}
                        </div>
                        <div
                            v-else-if="
                                [
                                    tableRows[3].name,
                                    tableRows[4].name,
                                    tableRows[5].name
                                ].includes(row.name)
                            "
                            class="expanded-row"
                        >
                            <img
                                src="https://popcat.click/twitter-card.jpg"
                                style="width: 150px; height: 150px"
                            />
                        </div>
                    </template>
                </DlTable>
            </div>

            <div style="margin-top: 100px">
                With sticky columns: both AND virtual scroll
                <DlTable
                    :columns="[...tableColumns, ...tableColumns]"
                    sticky-columns="both"
                    :virtual-scroll="true"
                    :rows="tableRows"
                    row-key="id"
                    style="height: 300px"
                />
                With sticky columns: first
                <DlTable
                    :columns="[...tableColumns, ...tableColumns]"
                    sticky-columns="first"
                    :rows="tableRows"
                    row-key="id"
                    style="height: 300px"
                />
                With sticky columns: last
                <DlTable
                    :columns="[...tableColumns, ...tableColumns]"
                    sticky-columns="last"
                    :rows="tableRows"
                    row-key="id"
                    style="height: 300px"
                />
            </div>

            <div style="margin-top: 100px">
                Loading WIth custom row
                <DlTable
                    :selected="selected"
                    :separator="separator"
                    :columns="tableColumns"
                    :bordered="bordered"
                    :dense="dense"
                    class="sticky-header"
                    :filter="filter"
                    :selection="selection"
                    :loading="true"
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
                        :resizable="resizable"
                        :selection="selection"
                        :dense="dense"
                        title="Treats"
                        class="reactive-scroll"
                        color="dl-color-secondary"
                        :loading="infiniteLoading"
                        :rows="computedRows"
                        :columns="tableColumns"
                        style="height: 500px"
                        row-key="index"
                        virtual-scroll
                        @virtual-scroll="onScroll"
                        @col-update="updateColumns"
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
                        <div>&lt slot#pagination ></div>
                    </template>
                    <template #no-data>
                        <div>&lt slot#no-data > should not be visible</div>
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
                        <div>&lt slot#pagination > should not be visible</div>
                    </template>
                    <template #no-data>
                        <div>&lt slot#no-data ></div>
                    </template>
                </DlTable>
            </div>

            <div>
                <p>Test reactive cells</p>
                first row:
                <div class="row" style="width: 100%; margin-bottom: 60px">
                    <dl-input
                        v-for="(value, key) in tableRows[0]"
                        :key="key"
                        v-model="tableRows[0][key]"
                        :title="key"
                        max-width="50px"
                    />
                </div>

                <DlTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    title="Table Title"
                />
            </div>
            <div>
                <p>Custom body cell</p>
                <DlTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    title="Custom Cells"
                >
                    <template #body-cell-name="{ row }">
                        {{ row.name }}
                    </template>
                    <template #body-cell-row-actions>
                        <dl-button label="ActionButton" />
                    </template>
                </DlTable>
            </div>
            <div>
                <p>With editable columns</p>
                <DlTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    title="Editable Columns"
                    :visible-columns="
                        tableColumns.slice(0, -1).map((c) => c.name)
                    "
                    :resizable="true"
                />
            </div>
            <div>
                <p>Virtual With editable columns</p>
                <DlTable
                    :rows="tableRows"
                    :columns="tableColumns"
                    :visible-columns="
                        tableColumns.slice(0, -1).map((c) => c.name)
                    "
                    virtual-scroll
                />
            </div>
            <div>
                <p>With nested field value</p>
                <div style="font-size: 12px">
                    Row array looks like this: {{ rows2 }}
                </div>
                <DlTable
                    :rows="rows2"
                    :columns="columns2"
                    title="Nested Field"
                />
            </div>
        </div>
        <div>
            <p>With empty data</p>
            <DlTable
                :rows="[]"
                :columns="tableColumns"
                title="empty data"
                no-data-label="NOoooooOOOOOoooooo"
            />
        </div>
        <div>
            <p>With empty data virtual scroll</p>
            <DlTable
                :rows="[]"
                :columns="tableColumns"
                title="empty data"
                no-data-label="NOoooooOOOOOoooooo"
                virtual-scroll
            />
        </div>
        <div>
            <p>With empty data virtual scroll no data slot</p>
            <DlTable
                :rows="[]"
                :columns="tableColumns"
                title="empty data"
                virtual-scroll
                hide-bottom
            >
                <template #no-data>
                    <div>&lt slot#no-data ></div>
                </template>
            </DlTable>
        </div>
        <div>
            <p>With alignments</p>
            <DlTable
                :expanded="expanded"
                :columns="tableColumnsAligned"
                expandable-rows
                class="sticky-header"
                :rows="tableRows"
                row-key="id"
                style="height: 500px"
                sticky-columns="last"
                :rows-per-page-options="rowsPerPageOptions"
                @row-click="log"
                @th-click="log"
                @update:selected="updateSeleted"
                @update:expanded="updateExpanded"
            >
                <template #body-cell-carbs="{ row }">
                    <div class="row">
                        {{ row.carbs }}
                        <dl-avatar tooltip="popcat@gmail.com" size="15px">
                            <img
                                src="https://popcat.click/twitter-card.jpg"
                                style="width: 15px; height: 15px"
                            />
                        </dl-avatar>
                    </div>
                </template>
                <template #body-cell-expandable-content="{ row }">
                    <div
                        v-if="
                            [
                                tableRows[0].name,
                                tableRows[1].name,
                                tableRows[2].name
                            ].includes(row.name)
                        "
                        class="expanded-row"
                    >
                        This is some more information about {{ row.name }}
                    </div>
                    <div
                        v-else-if="
                            [
                                tableRows[3].name,
                                tableRows[4].name,
                                tableRows[5].name
                            ].includes(row.name)
                        "
                        class="expanded-row"
                    >
                        <img
                            src="https://popcat.click/twitter-card.jpg"
                            style="width: 150px; height: 150px"
                        />
                    </div>
                </template>
            </DlTable>
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
    DlAvatar
} from '../components'
import { defineComponent, ref, computed, nextTick } from 'vue-demi'
import { times, cloneDeep, isNumber } from 'lodash'
import { DlTablePagination, DlVirtualScrollEvent } from '../types'

export const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        textTransform: 'uppercase',
        hint: 'test hint'
    },
    {
        name: 'calories',
        align: 'right',
        label: 'Calories',
        field: 'calories',
        sortable: true,
        width: '10%'
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

const getRows = (count: number) => [
    ...times(count, (index) => ({
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

const rows = getRows(1000)

const columnsAligned = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)asdfasdfasdfasdf',
        align: 'left',
        field: 'name',
        sortable: true,
        textTransform: 'uppercase',
        hint: 'test hint'
    },
    {
        name: 'calories',
        align: 'right',
        label: 'Caloriesasdfasdfasdfasdfasdf',
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
        align: 'right',
        width: 100
    },
    {
        name: 'protein',
        label: 'Protein (g)',
        field: 'protein',
        align: 'left',
        width: 100
    },
    {
        name: 'sodium',
        label: 'Sodium (mg)',
        field: 'sodium',
        align: 'right',
        width: 100
    },
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        textTransform: 'lowercase',
        align: 'right',
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
        align: 'left',
        width: 100,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    }
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
        DlAvatar
    },
    setup() {
        const filter = ref('')
        const selected = ref([])
        const expanded = ref([])
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
        const tableColumnsAligned = ref(columnsAligned)
        const rowsPerPageOptions = ref([10, 12, 14, 16, 100])

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

        const generatedRows = ref<any>(
            allRows.slice(0, pageSize * nextPageNumber.value)
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
                }, 1500)
            }
        }

        const onScrollGenerate = ({ index, to, ref }: DlVirtualScrollEvent) => {
            const lastIndex = generatedRows.value.length - 1

            const getRandomInt = (min: number, max: number) => {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1)) + min
            }
            // todo: here we can see that even if we are loading the event keeps getting called with same payload. maybe we shouldnt send the same event payload over and over
            if (index >= lastIndex) {
                infiniteLoading.value = true

                setTimeout(() => {
                    generatedRows.value = generatedRows.value.concat(
                        cloneDeep(generatedRows.value)
                            .slice(-10)
                            .map((r: any) => ({ ...r }))
                    )
                    infiniteLoading.value = false
                }, getRandomInt(500, 2000))
            }
        }

        const pagination = ref<DlTablePagination>({
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
            tableColumns.value = newColumns
        }

        return {
            reorderRows,
            updateColumns,
            filter,
            selected,
            expanded,
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
            isFirstPage,
            rows2,
            columns2,
            tableColumnsAligned,
            generatedRows,
            onScrollGenerate
        }
    },

    methods: {
        addRowPerPage() {
            this.rowsPerPageOptions.push(
                this.rowsPerPageOptions[this.rowsPerPageOptions.length - 1] + 2
            )
        },
        updateExpanded(payload: any) {
            this.expanded = payload
        },
        updateSeleted(payload: any) {
            console.log(payload)
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

.expanded-row {
    font-size: 12px;
    display: flex;
    justify-content: center;
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
