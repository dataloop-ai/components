<template>
    <div>
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
    name: 'DlDatasetBrowser',
    components: {
        DlLayout
    },
    setup() {
        const template = '"h h h" "l p r" "f f f"'

        return {
            template
        }
    }
})
</script>

<style scoped></style>
