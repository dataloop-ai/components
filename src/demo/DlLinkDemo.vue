<template>
    <div>
        <DlLink
            href="https://console.dataloop.ai"
            open-in-new-tab
            color="dl-color-secondary"
        >
            Link Test
        </DlLink>
        <div />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlLink } from '../components'
export default defineComponent({
    name: 'DlLinkDemo',
    components: {
        DlLink
    }
})
</script>
