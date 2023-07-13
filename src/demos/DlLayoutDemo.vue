<template>
    <div>
        <DlStudioLayoutDemo />
        <DlDatasetBrowserLayoutDemo />
        <DlPageLayoutDemo />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlStudioLayoutDemo } from './DlStudioLayoutDemo'
import { DlDatasetBrowserLayoutDemo } from './DlDatasetBrowserLayoutDemo'
import { DlPageLayoutDemo } from './DlPageLayoutDemo'

export default defineComponent({
    name: 'DlLayoutDemo',
    components: {
        DlStudioLayoutDemo,
        DlDatasetBrowserLayoutDemo,
        DlPageLayoutDemo
    }
})
</script>

<style scoped lang="scss"></style>
