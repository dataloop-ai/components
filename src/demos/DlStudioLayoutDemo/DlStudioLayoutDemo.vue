<template>
    <div>
        <dl-button @click="isOpenedStudioModal = true">
            Studio Layout
        </dl-button>
        <div v-if="isOpenedStudioModal" class="fullscreen-template">
            <div class="fullscreen-template__close">
                <dl-button
                    flat
                    icon="icon-dl-close"
                    size="xl"
                    @click="isOpenedStudioModal = false"
                />
            </div>
            <DlStudioLayout>
                <template #left-menu>
                    <left-menu-content />
                </template>
                <template #leftDrawer>
                    testestest

                    <studio-left-drawer />
                </template>
                <template #rightDrawer>
                    <studio-tabs-menu />
                </template>
                <template #body>
                    <studio-main-content />
                </template>
                <template #footer>
                    <studio-footer />
                </template>
            </DlStudioLayout>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton } from '../../components'
import { DlStudioLayout } from '../../layouts'
import StudioMainContent from './components/StudioMainContent.vue'
import LeftMenuContent from './components/LeftMenuContent.vue'
import StudioTabsMenu from './components/StudioTabsMenu.vue'
import StudioLeftDrawer from './components/StudioLeftDrawer.vue'
import StudioFooter from './components/StudioFooter.vue'

export default defineComponent({
    name: 'DlStudioLayoutDemo',
    components: {
        DlButton,
        DlStudioLayout,
        StudioMainContent,
        StudioTabsMenu,
        StudioLeftDrawer,
        StudioFooter,
        LeftMenuContent
    },
    setup() {
        const isOpenedStudioModal = ref(false)

        return {
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
