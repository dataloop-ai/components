<template>
    <div style="width: 90%; height: 100%">
        <DlStudioLayout
            :expand-left-drawer="expandLeftDrawer"
            :expand-right-drawer="expandRightDrawer"
            @expandedLeftDrawer="expandLeftDrawer = $event"
            @expandedRightDrawer="expandRightDrawer = $event"
        >
            <template #navbar-content>
                <navbar-demo-content
                    :expand-left-drawer="expandLeftDrawer"
                    @update:expand-left-drawer="handleExpandLeftDrawer"
                />
            </template>
            <template #left-menu>
                <left-menu-content />
            </template>
            <template #left-drawer>
                <left-drawer-content />
            </template>
            <template #right-drawer>
                <tabs-menu />
            </template>
            <template #default>
                <default-content />
            </template>
            <template #footer>
                <footer-content />
            </template>
        </DlStudioLayout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlStudioLayout from '../components/essential/DlStudioLayout/DlStudioLayout.vue'
import TabsMenu from '../components/essential/DlStudioLayout/components/Demo/TabsMenu.vue'
import NavbarDemoContent from '../components/essential/DlStudioLayout/components/Demo/NavbarDemoContent.vue'
import LeftMenuContent from '../components/essential/DlStudioLayout/components/Demo/LeftMenuContent.vue'
import LeftDrawerContent from '../components/essential/DlStudioLayout/components/Demo/LeftDrawerContent.vue'
import DefaultContent from '../components/essential/DlStudioLayout/components/Demo/DefaultContent.vue'
import FooterContent from '../components/essential/DlStudioLayout/components/Demo/FooterContent.vue'

export default defineComponent({
    name: 'DlStudioLayoutDemo',
    components: {
        NavbarDemoContent,
        DlStudioLayout,
        TabsMenu,
        LeftMenuContent,
        LeftDrawerContent,
        DefaultContent,
        FooterContent
    },
    setup() {
        const expandLeftDrawer = ref(false)
        const expandRightDrawer = ref(true)
        const autoNextItem = ref(false)

        const logValue = (newValue: any) => console.log('New value:', newValue)
        const handleExpandLeftDrawer = (value: any) => {
            expandLeftDrawer.value = value
        }

        return {
            expandLeftDrawer,
            expandRightDrawer,
            logValue,
            autoNextItem,
            handleExpandLeftDrawer
        }
    }
})
</script>

<style scoped lang="scss"></style>
