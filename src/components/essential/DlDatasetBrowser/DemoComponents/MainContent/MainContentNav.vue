<template>
    <div class="main-content-header">
        <div style="display: flex; align-items: center">
            <dl-checkbox
                v-model="selectPageValue"
                :value="3"
                :label="selectPageLabel"
                label-color="dl-color-darker"
                label-size="12px"
                @update:model-value="logValue"
            />
            <dl-separator
                type="vertical"
                height="20px"
            />
            <actions-menu :items="actionItems" />
            <automation-menu :items="automationItems" />
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
                :text-color="getViewModeSelectedColor('gallery')"
                @click="emitViewModeGallery"
            />
            <dl-button
                flat
                dense
                icon="icon-dl-list-view"
                :text-color="getViewModeSelectedColor('table')"
                @click="emitViewModeTable"
            />
            <dl-button
                flat
                dense
                icon="icon-dl-card-view"
                color="secondary"
                @click="emitViewModeCard"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlTypography from '../../../DlTypography/DlTypography.vue'
import DlSeparator from '../../../DlSeparator/DlSeparator.vue'
import DlButton from '../../../../basic/DlButton/DlButton.vue'
import DlCheckbox from '../../../DlCheckbox/DlCheckbox.vue'
import ActionsMenu from './ActionsMenu.vue'
import AutomationMenu from './AutomationMenu.vue'

export default defineComponent({
    name: 'MainContentNav',
    components: {
        DlTypography,
        DlSeparator,
        DlButton,
        DlCheckbox,
        ActionsMenu,
        AutomationMenu
    },
    emit: ['onChangeViewMode'],
    setup(props, ctx) {
        const selectPageLabel = ref<string>('Select Page (100)')
        const selectPageValue = ref<boolean>(false)
        const viewModeSelected = ref<string>('gallery')
        const scopeOptions = [
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
        ]
        const actionOptions = [
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
        ]
        const automationOptions = [
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
        ]
        const actionItems = [
            {
                id: 1,
                label: 'Upload',
                value: 'upload',
                icon: 'icon-dl-upload',
                isBordered: false
            },
            {
                id: 2,
                label: 'Export',
                value: 'export',
                icon: 'icon-dl-export',
                isBordered: false
            },
            {
                id: 3,
                label: 'Clone',
                value: 'clone',
                icon: 'icon-dl-clone',
                isBordered: false
            },
            {
                id: 4,
                label: 'Classification',
                value: 'classification',
                icon: 'icon-dl-classification',
                isBordered: false
            },
            {
                id: 5,
                label: 'Move to Folder',
                value: 'move-to-folder',
                icon: 'icon-dl-move-to-folder',
                isBordered: false
            },
            {
                id: 6,
                label: 'Show File Name',
                value: 'move-file-name',
                icon: 'icon-dl-file',
                isBordered: false
            },
            {
                id: 7,
                label: 'Show Annotations',
                value: 'show-annotations',
                icon: 'icon-dl-annotation-outline',
                isBordered: false
            },
            {
                id: 8,
                label: 'Show Hidden Items',
                value: 'show-hidden-items',
                icon: 'icon-dl-show',
                isBordered: false
            },
            {
                id: 9,
                label: 'Delete',
                labelColor: 'dl-color-negative',
                value: 'delete',
                icon: 'icon-dl-delete',
                iconColor: 'dl-color-negative',
                isBordered: true
            }
        ]
        const automationItems = [
            {
                id: 1,
                label: 'Applications',
                value: 'applications',
                icon: 'icon-dl-faas-outline',
                isBordered: false,
                children: [
                    {
                        id: 1,
                        label: 'COCO Converter',
                        value: 'coco-converter',
                        isBordered: false
                    },
                    {
                        id: 2,
                        label: 'YOLO Converter',
                        value: 'yolo-converter',
                        isBordered: false
                    },
                    {
                        id: 3,
                        label: 'VOC Converter',
                        value: 'voc-converter',
                        isBordered: false
                    }
                ]
            },
            {
                id: 2,
                label: 'Functions',
                value: 'functions',
                icon: 'icon-dl-function',
                isBordered: false
            },
            {
                id: 3,
                label: 'Pipelines',
                value: 'pipelines',
                icon: 'icon-dl-pipeline',
                isBordered: false
            }
        ]

        const getViewModeSelectedColor = (value: string) =>
            viewModeSelected.value === value
                ? 'dl-color-secondary'
                : 'dl-color-dark'

        const logValue = (newValue: any) => console.log('New value:', newValue)

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
        const emitViewModeGallery = () => {
            viewModeSelected.value = 'gallery'
            ctx.emit('onChangeViewMode', 'gallery')
        }
        const emitViewModeTable = () => {
            viewModeSelected.value = 'table'
            ctx.emit('onChangeViewMode', 'table')
        }
        const emitViewModeCard = () => {
            viewModeSelected.value = 'card'
            ctx.emit('onChangeViewMode', 'card')
        }

        return {
            logValue,
            selectPageLabel,
            selectPageValue,
            scopeOptions,
            actionOptions,
            automationOptions,
            statusOption,
            actionOption,
            automationOption,
            actionItems,
            automationItems,
            emitViewModeGallery,
            emitViewModeTable,
            viewModeSelected,
            getViewModeSelectedColor,
            emitViewModeCard
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
