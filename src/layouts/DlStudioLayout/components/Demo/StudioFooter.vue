<template>
    <div class="dl-studio-layout-footer">
        Footer slot Footer slot Footer slot Footer slot Footer slot Footer slot
        Footer slot Footer slot Footer slot Footer slot Footer slot Footer slot
        Footer slot
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'StudioFooter'
})
</script>

<style scoped lang="scss">
.dl-studio-layout-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dl-color-lighter);
    height: 50px;
}
</style>
