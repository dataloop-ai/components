<template>
    <div class="dl-studio-layout">
        <dl-layout :template="template">
            <template #header>
                <slot name="header" />
            </template>
            <template #leftDrawer>
                <slot name="leftDrawer" />
            </template>
            <template #rightDrawer>
                <slot name="rightDrawer" />
            </template>
            <template #body>
                <slot name="body" />
            </template>
            <template #footer>
                <slot name="footer" />
            </template>
        </dl-layout>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlLayout } from '../../components'

export default defineComponent({
    name: 'DlStudioLayout',
    components: {
        DlLayout
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
