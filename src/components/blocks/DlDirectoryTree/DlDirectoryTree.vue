<template>
    <div :style="`width: ${width}`">
        <dl-tree-table
            draggable="none"
            separator="none"
            :hide-pagination="true"
            :hide-header="true"
            :bordered="false"
            :columns="columns"
            selection="multiple"
            :loading="false"
            :filter="inputValue"
            :rows="rows"
            row-key="identifier"
            color="dl-color-secondary"
            @row-click="handleRowClick"
        >
            <template #body-cell-displayLabel="item">
                <DlLabel
                    :text="item.row.displayLabel"
                    :indicator-color="item.row.color"
                    class="dl-label-picker-item"
                />
            </template>
        </dl-tree-table>
    </div>
</template>

<script lang="ts">
import { ref, PropType, defineComponent, computed, toRefs } from 'vue-demi'
import { DlTreeTable } from '../../compound'
import { DlTableColumn, DlTableRow } from '../../types'

export default defineComponent({
    name: 'DlDirectoryTree',
    components: {
        DlTreeTable
    },
    props: {
        items: {
            type: Array as PropType<any[]>,
            default: () => [] as PropType<any[]>
        },
        width: {
            type: String,
            default: '200px'
        }
    },
    emits: ['selected-label', 'click'],
    setup(props, { emit, slots }) {
        const { items } = toRefs(props)

        const columns: DlTableColumn[] = [
            {
                name: 'displayLabel',
                label: '',
                required: false,
                align: 'left',
                field: 'displayLabel',
                sortable: false,
                style: `cursor: pointer;`
            }
        ]

        const inputValue = ref('')
        const currentSelectedLabel = ref<any>(null)

        const handleRowClick = (_: MouseEvent, item: any) => {
            currentSelectedLabel.value = item
            emit('selected-label', item)
            emit('click', item)
        }

        const placeHolderText = computed(() => {
            if (!currentSelectedLabel.value) {
                return `No items selected`
            }

            return currentSelectedLabel.value.displayLabel
        })

        const selectedColor = computed(() => {
            if (!currentSelectedLabel.value) {
                return null
            }
            return currentSelectedLabel.value.color
        })

        const inputStyles = computed(() => {
            if (!selectedColor.value) {
                return {}
            }
            return { 'border-left': `2px solid ${selectedColor.value}` }
        })

        const rows = computed<DlTableRow[]>(() => {
            return items.value?.map((i: any) => ({
                ...i,
                name: i.displayLabel
            }))
        })

        return {
            handleRowClick,
            inputValue,
            columns,
            placeHolderText,
            inputStyles,
            rows
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
