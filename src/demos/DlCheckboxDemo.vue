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
        <dl-checkbox
            v-model="disabledValue"
            disabled
            @update:model-value="logValue"
        >
            Disabled with tooltip
            <dl-tooltip>I am a tooltip</dl-tooltip>
        </dl-checkbox>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlCheckbox, DlTooltip } from '../components'

export default defineComponent({
    name: 'DlCheckboxDemo',
    components: {
        DlCheckbox,
        DlTooltip
    },
    setup() {
        const logValue = (newValue: any) => console.log('New value:', newValue)
        const switchValue = ref<number[]>([1, 3])
        const booleanValue = ref(true)
        const customValueCheck = ref('maybe')
        const disabledValue = ref(false)

        return {
            switchValue,
            booleanValue,
            customValueCheck,
            disabledValue,
            logValue
        }
    }
})
</script>
