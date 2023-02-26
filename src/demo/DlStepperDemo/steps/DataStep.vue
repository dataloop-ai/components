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
            <dl-select
                v-model="dataset"
                title="Dataset"
                required
                :options="['Rotem Shaham']"
            />
            <span>
                <dl-typography color="dl-color-medium">Folder or DQL (Optional)</dl-typography>
                <div style="height: 8px" />
                <dl-option-group
                    v-model="dql"
                    inline
                    :options="[
                        { label: 'Option 1', value: 1 },
                        { label: 'Option 2', value: 2 }
                    ]"
                />
            </span>
            <dl-typography>
                <dl-typography
                    style="display: inline-block"
                    color="dl-color-medium"
                >
                    Scope Items:
                </dl-typography>
                All Items (500)
            </dl-typography>
            <span>
                <dl-typography color="dl-color-medium">Filter Items *</dl-typography>
                <div style="height: 8px" />
                <div style="display: flex; align-items: center">
                    <dl-button
                        size="s"
                        outlined
                        label="Percentage"
                    />
                    <dl-button
                        size="s"
                        outlined
                        label="Items"
                        color="dl-color-separator"
                        text-color="dl-color-darker"
                    />
                    <dl-text-input
                        v-model="percentage"
                        style="width: 60px; margin: 0 10px 0 15px"
                        size="m"
                        without-root-padding
                        disable-clear-btn
                    />
                    <dl-typography color="dl-color-medium">Items Limit</dl-typography>
                </div>
                <hr class="separator">
            </span>
            <dl-typography>Total Items: 120</dl-typography>
            <span>
                <dl-typography
                    style="margin-bottom: 6px"
                    color="dl-color-medium"
                >Setting (Optional)</dl-typography>
                <dl-alert type="info">WEBM Conversion is executed as a project service and incurs
                    compute costs. Set service compute resources according to
                    planned workload.</dl-alert>
            </span>
            <span style="display: flex; align-items: flex-start; gap: 10px">
                <dl-checkbox v-model="enforce" />
                <dl-typography>
                    Enforce WEBM conversion on 8 video items for frame-accurate
                    annotations.
                    <dl-link
                        style="display: inline-block"
                        size="12px"
                        color="dl-color-secondary"
                        href="/"
                    >
                        Learn more</dl-link>.
                </dl-typography>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlButton,
    DlCheckbox,
    DlTextInput,
    DlTypography,
    DlOptionGroup,
    DlSelect,
    DlLink,
    DlAlert
} from '../../../components'
export default defineComponent({
    components: {
        DlButton,
        DlTypography,
        DlTextInput,
        DlOptionGroup,
        DlSelect,
        DlCheckbox,
        DlLink,
        DlAlert
    },
    emits: ['reset-click', 'error-click', 'complete-click', 'warning-click'],
    data() {
        return {
            dql: 1,
            dataset: 'Rotem Shaham',
            percentage: '100%',
            enforce: true
        }
    }
})
</script>

<style lang="scss" scoped>
.inputs-container {
    padding: 20px 0 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: calc(100% - 2px);
}

.separator {
    padding-top: 4px;
    border: none;
    width: 305px;
    border-bottom: 1px solid var(--dl-color-separator);
}
</style>
