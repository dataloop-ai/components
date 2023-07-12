<template>
    <div style="height: 100px; width: 100%">
        <DlStudioLayoutDemo />
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
                <template #body>
                    <dataset-main-content />
                </template>
                <template #footer>
                    <dataset-footer />
                </template>
            </dl-dataset-browser>
        </div>

        <dl-button @click="isOpenPageLayoutModal = true">
            Page Layout
        </dl-button>
        <div
            v-if="isOpenPageLayoutModal"
            class="fullscreen-template"
        >
            <div class="fullscreen-template__close">
                <dl-button
                    icon="icon-dl-close"
                    flat
                    @click="isOpenPageLayoutModal = false"
                />
            </div>
            <dl-page-layout
                title="test title"
                :counters="[
                    {
                        value: 200,
                        text: 'All dataset items'
                    },
                    {
                        value: 100,
                        text: 'Selected items'
                    },
                    {
                        value: 12,
                        text: 'Annotated items'
                    },
                    {
                        value: 17,
                        text: 'Annotations'
                    }
                ]"
            >
                <div>This is a body</div>
            </dl-page-layout>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton } from '../components'
import { DlPageLayout } from '../layouts/DlPageLayout'
import { DlStudioLayoutDemo } from './DlStudioLayoutDemo'
import DlDatasetBrowser from '../layouts/DlDatasetBrowser/DlDatasetBrowser.vue'
import DatasetHeader from '../layouts/DlDatasetBrowser/DemoComponents/DatasetHeader.vue'
import DatasetMainContent from '../layouts/DlDatasetBrowser/DemoComponents/DatasetMainContent.vue'
import DatasetLeftDrawer from '../layouts/DlDatasetBrowser/DemoComponents/DatasetLeftDrawer.vue'
import DatasetRightDrawer from '../layouts/DlDatasetBrowser/DemoComponents/DatasetRightDrawer.vue'
import DatasetFooter from '../layouts/DlDatasetBrowser/DemoComponents/DatasetFooter.vue'

export default defineComponent({
    name: 'DlLayoutDemo',
    components: {
        DlPageLayout,
        DlButton,
        DlStudioLayoutDemo,
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
        const isOpenPageLayoutModal = ref(false)

        const handleExpandLeftDrawer = (value: any) => {
            expandLeftDrawer.value = value
        }

        return {
            expandLeftDrawer,
            handleExpandLeftDrawer,
            isOpenedDatasetBrowserModal,
            isOpenedStudioModal,
            isOpenPageLayoutModal
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
