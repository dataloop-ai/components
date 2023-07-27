<template>
    <dl-layout :template="template">
        <template #header>
            <slot name="header">
                <dl-page-layout-header
                    :title="title"
                    :sub-title="subTitle"
                    :counters="counters"
                />
            </slot>
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlLayout } from '../../components'
import { DlCounterItem } from '../../types'
import DlPageLayoutHeader from '../DlPageLayout/components/DlPageLayoutHeader/DlPageLayoutHeader.vue'

export default defineComponent({
    name: 'DlDatasetBrowser',
    components: {
        DlLayout,
        DlPageLayoutHeader
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        counters: {
            type: Array as PropType<DlCounterItem[]>,
            default: () => [] as DlCounterItem[]
        }
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
