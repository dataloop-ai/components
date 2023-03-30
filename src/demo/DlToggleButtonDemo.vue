<template>
    <div style="width: 950px; padding-top: 20px">
        <dl-text-input
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
import { DlToggleButton } from '../components'
import { defineComponent } from 'vue-demi'
import DlTextInput from '../components/DlTextInput.vue'
import DlIcon from '../components/DlIcon.vue'

export default defineComponent({
    name: 'DlToggleButtonDemo',
    components: { DlIcon, DlTextInput, DlToggleButton },
    setup() {
        return {
            DlToggleButton
        }
    },
    data: () => ({
        options: [
            { label: 'Button 1', value: 1 },
            { label: 'Button 2', value: 2 },
            { label: 'Button 3', value: 3 }
        ],
        selectedValue: 1,
        width: '100%'
    }),
    computed: {
        label() {
            return this.options.find((o) => o.value === this.selectedValue)
                ?.label
        }
    },
    methods: {
        change(val: any) {
            console.log(val)
        }
    }
})
</script>
