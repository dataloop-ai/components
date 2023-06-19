<template>
    <div class="add-filter">
        <dl-button
            icon="icon-dl-add"
            label="Add filter"
            flat
        >
            <dl-menu>
                <div class="add-filter__menu">
                    <div class="add-filter__header">
                        <div class="add-filter__header__title">
                            <dl-typography
                                color="dl-color-medium"
                                size="14px"
                            >
                                Filters
                            </dl-typography>
                            <div style="text-align: end">
                                <dl-button
                                    flat
                                    color="secondary"
                                >
                                    Reset Filters
                                </dl-button>
                            </div>
                        </div>
                        <div class="add-filter__header__subtitle">
                            <dl-typography
                                color="dl-color-medium"
                                size="10px"
                            >
                                A maximum of 8 filters can be selected.
                            </dl-typography>
                        </div>
                    </div>
                    <div class="add-filter__content">
                        <div
                            v-for="(section, sectionIndex) in sections"
                            :key="sectionIndex"
                        >
                            <dl-typography
                                color="dl-color-darker"
                                size="12px"
                            >
                                {{ section.label }}
                            </dl-typography>
                            <div class="add-filter__content__section">
                                <div
                                    class="add-filter__content__section__option"
                                >
                                    <dl-option-group
                                        v-model="switchValue"
                                        type="checkbox"
                                        :options="section.options"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </dl-menu>
        </dl-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import {
    DlButton,
    DlMenu,
    DlTypography,
    DlOptionGroup
} from '../../../../components'

export default defineComponent({
    name: 'AddFilter',
    components: {
        DlButton,
        DlMenu,
        DlTypography,
        DlOptionGroup
    },
    setup() {
        const logValue = (newValue: any) => console.log('New value:', newValue)
        const customValueCheck = ref('')
        const switchValue = ref<number[]>([1, 3])
        const sections = ref([
            {
                label: 'Items',
                options: [
                    {
                        value: 1,
                        label: 'Item Description',
                        disabled: true
                    },
                    {
                        value: 2,
                        label: 'Item Media Type'
                    },
                    {
                        value: 3,
                        label: 'Item Metadata'
                    },
                    {
                        value: 4,
                        label: 'Item Size'
                    },
                    {
                        value: 5,
                        label: 'Item Status'
                    },
                    {
                        value: 6,
                        label: 'Item Uploaded Date'
                    }
                ]
            },
            {
                label: 'Annotations',
                options: [
                    {
                        value: 7,
                        label: 'Annotation Type'
                    },
                    {
                        value: 8,
                        label: 'QA Workflow'
                    }
                ]
            },
            {
                label: 'Taxonomy',
                options: [
                    {
                        value: 9,
                        label: 'Attributes'
                    },
                    {
                        value: 10,
                        label: 'Labels'
                    }
                ]
            },
            {
                label: 'File',
                options: [
                    {
                        value: 11,
                        label: 'File Extension'
                    },
                    {
                        value: 12,
                        label: 'File Name'
                    }
                ]
            },
            {
                label: 'Workforce',
                options: [
                    {
                        value: 13,
                        label: 'Contributors & Groups'
                    }
                ]
            }
        ])

        return {
            logValue,
            customValueCheck,
            sections,
            switchValue
        }
    }
})
</script>

<style scoped lang="scss">
.add-filter {
    &__menu {
        padding: 10px;
    }

    &__header {
        &__title {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
        }
        &__subtitle {
        }
    }

    &__content {
        display: flex;
        padding-top: 20px;

        &__section {
            width: 200px;
            justify-content: start;

            &__option {
                padding-top: 5px;
                text-align: start;
                justify-content: start;
                align-content: start;
                justify-self: start;
            }
        }
    }
}
</style>
