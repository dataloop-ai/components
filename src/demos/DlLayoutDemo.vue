<template>
    <div style="width: 90%; height: 100%">
        <DlLayout
            :expand-left-sidebar="expandLeftSidebar"
            :expand-right-sidebar="expandRightSidebar"
            @expandedLeftSidebar="expandLeftSidebar = $event"
            @expandedRightSidebar="expandRightSidebar = $event"
        >
            <template #navbar-content>
                <div class="navbar-demo-content">
                    <div
                        style="display: flex; height: 100%; align-items: center"
                    >
                        <dl-button
                            flat
                            icon="icon-dl-hamburger-menu"
                            color="secondary"
                            size="xl"
                            @click="expandLeftSidebar = !expandLeftSidebar"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-left-chevron"
                            label="Go to: Dataset Browser"
                        />
                    </div>
                    <div
                        style="
                            display: flex;
                            height: 100%;
                            align-items: center;
                            justify-content: end;
                            padding-right: 10px;
                        "
                    >
                        <dl-button flat>
                            <dl-icon
                                size="16px"
                                icon="icon-dl-light-theme"
                                color="dl-color-warning"
                            />
                        </dl-button>
                        <dl-button flat>
                            <dl-icon
                                size="16px"
                                icon="icon-dl-dark-theme"
                                color="dl-color-warning"
                            />
                        </dl-button>
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-question"
                        />
                        <dl-button
                            flat
                            color="secondary"
                        >
                            <dl-icon
                                size="16px"
                                icon="icon-dl-notification"
                            />
                        </dl-button>
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-cloud-server"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-magic"
                        />
                        <dl-button
                            flat
                            @click="expandRightSidebar = !expandRightSidebar"
                        >
                            <dl-avatar
                                tooltip="popcat@gmail.com"
                                size="25px"
                            >
                                <img
                                    src="https://popcat.click/twitter-card.jpg"
                                >
                            </dl-avatar>
                        </dl-button>
                    </div>
                </div>
            </template>
            <template #left-menu>
                <div
                    style="
                        color: var(--dl-color-lighter);
                        background-color: var(--dl-color-side-panel);
                        height: 100%;
                    "
                >
                    <div style="padding-top: 30px">
                        Left side content slot
                    </div>
                </div>
            </template>
            <template #left-side>
                <div
                    style="
                        display: flex;
                        align-items: center;
                        margin: 0px 5px 7px 0px;
                        padding: 5px 0px 0px;
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
                            Use dot separation to create nested labels. For
                            example: "Vehicle" and "Vehicle.Car"
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
                                iconMenu.id === selectedIconMenu?.id
                                    ? 'var(--dl-color-fill)'
                                    : ''
                            }`"
                            :icon-color="
                                iconMenu.id === selectedIconMenu?.id
                                    ? selectedItem?.color
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
            </template>
            <template #right-side>
                <tabs-menu />
            </template>
            <template #default>
                <div
                    class="flex items-center"
                    style="
                        height: 100%;
                        background-color: var(--dl-color-body-background);
                    "
                >
                    <ul>
                        <li>
                            You need to develop the layouts as you can see here
                            with option to enter different kinds of component in
                            the future
                        </li>
                        <li>this layout need to be responsive,</li>
                        <li>
                            Our components should be able to be applied to this
                            layout
                        </li>
                        <li>its would be our design QA</li>
                        <li>
                            We will explain where and how to apply the
                            components
                        </li>
                        <li>
                            After we apply the components, we could simulate the
                            behavior and see how it works
                        </li>
                    </ul>
                </div>
            </template>
            <template #footer>
                <div
                    style="
                        color: var(--dl-color-lighter);
                        background-color: red;
                        height: 100%;
                    "
                >
                    Footer slot Footer slot Footer slot Footer slot Footer slot
                    Footer slot Footer slot Footer slot Footer slot Footer slot
                    Footer slot Footer slot Footer slot
                </div>
            </template>
        </DlLayout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlLayout from '../components/essential/DlLayout/DlLayout.vue'
import ListAutocomplete from '../components/essential/DlLayout/components/ListAutocomplete.vue'
import TabsMenu from '../components/essential/DlLayout/components/Demo/TabsMenu.vue'
import {
    DlButton,
    DlIcon,
    DlAvatar,
    DlTypography,
    DlCheckbox,
    DlTooltip
} from '../components'

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlLayout,
        DlButton,
        DlIcon,
        DlAvatar,
        DlTypography,
        ListAutocomplete,
        DlCheckbox,
        DlTooltip,
        TabsMenu
    },
    setup() {
        const expandLeftSidebar = ref(false)
        const expandRightSidebar = ref(true)
        const selectedIconMenu = ref(null)
        const listAutocomleteItems = [
            {
                name: 'Affff fffff ffffffff fffffffff fffffffff fffffffffff fffffff f f f f f f f  f',
                color: 'red'
            },
            { name: 'B', color: 'green' },
            { name: 'C', color: 'purple' },
            { name: 'D', color: 'yellow' }
        ]
        const selectedItem = ref('')
        const logValue = (newValue: any) => console.log('New value:', newValue)
        const autoNextItem = ref(false)
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
        const handleSelectedIconMenu = (iconMenu: any) => {
            selectedIconMenu.value = iconMenu
        }

        return {
            expandLeftSidebar,
            expandRightSidebar,
            listAutocomleteItems,
            logValue,
            autoNextItem,
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
.navbar-demo-content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-self: center;
    justify-content: center;
}
</style>
