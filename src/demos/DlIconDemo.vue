<template>
    <div>
        <DlIcon icon="icon-dl-usage" />
        <DlIcon color="dl-color-secondary" icon="icon-dl-arrow-up" />
        <DlIcon size="50px" color="red" icon="icon-dl-search" />
        SVG ICON:

        <DlIcon size="50px" color="red" icon="mastercard" svg />

        COLORED WITHOUT SVG:

        <DlIcon size="50px" color="red" icon="mastercard" />

        Clickable:

        <DlIcon
            size="50px"
            color="red"
            icon="icon-dl-search"
            @click.stop="onClick"
        />

        <dl-input
            v-model="inputValue"
            style="margin-top: 10px"
            title="Custom Label"
        />
        <DlIcon size="50px" :icon="inputValue" />
        <div style="margin-top: 24px">
            <DlIcon size="24px" icon="icon-dl-info" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlIcon, DlInput } from '../components'
export default defineComponent({
    name: 'DlIconDemo',
    components: {
        DlIcon,
        DlInput
    },
    setup() {
        const inputValue = ref('icon-dl-search')

        const onClick = () => {
            console.log('clicked')
        }
        return {
            onClick,
            inputValue
        }
    }
})
</script>
