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
            <DlStudioLayout>
                <template #header>
                    <studio-header
                        :expand-left-drawer="expandLeftDrawer"
                        @update:expand-left-drawer="handleExpandLeftDrawer"
                    />
                </template>
                <template #left-menu>
                    <left-menu-content />
                </template>
                <template #leftDrawer>
                    <studio-left-drawer />
                </template>
                <template #rightDrawer>
                    <studio-tabs-menu />
                </template>
                <template #mainContent>
                    <studio-main-content />
                </template>
                <template #footer>
                    <studio-footer />
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
                    <dataset-header />
                </template>
                <template #leftDrawer>
                    <dataset-left-drawer />
                </template>
                <template #rightDrawer>
                    <dataset-right-drawer />
                </template>
                <template #mainContent>
                    <dataset-main-content />
                </template>
                <template #footer>
                    <dataset-footer />
                </template>
            </dl-dataset-browser>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton } from '../components'
import DlStudioLayout from '../components/essential/DlStudioLayout/DlStudioLayout.vue'
import StudioHeader from '../components/essential/DlStudioLayout/components/Demo/StudioHeader.vue'
import StudioMainContent from '../components/essential/DlStudioLayout/components/Demo/StudioMainContent.vue'
import LeftMenuContent from '../components/essential/DlStudioLayout/components/Demo/LeftMenuContent.vue'
import StudioTabsMenu from '../components/essential/DlStudioLayout/components/Demo/StudioTabsMenu.vue'
import StudioLeftDrawer from '../components/essential/DlStudioLayout/components/Demo/StudioLeftDrawer.vue'
import StudioFooter from '../components/essential/DlStudioLayout/components/Demo/StudioFooter.vue'
import DlDatasetBrowser from '../components/essential/DlDatasetBrowser/DlDatasetBrowser.vue'
import DatasetHeader from '../components/essential/DlDatasetBrowser/DemoComponents/DatasetHeader.vue'
import DatasetMainContent from '../components/essential/DlDatasetBrowser/DemoComponents/DatasetMainContent.vue'
import DatasetLeftDrawer from '../components/essential/DlDatasetBrowser/DemoComponents/DatasetLeftDrawer.vue'
import DatasetRightDrawer from '../components/essential/DlDatasetBrowser/DemoComponents/DatasetRightDrawer.vue'
import DatasetFooter from '../components/essential/DlDatasetBrowser/DemoComponents/DatasetFooter.vue'

export default defineComponent({
    name: 'DlPageLayoutDemo',
    components: {
        DlButton,
        DlStudioLayout,
        StudioHeader,
        StudioMainContent,
        StudioTabsMenu,
        StudioLeftDrawer,
        StudioFooter,
        LeftMenuContent,
        DlDatasetBrowser,
        DatasetHeader,
        DatasetLeftDrawer,
        DatasetRightDrawer,
        DatasetFooter,
        DatasetMainContent
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
