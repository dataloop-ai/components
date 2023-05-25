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
            <dl-checkbox
                v-model="qa"
                padding="5px 0px"
                label="Auto QA task"
            />
            <dl-checkbox
                v-model="consensus"
                padding="5px 0px"
                label="Consensus"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton, DlCheckbox } from '../../../components'
export default defineComponent({
    components: {
        DlButton,
        DlCheckbox
    },
    emits: ['reset-click', 'error-click', 'complete-click', 'warning-click'],
    data() {
        return {
            qa: false,
            consensus: false
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
