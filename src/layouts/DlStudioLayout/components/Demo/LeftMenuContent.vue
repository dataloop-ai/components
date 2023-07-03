<template>
    <div class="left-side-content">
        <div style="padding-top: 30px">
            Left side content slot
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'LeftMenuContent'
})
</script>

<style scoped lang="scss">
.left-side-content {
    height: 100%;
    color: var(--dl-color-lighter);
    background-color: var(--dl-color-side-panel);
}
</style>
