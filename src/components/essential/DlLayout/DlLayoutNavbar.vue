<template>
    <div class="dl-layout-navbar">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutNavbar'
})
</script>

<style scoped lang="scss">
.dl-layout-navbar {
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
}
</style>
