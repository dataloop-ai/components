<template>
    <div>
        <DlDirectoryTree
            :items="items"
            style="width: 500px"
            @selected="setSelectedEvent"
            @expanded="setExpandedEvent"
        />

        <div>
            <div>last selection event</div>
            {{ lastSelected }}
        </div>
        <div>
            <div>last expanded event</div>
            {{ lastExpanded }}
        </div>
    </div>
</template>

<script lang="ts">
import { DlDirectoryTree } from '../components'
import { defineComponent, ref } from 'vue-demi'
import { DlDirectoryTreeItem } from '../types'

const rows: DlDirectoryTreeItem[] = [
    {
        identifier: 'a',
        displayLabel: 'Frozen Yogurt',
        children: [
            {
                identifier: 'b',
                displayLabel: 'hello',
                children: [
                    {
                        identifier: 'c',
                        displayLabel: 'test 2',
                        children: [
                            {
                                identifier: 'd',
                                displayLabel: 'test 3',
                                children: []
                            }
                        ]
                    },
                    {
                        identifier: 'e',
                        displayLabel: 'test 4',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        identifier: 'f',
        displayLabel: 'test 5',
        children: []
    },
    {
        identifier: 'g',
        displayLabel: 'test 6',
        children: []
    }
]
export default defineComponent({
    components: {
        DlDirectoryTree
    },
    setup() {
        const items = ref(rows)
        const lastSelected = ref<DlDirectoryTreeItem>(null)
        const lastExpanded = ref<{
            isExpanded: boolean
            name: string
            rowsArr: DlDirectoryTreeItem[]
        }>(null)

        const setSelectedEvent = (item: DlDirectoryTreeItem) => {
            lastSelected.value = item
        }
        const setExpandedEvent = (
            isExpanded: boolean,
            name: string,
            rowsArr: DlDirectoryTreeItem[]
        ) => {
            lastExpanded.value = {
                isExpanded,
                name,
                rowsArr
            }
        }

        return {
            items,
            lastSelected,
            setSelectedEvent,
            lastExpanded,
            setExpandedEvent
        }
    }
})
</script>
