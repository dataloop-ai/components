<template>
    <div>
        <div>Label picker component</div>
        <DlLabelPicker
            :items="items"
            :empty-state-props="{
                title: '',
                icon: ''
            }"
            :initial-selection="initialSelection"
            hide-bottom
            hide-no-data
            @selected-label="setSelectedEvent"
        />
        <div>last selected: {{ lastSelected }}</div>
    </div>
</template>

<script lang="ts">
import { DlLabelPicker } from '../components'
import { defineComponent, ref } from 'vue-demi'
import { DlLabelPickerItem } from '../types'
const rows: DlLabelPickerItem[] = [
    {
        identifier: 'a',
        displayLabel: 'Frozen Yogurt',
        color: '#ff0000',
        children: [
            {
                identifier: 'a.a',
                displayLabel: 'hello',
                color: '#ffff00',
                children: [
                    {
                        identifier: 'a.a.a',
                        displayLabel: 'test 2',
                        color: '#00ff00',
                        children: [
                            {
                                identifier: 'a.a.a.a',
                                displayLabel: 'test 3',
                                color: '#ff00aa',
                                children: []
                            }
                        ]
                    },
                    {
                        identifier: 'a.a.b',
                        displayLabel: 'test 4',
                        color: '#ff00ff',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        identifier: 'c',
        displayLabel: 'test 5',
        color: '#f0ffaf',
        children: []
    },
    {
        identifier: 'd',
        displayLabel: 'test 6',
        color: '#2f3fff',
        children: []
    }
]
export default defineComponent({
    components: {
        DlLabelPicker
    },
    setup() {
        const items = ref(rows)
        const initialSelection = ref(rows[1])
        const lastSelected = ref<DlLabelPickerItem>(null)
        const setSelectedEvent = (item: DlLabelPickerItem) => {
            lastSelected.value = item
        }
        return { items, lastSelected, setSelectedEvent, initialSelection }
    }
})
</script>
