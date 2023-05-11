<template>
    <div class="main-content-header">
        <div style="display: flex; align-items: center">
            <dl-select
                v-model="statusOption"
                width="100px"
                without-borders
                align-right
                :options="[
                    {
                        label: 'Select scope',
                        value: 1,
                        badgeColor: 'dl-color-disabled'
                    },
                    {
                        label: 'Status 2',
                        value: 2,
                        badgeColor: 'dl-color-secondary'
                    },
                    {
                        label: 'Status 3',
                        value: 3,
                        badgeColor: 'dl-color-positive'
                    },
                    {
                        label: 'Status 4',
                        value: 4,
                        badgeColor: 'dl-color-warning'
                    }
                ]"
                required
            >
                <template #selected="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
                <template #option="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
            </dl-select>
            <dl-separator
                type="vertical"
                height="20px"
            />
            <dl-select
                v-model="actionOption"
                width="96px"
                without-borders
                align-right
                :options="[
                    {
                        label: 'Actions',
                        value: 1,
                        badgeColor: 'dl-color-disabled'
                    },
                    {
                        label: 'Status 2',
                        value: 2,
                        badgeColor: 'dl-color-secondary'
                    },
                    {
                        label: 'Status 3',
                        value: 3,
                        badgeColor: 'dl-color-positive'
                    },
                    {
                        label: 'Status 4',
                        value: 4,
                        badgeColor: 'dl-color-warning'
                    }
                ]"
                required
            >
                <template #selected="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
                <template #option="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
            </dl-select>
            <dl-select
                v-model="automationOption"
                width="96px"
                without-borders
                align-right
                :options="[
                    {
                        label: 'Automation',
                        value: 1,
                        badgeColor: 'dl-color-disabled'
                    },
                    {
                        label: 'Status 2',
                        value: 2,
                        badgeColor: 'dl-color-secondary'
                    },
                    {
                        label: 'Status 3',
                        value: 3,
                        badgeColor: 'dl-color-positive'
                    },
                    {
                        label: 'Status 4',
                        value: 4,
                        badgeColor: 'dl-color-warning'
                    }
                ]"
                required
            >
                <template #selected="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
                <template #option="scope">
                    <div style="display: flex; align-items: center; gap: 5px">
                        {{ scope.opt.label }}
                    </div>
                </template>
            </dl-select>
        </div>
        <div
            style="
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: end;
                padding-right: 10px;
                gap: 10px;
            "
        >
            <dl-typography
                size="12px"
                color="secondary"
            >
                Feature
            </dl-typography>
            <dl-button
                flat
                dense
                icon="icon-dl-thumbnail"
                color="secondary"
            />
            <dl-button
                flat
                dense
                icon="icon-dl-list-view"
                color="secondary"
            />
            <dl-button
                flat
                dense
                icon="icon-dl-card-view"
                color="secondary"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlTypography from '../../../essential/DlTypography/DlTypography.vue'
import DlSelect from '../../../compound/DlSelect/DlSelect.vue'
import DlSeparator from '../../../essential/DlSeparator/DlSeparator.vue'
import DlButton from '../../../basic/DlButton/DlButton.vue'

export default defineComponent({
    name: 'MainContentHeader',
    components: {
        DlTypography,
        DlSelect,
        DlSeparator,
        DlButton
    },
    setup() {
        const statusOption = ref({
            label: 'Select scope',
            value: 1,
            badgeColor: 'dl-color-disabled'
        })
        const actionOption = ref({
            label: 'Actions',
            value: 1,
            badgeColor: 'dl-color-disabled'
        })
        const automationOption = ref({
            label: 'Automation',
            value: 1,
            badgeColor: 'dl-color-disabled'
        })

        return {
            statusOption,
            actionOption,
            automationOption
        }
    }
})
</script>

<style scoped>
.main-content-header {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-self: center;
    justify-content: center;
}
</style>
