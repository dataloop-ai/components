<template>
    <div class="studio-layout-left-drawer-content">
        <div
            style="
                display: flex;
                align-items: center;
                margin: 0px 5px 7px 0px;
                padding: 5px 0px 0px;
                width: 100%;
            "
        >
            <dl-typography
                color="dl-color-medium"
                variant="h3"
                size="10px"
                style="text-transform: capitalize; margin-right: 5px"
            >
                LABEL PICKER
            </dl-typography>
            <dl-icon
                size="12px"
                icon="icon-dl-info"
                color="dl-color-medium"
                style="margin: 0px 0px 3px"
            >
                <dl-tooltip>
                    Use dot separation to create nested labels. For example:
                    "Vehicle" and "Vehicle.Car"
                </dl-tooltip>
            </dl-icon>
        </div>
        <div style="margin: 0px 0px 10px">
            <dl-typography
                color="dl-color-medium"
                variant="h3"
                size="12px"
                style="text-align: center"
            >
                For more ontology settings <br>
                <a href="https://google.com/">go to receipe</a>
            </dl-typography>
        </div>
        <div
            style="
                height: 300px;
                padding: 5px;
                resize: vertical;
                overflow: auto;
            "
        >
            <ListAutocomplete
                :items="listAutocomleteItems"
                @selectedOption="handleOption"
            />
        </div>
        <hr>
        <div>
            <div>
                <dl-button
                    v-for="(iconMenu, iconMenuIndex) in iconsMenu"
                    :key="iconMenuIndex"
                    flat
                    :style="`background-color: ${
                        selectedIconMenu && iconMenu.id === selectedIconMenu.id
                            ? 'var(--dl-color-fill)'
                            : ''
                    }`"
                    :icon-color="
                        selectedIconMenu &&
                            selectedItem &&
                            iconMenu.id === selectedIconMenu.id
                            ? selectedItem.color
                            : 'dl-color-darker'
                    "
                    size="l"
                    :icon="iconMenu.icon"
                    @click="handleSelectedIconMenu(iconMenu)"
                >
                    <dl-tooltip>
                        {{ iconMenu.tooltip }} ({{ iconMenuIndex }})
                    </dl-tooltip>
                </dl-button>
            </div>
        </div>
        <hr>
        <div
            style="
                display: flex;
                align-items: center;
                margin: 0px 5px 7px 0px;
                padding: 5px 0px 0px;
            "
        >
            <dl-icon
                size="16px"
                icon="icon-dl-classification"
                color="dl-color-medium"
                style="margin: 0px 3px 0px"
            />
            <dl-typography
                color="dl-color-lighter"
                size="12px"
                style="text-transform: capitalize; margin-right: 5px"
            >
                CLASSIFICATION
            </dl-typography>
        </div>
        <dl-checkbox
            v-model="autoNextItem"
            color="dl-color-lighter"
            label="Auto next item"
            label-color="dl-color-lighter"
            @update:model-value="logValue"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import ListAutocomplete from '../ListAutocomplete.vue'
import {
    DlButton,
    DlCheckbox,
    DlTooltip,
    DlIcon,
    DlTypography
} from '../../../../components'

export default defineComponent({
    name: 'StudioLeftDrawer',
    components: {
        DlTypography,
        DlIcon,
        DlTooltip,
        ListAutocomplete,
        DlButton,
        DlCheckbox
    },
    setup() {
        const listAutocomleteItems = [
            {
                name: 'Affff fffff ffffffff fffffffff fffffffff fffffffffff fffffff f f f f f f f  f',
                color: 'red'
            },
            { name: 'B', color: 'green' },
            { name: 'C', color: 'purple' },
            { name: 'D', color: 'yellow' }
        ]
        const selectedItem = ref<any>('')

        const handleOption = (item: any) => {
            console.log('handle option demo: ', item)
            selectedItem.value = item
        }
        const iconsMenu = [
            {
                id: 1,
                icon: 'icon-dl-selection',
                tooltip: 'Selection',
                link: ''
            },
            {
                id: 2,
                icon: 'icon-dl-classification',
                tooltip: 'Classification',
                link: ''
            },
            {
                id: 3,
                icon: 'icon-dl-point',
                tooltip: 'Point',
                link: ''
            },
            {
                id: 4,
                icon: 'icon-dl-box',
                tooltip: 'Box',
                link: ''
            },
            {
                id: 5,
                icon: 'icon-dl-cubiod',
                tooltip: 'Cube',
                link: ''
            },
            {
                id: 6,
                icon: 'icon-dl-brush',
                tooltip: 'Semantic segmentation',
                link: ''
            },
            {
                id: 7,
                icon: 'icon-dl-polygon',
                tooltip: 'Polygon',
                link: ''
            },
            {
                id: 8,
                icon: 'icon-dl-polyline',
                tooltip: 'Polyline',
                link: ''
            },
            {
                id: 9,
                icon: 'icon-dl-ellipse',
                tooltip: 'Ellipse',
                link: ''
            },
            {
                id: 10,
                icon: 'icon-dl-note-tool',
                tooltip: 'Notes',
                link: ''
            },
            {
                id: 11,
                icon: 'icon-dl-faas-outline',
                tooltip: 'Applications',
                link: ''
            }
        ]
        const selectedIconMenu = ref(null)

        const handleSelectedIconMenu = (iconMenu: any) => {
            selectedIconMenu.value = iconMenu
        }

        return {
            listAutocomleteItems,
            handleOption,
            selectedItem,
            iconsMenu,
            selectedIconMenu,
            handleSelectedIconMenu
        }
    }
})
</script>

<style scoped lang="scss">
.studio-layout-left-drawer-content {
    width: 250px;
}
</style>
