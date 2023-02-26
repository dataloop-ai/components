<template>
    <div class="root-container">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlDialogBoxFooter'
})
</script>

<style lang="scss" scoped>
.root-container {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-end;
}
</style>
