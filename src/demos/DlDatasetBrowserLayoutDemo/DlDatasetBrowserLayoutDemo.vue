<template>
    <div>
        <dl-button @click="isOpenedDatasetBrowserModal = true">
            Dataset Browser
        </dl-button>
        <div v-if="isOpenedDatasetBrowserModal" class="fullscreen-template">
            <div class="fullscreen-template__close">
                <dl-button
                    icon="icon-dl-close"
                    size="xl"
                    flat
                    @click="isOpenedDatasetBrowserModal = false"
                />
            </div>
            <dl-dataset-browser-layout>
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
            </dl-dataset-browser-layout>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton } from '../../components'
import { DlDatasetBrowserLayout } from '../../layouts'
import DatasetHeader from './components/DatasetHeader.vue'
import DatasetMainContent from './components/DatasetMainContent.vue'
import DatasetLeftDrawer from './components/DatasetLeftDrawer.vue'
import DatasetRightDrawer from './components/DatasetRightDrawer.vue'
import DatasetFooter from './components/DatasetFooter.vue'

export default defineComponent({
    name: 'DlLayoutDemo',
    components: {
        DlButton,
        DlDatasetBrowserLayout,
        DatasetHeader,
        DatasetLeftDrawer,
        DatasetRightDrawer,
        DatasetFooter,
        DatasetMainContent
    },
    setup() {
        const isOpenedDatasetBrowserModal = ref(false)

        return {
            isOpenedDatasetBrowserModal
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
