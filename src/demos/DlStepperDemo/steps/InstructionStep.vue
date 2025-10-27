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
            <dl-select
                v-model="recipe"
                title="Recipe"
                required
                :options="['Rotem Shaham']"
            />
            <dl-typography>
                Go to
                <dl-link
                    :size="12"
                    color="dl-color-secondary"
                    style="display: inline-block"
                >
                    Recipes Page
                </dl-link>
                to create a new recipe.
            </dl-typography>
            <span>
                <dl-typography color="dl-color-medium"
                >2. Instruction Document</dl-typography
                >
                <div style="height: 10px" />
                <dl-typography>Lorem Ipsum Dolot Sit Amat.Pdf</dl-typography>
            </span>
            <span>
                <dl-typography color="dl-color-medium"
                >Instruction Range</dl-typography
                >
                <div style="height: 4px" />
                <dl-option-group
                    v-model="range"
                    :options="[
                        { label: 'All', value: 1 },
                        { label: 'Custom', value: 2 },
                        { label: 'None', value: 3 }
                    ]"
                />
            </span>
            <span>
                <dl-typography color="dl-color-medium"
                >Tools Settings (Optional)</dl-typography
                >
                <div style="height: 10px" />
                <dl-checkbox
                    v-model="pixel"
                    padding="5px 0px"
                    label="Super Pixel"
                />
            </span>
            <span>
                <dl-typography color="dl-color-medium"
                >Labeling Task Actions</dl-typography
                >
                <div style="height: 10px" />
                <dl-checkbox
                    v-model="auto"
                    padding="5px 0px"
                    label="Auto apply status on classification tool"
                />
                <div class="labeling-option" style="margin-top: 4px">
                    <dl-radio
                        v-model="labeling"
                        label="Complete"
                        padding="5px 0px"
                        value="complete"
                    />
                    <dl-typography size="10px" color="dl-color-lighter"
                    >(Default)</dl-typography
                    >
                    <dl-icon icon="icon-dl-close" size="12px" />
                </div>
                <div class="labeling-option">
                    <dl-radio
                        v-model="labeling"
                        label="Disable"
                        padding="5px 0px"
                        value="disable"
                    />
                    <dl-icon icon="icon-dl-close" size="12px" />
                </div>
            </span>
            <dl-button
                icon="icon-dl-add"
                flat
                class="add-button"
                text-color="dl-color-darker"
                label="Add New Action"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlButton,
    DlSelect,
    DlTypography,
    DlLink,
    DlOptionGroup,
    DlRadio,
    DlIcon,
    DlCheckbox
} from '../../../components'
export default defineComponent({
    components: {
        DlButton,
        DlCheckbox,
        DlIcon,
        DlOptionGroup,
        DlRadio,
        DlLink,
        DlTypography,
        DlSelect
    },
    emits: ['reset-click', 'error-click', 'complete-click', 'warning-click'],
    data() {
        return {
            recipe: 'Rotem Shaham',
            range: 1,
            auto: true,
            pixel: false,
            labeling: 'complete'
        }
    }
})
</script>

<style lang="scss" scoped>
.inputs-container {
    padding: 20px 0 10px;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: calc(100% - 2px);
}

.add-button {
    padding: 0;
}

.labeling-option {
    display: flex;
    align-items: center;
    padding-top: 4px;
    justify-content: space-between;
    width: 140px;
}
</style>
