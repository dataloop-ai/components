<template>
    <div style="--dl-checkbox-sub-label-left-padding: 20px">
        <dl-checkbox
            v-model="customValueCheck"
            toggle-indeterminate
            indeterminate-value="maybe"
            false-value="no"
            true-value="yes"
            sub-label="this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text "
            @update:model-value="logValue"
        >
            Indeterminate checkbox component
        </dl-checkbox>
        <dl-checkbox
            v-model="switchValue"
            :value="3"
            label="Option 3"
            @update:model-value="logValue"
        />
        <dl-checkbox
            v-model="booleanValue"
            label="Boolean v-model"
            @update:model-value="logValue"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlCheckbox } from '../components'
export default defineComponent({
    name: 'DlCheckboxDemo',
    components: {
        DlCheckbox
    },
    setup() {
        const logValue = (newValue: any) => console.log('New value:', newValue)
        const switchValue = ref<number[]>([1, 3])
        const booleanValue = ref(true)
        const customValueCheck = ref('maybe')

        return {
            switchValue,
            booleanValue,
            customValueCheck,
            logValue
        }
    }
})
</script>
