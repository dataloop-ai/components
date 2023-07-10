<template>
    <div class="card-view-table">
        <DlTable
            :hide-pagination="true"
            title="Treats"
            color="dl-color-secondary"
            :rows="items"
            :columns="tableColumns"
            row-key="index"
            style="height: 100%"
            virtual-scroll
            :rows-per-page-options="[0]"
            :visible-columns="visibleColumns"
        >
            <template #header="props">
                <dl-tr :props="props">
                    <dl-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        {{ col.label }}
                    </dl-th>
                    <dl-th :props="props">
                        <dl-button
                            text-color="dl-color-medium"
                            flat
                            icon="icon-dl-column"
                        >
                            <dl-menu>
                                <dl-list separator>
                                    <dl-option-group
                                        v-model="visibleColumns"
                                        :options="options"
                                        :left-label="true"
                                        max-width="250px"
                                        type="switch"
                                        class="table-options"
                                    />
                                </dl-list>
                            </dl-menu>
                        </dl-button>
                    </dl-th>
                </dl-tr>
            </template>
            <template #body-cell-name="props">
                <dl-td :props="props">
                    <div class="flex items-center">
                        <div :style="imageStyles(props.row.url)" />
                        <div style="display: flex; max-width: 400px">
                            <dl-ellipsis :text="props.row.name" />
                            {{ props.row.extension }}
                        </div>
                    </div>
                </dl-td>
            </template>
            <template #body-cell-createdAt="image">
                <dl-td :props="image">
                    {{ formatDate(image.row.createdAt) }}
                </dl-td>
            </template>
            <template #body-cell-updatedAt="image">
                <dl-td :props="image">
                    {{ formatDate(image.row.updatedAt) }}
                </dl-td>
            </template>
        </DlTable>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, PropType } from 'vue-demi'
import {
    DlTable,
    DlTd,
    DlTr,
    DlTh,
    DlOptionGroup,
    DlList,
    DlMenu,
    DlEllipsis,
    DlButton
} from '../../../../components'
import { ImageMetadata } from '../types/imageMetadata'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'File Name',
        align: 'left',
        field: 'name',
        sortable: true
    },
    {
        name: 'createdAt',
        align: 'right',
        label: 'Created At',
        field: 'createdAt',
        sortable: true
    },
    {
        name: 'updatedAt',
        label: 'Updated At',
        align: 'right',
        field: 'updatedAt',
        sortable: true
    },
    {
        name: 'mediaType',
        label: 'Media Type',
        field: 'mediaType',
        align: 'left'
    },
    { name: 'state', label: 'State', field: 'state', align: 'left' }
]

export default defineComponent({
    name: 'CardViewTable',
    components: {
        DlOptionGroup,
        DlTd,
        DlTr,
        DlTh,
        DlEllipsis,
        DlTable,
        DlButton,
        DlMenu,
        DlList
    },
    props: {
        items: {
            type: Array,
            default: () => Array as PropType<ImageMetadata[]>
        }
    },
    setup() {
        const tableColumns = ref(columns)
        const separator = ref('horizontal')
        const formatDate = (date: Date) => {
            return date
                .toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit'
                })
                .split(' ')
                .join(' ')
        }
        const log = console.log

        const visibleColumns = ref([
            'name',
            'createdAt',
            'updatedAt',
            'mediaType',
            'state'
        ])
        const options = tableColumns.value.map((item) => ({
            label: item.label,
            value: item.name
        }))
        const imageStyles = (url: string): Record<string, string> => ({
            backgroundImage: `url(${url})`,
            width: '36px',
            height: '27px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            marginRight: '10px'
        })

        return {
            separator,
            formatDate,
            log,
            tableColumns,
            visibleColumns,
            options,
            imageStyles
        }
    }
})
</script>
<style lang="scss" scoped>
.card-view-table {
    width: 100%;
    overflow-x: scroll;
}
</style>
