<template>
    <div>
        <div>Label picker component</div>
        <DlDirectoryTree
            :items="items"
            @selected-label="setSelectedEvent"
        />
        <div>last selected: {{ lastSelected }}</div>
    </div>
</template>

<script lang="ts">
import { DlDirectoryTree } from '../components'
import { defineComponent, ref } from 'vue-demi'
import { DlLabelPickerItem } from '../types'

const rows: DlLabelPickerItem[] = [
    {
        identifier: 'a',
        displayLabel: 'Frozen Yogurt',
        color: '#ff0000',
        children: [
            {
                identifier: 'b',
                displayLabel: 'hello',
                color: '#ffff00',
                children: [
                    {
                        identifier: 'c',
                        displayLabel: 'test 2',
                        color: '#00ff00',
                        children: [
                            {
                                identifier: 'd',
                                displayLabel: 'test 3',
                                color: '#ff00aa',
                                children: []
                            }
                        ]
                    },
                    {
                        identifier: 'e',
                        displayLabel: 'test 4',
                        color: '#ff00ff',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        identifier: 'f',
        displayLabel: 'test 5',
        color: '#f0ffaf',
        children: []
    },
    {
        identifier: 'g',
        displayLabel: 'test 6',
        color: '#2f3fff',
        children: []
    }
]
export default defineComponent({
    components: {
        DlDirectoryTree
    },
    setup() {
        const items = ref(rows)
        const lastSelected = ref<DlLabelPickerItem>(null)
        const setSelectedEvent = (item: DlLabelPickerItem) => {
            lastSelected.value = item
        }
        return { items, lastSelected, setSelectedEvent }
    }
})
</script>
