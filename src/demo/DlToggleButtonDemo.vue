<template>
    <div style="width: 950px; padding-top: 20px">
        <DlToggleButton
            v-model="selectedValue"
            :options="options"
        >
            <template #button-1="{ label }">
                <p>{{ label }} dgsdgdsgdsgdsg</p>
            </template>
        </DlToggleButton>
        {{ selectedValue }}
    </div>
</template>

<script lang="ts">
import { DlToggleButton } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlToggleButtonDemo',
    components: { DlToggleButton },
    setup() {
        return {
            DlToggleButton
        }
    },
    data: () => ({
        options: [
            { label: 'demo 1', value: 1 },
            { label: 'demo 2', value: 2 },
            { label: 'demo 3', value: 3 }
        ],
        selectedValue: null
    })
})
</script>

<style scoped></style>
