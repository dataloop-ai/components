<template>
    <div style="width: 200px">
        <dl-input
            v-model="inputValue"
            placeholder="No items selected"
            size="l"
            has-prepend
            padding-prop="0px 0px 0px 0px"
            :style="{ 'border-left': inputBorderLeft }"
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
            :columns="cols"
            selection="none"
            :loading="false"
            :filter="inputValue"
            :rows="items"
            row-key="name"
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
import { ref, type PropType, toRef, defineComponent } from 'vue-demi'
import { DlLabel, DlInput, DlIcon, DlTreeTable } from '../../../components'

export type TLabelPickerItem = {
    color: string
    identifier: string
    displayLabel: string
    children?: TLabelPickerItem[]
}

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
            type: Array as PropType<TLabelPickerItem[]>,
            default: () => [] as PropType<TLabelPickerItem[]>
        }
    },
    emits: ['selectedLabel'],
    setup(props, { emit, slots }) {
        const inputValue = ref('')
        const isInputActive = ref(false)
        const inputBorderLeft = ref('2px solid transparent')
        const results = ref<TLabelPickerItem[]>([])

        const cols = ref(columns)

        const handleRowClick = (_: MouseEvent, item: TLabelPickerItem) => {
            inputBorderLeft.value = `2px solid ${item.color}`
            emit('selectedLabel', item)
        }

        return {
            handleRowClick,
            inputValue,
            inputBorderLeft,
            isInputActive,
            cols
        }
    }
})

const columns = [
    {
        name: 'displayLabel',
        label: '',
        required: false,
        align: 'left',
        field: 'displayLabel',
        sortable: false
    }
]
</script>

<style scope>
.dl-label-picker-item {
    cursor: pointer;
}
</style>
