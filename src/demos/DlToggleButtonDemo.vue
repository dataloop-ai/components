<template>
    <div style="width: 950px; padding-top: 20px">
        <dl-input
            v-model="width"
            title="Custom width container"
        />
        <DlToggleButton
            v-model="selectedValue"
            :options="options"
            :width="width"
            @change="change"
        >
            <template #button-1>
                <p>
                    Changed with slot
                    <DlIcon icon="icon-dl-info-filled" />
                </p>
            </template>
        </DlToggleButton>
        Selected button: {{ label || 'Not selected' }}
    </div>
</template>

<script lang="ts">
import { DlIcon, DlInput, DlToggleButton } from '../components'
import { DlToggleButtonOption } from '../components/types'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlToggleButtonDemo',
    components: { DlIcon, DlInput, DlToggleButton },
    data: () => ({
        options: [
            { label: 'Button 1', value: 1 },
            { label: 'Button 2', value: 2 },
            { label: 'Button 3', value: 3 }
        ] as DlToggleButtonOption[],
        selectedValue: 1,
        width: '100%'
    }),
    computed: {
        label(): string {
            const option = this.options.find(
                (o: DlToggleButtonOption) => o.value === this.selectedValue
            )
            return option?.label ?? ''
        }
    },
    methods: {
        change(val: any) {
            console.log(val)
        }
    }
})
</script>
