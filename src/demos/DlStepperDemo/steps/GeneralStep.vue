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
            <dl-button label="Reset" @click="$emit('reset-click')" />
        </div>
        <div class="inputs-container">
            <dl-input
                dense
                required
                title="Name"
                @input="$emit('set-subtitle', $event)"
            />
            <span>
                <dl-typography color="dl-color-medium">Type *</dl-typography>
                <span style="height: 10px" />
                <dl-option-group
                    v-model="type"
                    inline
                    :options="[
                        { label: 'Option 1', value: 1 },
                        { label: 'Option 2', value: 2 }
                    ]"
                />
            </span>
            <dl-select
                v-model="owner"
                title="Owner"
                required
                :options="['Rotem Shaham', 'Fadi Atamny', 'Orily Shefler']"
            />
            <dl-select
                v-model="status"
                title="Task Status"
                required
                :options="['To Do', 'In Progress', 'Done']"
            />
            <dl-select
                v-model="priority"
                title="Priority"
                required
                :options="['High', 'Medium', 'Low']"
            />
            <dl-input
                dense
                title="Completion Due Date"
                placeholder="dd/mm/yy"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlButton,
    DlInput,
    DlSelect,
    DlOptionGroup,
    DlTypography
} from '../../../components'
export default defineComponent({
    components: {
        DlButton,
        DlTypography,
        DlOptionGroup,
        DlInput,
        DlSelect
    },
    emits: [
        'reset-click',
        'error-click',
        'complete-click',
        'warning-click',
        'set-subtitle'
    ],
    data() {
        return {
            owner: 'Rotem Shaham',
            type: 1,
            status: 'To do',
            priority: 'High'
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
