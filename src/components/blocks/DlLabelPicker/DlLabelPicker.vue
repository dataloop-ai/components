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
            v-if="isFilterString(inputValue)"
            ref="table"
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
            :hide-bottom="hideBottom"
            :hide-no-data="hideNoData"
            identifier-as-tooltip
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
        /**
         * Props for the empty state component
         */
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () =>
                ({
                    title: '',
                    subtitle: 'No labels to show yet.',
                    icon: ''
                } as unknown as PropType<DlEmptyStateProps>)
        },
        /**
         * Hides the bottom footer of the DlLabelPicker
         */
        hideBottom: {
            type: Boolean,
            default: false
        },
        /**
         * Hides the "No data" of the DlLabelPicker
         */
        hideNoData: {
            type: Boolean,
            default: false
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
        const currentSelectedLabel = ref<DlLabelPickerItem>(
            items.value ? items.value[0] : null
        )

        const table = ref()
        const handleRowClick = (event: MouseEvent, item: DlLabelPickerItem) => {
            table.value.$el
                .querySelectorAll('tr.selected')
                .forEach((tr: Element) => tr.classList.remove('selected'))
            const target = event.target as Element
            target.closest('tr').classList.add('selected')
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

        const mapObjects = (
            item: DlLabelPickerItem,
            callback: (obj: DlLabelPickerItem) => DlLabelPickerItem
        ) => {
            const mappedItem: DlLabelPickerItem = callback(item)

            if (item.children && item.children.length > 0) {
                mappedItem.children = item.children.map((child) =>
                    mapObjects(child, callback)
                )
            }
            return mappedItem
        }

        const mapItems = ref<DlTableRow[]>(
            items.value?.map((item) =>
                mapObjects(item, (obj: DlLabelPickerItem) => {
                    return {
                        ...obj,
                        name: obj.displayLabel
                    }
                })
            )
        )
        const rows = computed(() => mapItems.value)
        const isFilterString = (input: string) => {
            const stack = [...items.value]
            const filter = (input ?? '').toLowerCase()
            while (stack.length) {
                const item = stack.pop()
                if (item.displayLabel?.toLowerCase?.().includes(filter)) {
                    return true
                }
                if (item.children) {
                    stack.push(...item.children)
                }
            }
            return false
        }
        return {
            handleRowClick,
            inputValue,
            columns,
            placeHolderText,
            inputStyles,
            rows,
            table,
            isFilterString
        }
    }
})
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
