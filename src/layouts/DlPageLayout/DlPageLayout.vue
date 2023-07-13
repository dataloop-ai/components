<template>
    <div>
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
            <template #body>
                <slot name="body">
                    <slot />
                </slot>
            </template>
            <template #footer>
                <slot name="footer" />
            </template>
        </dl-layout>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlLayout } from '../../components'
import { DlCounterItem } from '../../types'
import { DlPageLayoutHeader } from './components'

export default defineComponent({
    name: 'DlPageLayout',
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
        const template = '"h h h" "p p p" "f f f"'

        return {
            template
        }
    }
})
</script>

<style scoped></style>
