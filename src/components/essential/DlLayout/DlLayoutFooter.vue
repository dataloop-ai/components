<template>
    <div class="dl-layout-footer">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutFooter'
})
</script>

<style scoped lang="scss">
.dl-layout-footer {
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
    bottom: 0;
    left: 0px;
    right: 0px;
    width: 100%;
    margin-bottom: 0px;
    align-items: center;
    align-self: flex-end;
}
</style>
