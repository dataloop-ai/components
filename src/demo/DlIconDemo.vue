<template>
    <div>
        <DlIcon icon="icon-dl-usage" />
        <DlIcon
            color="dl-color-secondary"
            icon="icon-dl-arrow-up"
        />
        <DlIcon
            size="50px"
            color="red"
            icon="icon-dl-search"
        />
        SVG ICON:

        <DlIcon
            size="50px"
            color="red"
            icon="mastercard"
            svg
        />

        Clickable:

        <DlIcon
            size="50px"
            color="red"
            icon="icon-dl-search"
            @click.stop="onClick"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlIcon } from '../components'
export default defineComponent({
    name: 'DlIconDemo',
    components: {
        DlIcon
    },
    methods: {
        onClick() {
            console.log('clicked')
        }
    }
})
</script>
