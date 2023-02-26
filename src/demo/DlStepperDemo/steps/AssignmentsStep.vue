<template>
    <div>
        <div style="display: flex; gap: 8px">
            <dl-button
                color="dl-color-positive"
                label="Completed"
                @click="$emit('complete-click')"
            />
            <dl-button
                color="dl-color-warning"
                label="Warning"
                @click="$emit('warning-click')"
            />
            <dl-button
                color="dl-color-negative"
                label="Error"
                @click="$emit('error-click')"
            />
            <dl-button
                label="Reset"
                @click="$emit('reset-click')"
            />
        </div>
        <div class="inputs-container">
            <span>
                <dl-typography color="dl-color-medium">Distribution Method *</dl-typography>
                <div style="height: 8px" />
                <dl-option-group
                    v-model="distribution"
                    inline
                    :options="[
                        { label: 'Distribution', value: 1 },
                        { label: 'Pulling', value: 2 }
                    ]"
                />
            </span>
            <span>
                <dl-typography color="dl-color-medium">
                    Contributors
                </dl-typography>
                <div style="height: 10px" />
                <dl-checkbox
                    v-model="contr"
                    padding="5px 0px"
                    label="Show contributors from all domains"
                />
            </span>
            <dl-select
                v-model="contributors"
                multiselect
                :options="[
                    { label: 'One', value: 1 },
                    { label: 'Two', value: 2 },
                    { label: 'Three', value: 3 }
                ]"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlButton,
    DlOptionGroup,
    DlCheckbox,
    DlTypography,
    DlSelect
} from '../../../components'
export default defineComponent({
    components: {
        DlButton,
        DlOptionGroup,
        DlCheckbox,
        DlTypography,
        DlSelect
    },
    emits: ['reset-click', 'error-click', 'complete-click', 'warning-click'],
    data() {
        return {
            distribution: 2,
            contributors: [1, 2],
            contr: true
        }
    }
})
</script>

<style lang="scss" scoped>
.inputs-container {
    padding: 20px 0 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: calc(100% - 2px);
}
</style>
