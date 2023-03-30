<template>
    <div
        :style="columnGap"
        class="dl-grid-row"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        gap: {
            type: String,
            default: '30px'
        }
    },
    computed: {
        columnGap(): Record<string, string> {
            return { '--column-gap': this.gap }
        }
    }
})
</script>

<style scoped>
.dl-grid-row {
    display: flex;
}
</style>
