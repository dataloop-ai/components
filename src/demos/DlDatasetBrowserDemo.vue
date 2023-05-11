<template>
    <div style="height: 1000px; width: 100%">
        <dl-layout>
            <dl-layout-navbar height="60px">
                <navbar-demo-content
                    :expand-left-drawer="expandLeftDrawer"
                    @update:expand-left-drawer="handleExpandLeftDrawer"
                />
            </dl-layout-navbar>
            <div>
                <dl-layout-drawer
                    width-lg="312px"
                    width-sm="0px"
                    height="100%"
                    :expand-drawer="expandLeftDrawer"
                    position="absolute"
                    :has-toggle-button="false"
                    location="left"
                    style="z-index: 1"
                >
                    <left-menu-content />
                </dl-layout-drawer>
            </div>
            <dl-layout-navbar>
                <navbar-kpi />
            </dl-layout-navbar>
            <dl-layout-navbar>
                <navbar-search />
            </dl-layout-navbar>
            <div class="flex flex-row full-width full-height">
                <dl-layout-drawer
                    width-lg="302px"
                    :expand-drawer="true"
                    height="100%"
                >
                    <left-drawer-content />
                </dl-layout-drawer>
                <dl-layout-main>
                    <MainContentHeader />
                    <MainContent />
                </dl-layout-main>
                <dl-layout-drawer
                    width-lg="302px"
                    location="right"
                    :expand-drawer="true"
                    :has-toggle-button="false"
                >
                    <RightDrawerContent />
                </dl-layout-drawer>
            </div>
            <dl-layout-footer>
                <FooterContent />
            </dl-layout-footer>
        </dl-layout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlLayout from '../components/essential/DlLayout/DlLayout.vue'
import DlLayoutNavbar from '../components/essential/DlLayout/DlLayoutNavbar.vue'
import NavbarDemoContent from '../components/essential/DlStudioLayout/components/Demo/NavbarDemoContent.vue'
import DlLayoutDrawer from '../components/essential/DlLayout/DlLayoutDrawer.vue'
import LeftDrawerContent from '../components/essential/DlDatasetBrowser/DemoComponents/LeftDrawerContent.vue'
import RightDrawerContent from '../components/essential/DlDatasetBrowser/DemoComponents/RightDrawerContent.vue'
import LeftMenuContent from '../components/essential/DlStudioLayout/components/Demo/LeftMenuContent.vue'
import NavbarKpi from '../components/essential/DlDatasetBrowser/DemoComponents/NavbarKpi.vue'
import NavbarSearch from '../components/essential/DlDatasetBrowser/DemoComponents/NavbarSearch.vue'
import DlLayoutFooter from '../components/essential/DlLayout/DlLayoutFooter.vue'
import DlLayoutMain from '../components/essential/DlLayout/DlLayoutMain.vue'
import MainContentHeader from '../components/essential/DlDatasetBrowser/DemoComponents/MainContentHeader.vue'
import MainContent from '../components/essential/DlDatasetBrowser/DemoComponents/MainContent.vue'
import FooterContent from '../components/essential/DlDatasetBrowser/DemoComponents/FooterContent.vue'

export default defineComponent({
    name: 'DlDatasetBrowserDemo',
    components: {
        DlLayout,
        DlLayoutNavbar,
        NavbarDemoContent,
        DlLayoutDrawer,
        LeftDrawerContent,
        RightDrawerContent,
        NavbarKpi,
        NavbarSearch,
        DlLayoutFooter,
        DlLayoutMain,
        LeftMenuContent,
        MainContentHeader,
        MainContent,
        FooterContent
    },
    setup() {
        const expandLeftDrawer = ref(false)
        const handleExpandLeftDrawer = (value: any) => {
            expandLeftDrawer.value = value
        }

        return {
            expandLeftDrawer,
            handleExpandLeftDrawer
        }
    }
})
</script>

<style scoped></style>
