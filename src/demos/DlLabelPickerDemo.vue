<template>
    <div>
        <div>Label picker component</div>
        <DlLabelPicker :items="items" />
    </div>
</template>

<script lang="ts">
import { DlLabelPicker } from '../components'
import { defineComponent, ref } from 'vue-demi'
const rows = [
    {
        identifier: 'a',
        displayLabel: 'Frozen Yogurt',
        color: '#ff0000',
        children: [
            {
                identifier: 'b',
                displayLabel: 'hello',
                color: '#ffff00'
            }
        ]
    },
    {
        identifier: 'c',
        displayLabel: 'test 2',
        color: '#00ff00',
        children: []
    },
    {
        identifier: 'd',
        displayLabel: 'test 3',
        color: '#ff00ff',
        children: []
    }
]
export default defineComponent({
    components: {
        DlLabelPicker
    },
    setup() {
        const items = ref(rows)
        return { items }
    }
})
</script>
