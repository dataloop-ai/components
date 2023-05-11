<template>
    <div class="dl-layout">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlLayout'
})
</script>

<style scoped lang="scss">
.dl-layout {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    min-height: 100%;
}
</style>
