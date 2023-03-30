<template>
    <div
        :style="rowGap"
        class="dl-grid"
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
        rowGap(): Record<string, string> {
            return { '--row-gap': this.gap }
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid {
    display: flex;
    flex-direction: column;
}
</style>
