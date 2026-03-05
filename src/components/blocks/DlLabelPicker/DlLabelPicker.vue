<template>
    <div class="dl-label-picker">
        <dl-input
            v-model="inputValue"
            :placeholder="placeHolderText"
            size="m"
            has-prepend
            :style="inputStyles"
            @focus="onFocus"
            @blur="onBlur"
            @clear="onClear"
        >
            <template #prepend>
                <dl-icon
                    color="dl-color-lighter"
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
            :class="{
                'dl-label-picker-tree-table': true,
                'has-not-children': hasNotChildren
            }"
            @row-click="handleRowClick"
        >
            <template #body-cell-displayLabel="item">
                <DlLabel
                    :text="item.row.displayLabel"
                    :indicator-color="item.row.color"
                    class="dl-label-picker-item"
                    :data-label-picker-identifier="item.row.identifier"
                />
            </template>
        </dl-tree-table>
    </div>
</template>

<script lang="ts">
import {
    ref,
    PropType,
    defineComponent,
    computed,
    toRefs,
    onMounted,
    nextTick
} from 'vue-demi'
import { DlLabel, DlIcon } from '../../essential'
import { DlInput, DlTreeTable } from '../../compound'
import { DlEmptyStateProps, DlTableColumn, DlTableRow } from '../../types'
import { DlLabelPickerItem } from './types'
import { v4 } from 'uuid'

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
        },
        initialSelection: {
            type: Object as PropType<DlLabelPickerItem>,
            default: null
        }
    },
    emits: ['selected-label', 'click', 'focus', 'blur', 'clear'],
    setup(props, { emit, slots }) {
        const { items, initialSelection } = toRefs(props)

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
            (initialSelection?.value ?? items.value?.[0]) || null
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

        const hasNotChildren = computed(() => {
            return !items.value?.some((item) => item.children?.length > 0)
        })
        const placeHolderText = computed(() => {
            if (!currentSelectedLabel.value) {
                return 'Search a label'
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
                        name: obj.displayLabel,
                        id: obj.id || v4()
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

        onMounted(() => {
            nextTick(() => {
                if (currentSelectedLabel.value.identifier) {
                    const target = table.value.$el.querySelector(
                        `[data-label-picker-identifier="${currentSelectedLabel.value.identifier}"]`
                    )
                    target?.closest('tr')?.classList.add('selected')
                }
            })
        })
        const onFocus = (event: InputEvent) => {
            emit('focus', event)
        }
        const onBlur = (event: InputEvent) => {
            emit('blur', event)
        }
        const onClear = (event: InputEvent) => {
            emit('clear', event)
        }

        function setSelectedLabelByName(displayLabel: string) {
            const stack = [...items.value]

            while (stack.length) {
                const item = stack.pop()

                if (item.displayLabel === displayLabel) {
                    currentSelectedLabel.value = item
                    emit('selected-label', item)

                    nextTick(() => {
                        const target = table.value?.$el.querySelector(
                            `[data-label-picker-identifier="${item.identifier}"]`
                        )
                        table.value?.$el
                            .querySelectorAll('tr.selected')
                            .forEach((tr: Element) =>
                                tr.classList.remove('selected')
                            )
                        target?.closest('tr')?.classList.add('selected')
                    })
                    return
                }

                if (item.children?.length) {
                    stack.push(...item.children)
                }
            }
            console.warn(
                `[DlLabelPicker] No label found for displayLabel "${displayLabel}"`
            )
        }

        return {
            handleRowClick,
            inputValue,
            hasNotChildren,
            columns,
            placeHolderText,
            inputStyles,
            rows,
            table,
            isFilterString,
            onClear,
            onBlur,
            onFocus,
            setSelectedLabelByName
        }
    }
})
</script>

<style scope>
.dl-label-picker {
    width: 200px;
}
.dl-label-picker-item {
    cursor: pointer;
    height: 32px;
    line-height: 30px;
}

.dl-label-picker .dl-table tbody tr.highlighted td {
    background-color: var(--dl-color-panel-background);
}

.dl-label-picker .dl-table tbody tr.selected td {
    background-color: var(--dl-color-fill);
}
.dl-label-picker > div.dl-label-picker-tree-table td.dl-draggable-container {
    width: 0;
    padding: 0;
}
.dl-label-picker
    > div.dl-label-picker-tree-table.has-not-children
    td.chevron-icon-container {
    width: 10px;
}
</style>

<style>
.dl-label-picker .dl-table thead tr,
.dl-label-picker .dl-table .inner-th-wrapper {
    height: 10px;
}
.dl-label-picker .dl-table tbody tr {
    height: auto;
}
.dl-label-picker .dl-table tbody tr td {
    padding: 2px 0;
}
</style>
