<template>
    <div style="height: 100px; width: 100%">
        <dl-button @click="isOpenedStudioModal = true">
            Studio Layout
        </dl-button>
        <div
            v-if="isOpenedStudioModal"
            class="fullscreen-template"
        >
            <div class="fullscreen-template__close">
                <dl-button
                    flat
                    icon="icon-dl-close"
                    @click="isOpenedStudioModal = false"
                />
            </div>
            <DlStudioLayout
                :expand-left-drawer="expandLeftDrawer"
                :expand-right-drawer="expandRightDrawer"
                @expandedLeftDrawer="expandLeftDrawer = $event"
                @expandedRightDrawer="expandRightDrawer = $event"
            >
                <template #header>
                    <navbar-demo-content
                        :expand-left-drawer="expandLeftDrawer"
                        @update:expand-left-drawer="handleExpandLeftDrawer"
                    />
                </template>
                <template #left-menu>
                    <left-menu-content />
                </template>
                <template #leftDrawer>
                    <dataset-left-drawer-content />
                </template>
                <template #rightDrawer>
                    <tabs-menu />
                </template>
                <template #mainContent>
                    <dataset-default-content />
                </template>
                <template #footer>
                    <dataset-footer-content />
                </template>
            </DlStudioLayout>
        </div>
        <dl-button @click="isOpenedDatasetBrowserModal = true">
            Dataset Browser
        </dl-button>
        <div
            v-if="isOpenedDatasetBrowserModal"
            class="fullscreen-template"
        >
            <div class="fullscreen-template__close">
                <dl-button
                    icon="icon-dl-close"
                    flat
                    @click="isOpenedDatasetBrowserModal = false"
                />
            </div>
            <dl-dataset-browser>
                <template #header>
                    <navbar-kpi />
                    <navbar-search />
                </template>
                <template #leftDrawer>
                    <left-drawer-content />
                </template>
                <template #rightDrawer>
                    <right-drawer-content />
                </template>
                <template #mainContent>
                    <MainContentHeader />
                    <MainContent />
                </template>
                <template #footer>
                    <footer-content />
                </template>
            </dl-dataset-browser>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlStudioLayout from '../components/essential/DlStudioLayout/DlStudioLayout.vue'
import NavbarDemoContent from '../components/essential/DlStudioLayout/components/Demo/NavbarDemoContent.vue'
import LeftMenuContent from '../components/essential/DlStudioLayout/components/Demo/LeftMenuContent.vue'
import TabsMenu from '../components/essential/DlStudioLayout/components/Demo/TabsMenu.vue'
import DatasetLeftDrawerContent from '../components/essential/DlStudioLayout/components/Demo/LeftDrawerContent.vue'
import DatasetDefaultContent from '../components/essential/DlStudioLayout/components/Demo/DefaultContent.vue'
import DatasetFooterContent from '../components/essential/DlStudioLayout/components/Demo/FooterContent.vue'
import DlDatasetBrowser from '../components/essential/DlDatasetBrowser/DlDatasetBrowser.vue'
import { DlButton } from '../components'
import NavbarKpi from '../components/essential/DlDatasetBrowser/DemoComponents/NavbarKpi.vue'
import LeftDrawerContent from '../components/essential/DlDatasetBrowser/DemoComponents/LeftDrawerContent.vue'
import RightDrawerContent from '../components/essential/DlDatasetBrowser/DemoComponents/RightDrawerContent.vue'
import FooterContent from '../components/essential/DlDatasetBrowser/DemoComponents/FooterContent.vue'
import MainContentHeader from '../components/essential/DlDatasetBrowser/DemoComponents/MainContentHeader.vue'
import MainContent from '../components/essential/DlDatasetBrowser/DemoComponents/MainContent.vue'
import NavbarSearch from '../components/essential/DlDatasetBrowser/DemoComponents/NavbarSearch.vue'

export default defineComponent({
    name: 'DlLayoutDemo',
    components: {
        DlStudioLayout,
        NavbarDemoContent,
        DlDatasetBrowser,
        LeftMenuContent,
        DatasetLeftDrawerContent,
        DatasetDefaultContent,
        DatasetFooterContent,
        TabsMenu,
        DlButton,
        NavbarKpi,
        LeftDrawerContent,
        RightDrawerContent,
        FooterContent,
        MainContentHeader,
        MainContent,
        NavbarSearch
    },
    setup() {
        const expandLeftDrawer = ref(false)
        const isOpenedDatasetBrowserModal = ref(false)
        const isOpenedStudioModal = ref(false)

        const handleExpandLeftDrawer = (value: any) => {
            expandLeftDrawer.value = value
        }

        return {
            expandLeftDrawer,
            handleExpandLeftDrawer,
            isOpenedDatasetBrowserModal,
            isOpenedStudioModal
        }
    }
})
</script>

<style scoped lang="scss">
.fullscreen-template {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    background-color: var(--dl-color-panel-background);
    z-index: 1000;

    &__close {
        position: absolute;
        right: 10px;
        z-index: 2;
    }
}
</style>
