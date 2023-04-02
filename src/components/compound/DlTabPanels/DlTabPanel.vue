<template>
    <div :id="uuid">
        <slot />
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTabPanels',
    props: {
        name: { type: String, required: true }
    },
    data() {
        return {
            uuid: `dl-tab-panel-${v4()}`
        }
    }
})
</script>
