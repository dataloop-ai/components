<template>
    <div style="--dl-checkbox-sub-label-left-padding: 20px">
        <div style="max-width: 150px">
            in a tight container with long text
            <dl-checkbox
                v-model="customValueCheck"
                toggle-indeterminate
                indeterminate-value="maybe"
                false-value="no"
                true-value="yes"
                label="dasflsd;ljasl;djfasjkl;dfjklasdfjl;kasj;klasjl;kl;aksdfkl;asjdfkl;asjdfl;kasjdflk;asdf;kljsdkl;fjasl;dkfjaskl;dfjasl;kdfal;skdfkl;asdfl;kasdfkl;asjdfkl;asjdfkl;asjdf;"
                sub-label="this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text "
                @update:model-value="logValue"
            />
        </div>
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
