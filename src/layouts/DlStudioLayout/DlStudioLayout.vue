<template>
    <div class="dl-studio-layout">
        <dl-page-layout :template="template">
            <template #header>
                <slot name="header" />
            </template>
            <template #leftDrawer>
                <slot name="leftDrawer" />
            </template>
            <template #rightDrawer>
                <slot name="rightDrawer" />
            </template>
            <template #mainContent>
                <slot name="mainContent" />
            </template>
            <template #footer>
                <slot name="footer" />
            </template>
        </dl-page-layout>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlPageLayout } from '../../components'

export default defineComponent({
    name: 'DlStudioLayout',
    components: {
        DlPageLayout
    },
    setup() {
        const template = '"h h h" "l p r" "l f r"'

        return {
            template
        }
    }
})
</script>

<style scoped lang="scss"></style>
