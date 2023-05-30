<template>
    <DlDemoPage :is-dark="isDark" />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlDemoPage } from './demos'

export default defineComponent({
    name: 'DlComponentsDemo',
    components: {
        DlDemoPage
    },
    props: {
        isDark: { required: false, default: false, type: Boolean }
    }
})
</script>

<style scoped lang="scss"></style>
