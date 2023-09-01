<template>
    <div>
        <DlTr :no-hover="true">
            Label picker component
        </DlTr>
        <DlLabelPicker :items="items" />
    </div>
</template>

<script lang="ts">
import { DlTr, DlLabelPicker } from '../components'
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
        DlTr,
        DlLabelPicker
    },
    setup() {
        const items = ref(rows)
        return { items }
    }
})
</script>
