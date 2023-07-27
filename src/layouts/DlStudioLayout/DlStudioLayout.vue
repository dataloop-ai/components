<template>
    <dl-layout
        class="dl-studio-layout"
        :template="template"
    >
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
