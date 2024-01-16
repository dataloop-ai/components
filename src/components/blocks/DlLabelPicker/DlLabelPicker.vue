<template>
    <div style="width: 200px">
        <dl-input
            v-model="inputValue"
            :placeholder="placeHolderText"
            size="l"
            has-prepend
            padding-prop="0px 0px 0px 0px"
            :style="inputStyles"
        >
            <template #prepend>
                <dl-icon
                    style="margin-bottom: 5px"
                    icon="icon-dl-search"
                    size="12px"
                />
            </template>
        </dl-input>
        <dl-tree-table
            draggable="none"
            separator="none"
            :hide-pagination="true"
            :hide-header="true"
            :bordered="false"
            :columns="columns"
            selection="none"
            :loading="false"
            :filter="inputValue"
            :rows="rows"
            row-key="identifier"
            color="dl-color-secondary"
            :empty-state-props="emptyStateProps"
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
import { DlLabel, DlIcon } from '../../essential'
import { DlInput, DlTreeTable } from '../../compound'
import { DlEmptyStateProps, DlTableColumn, DlTableRow } from '../../types'
import { DlLabelPickerItem } from './types'

export default defineComponent({
    name: 'DlLabelPicker',
    components: {
        DlInput,
        DlIcon,
        DlLabel,
        DlTreeTable
    },
    props: {
        items: {
            type: Array as PropType<DlLabelPickerItem[]>,
            default: () => [] as PropType<DlLabelPickerItem[]>
        },
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () =>
                ({
                    title: '',
                    subtitle: 'No data to show yet.',
                    icon: 'icon-dl-dataset-filled'
                } as unknown as PropType<DlEmptyStateProps>)
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
        const currentSelectedLabel = ref<DlLabelPickerItem>(null)

        const handleRowClick = (_: MouseEvent, item: DlLabelPickerItem) => {
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
            return items.value?.map((i: DlLabelPickerItem) => ({
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
