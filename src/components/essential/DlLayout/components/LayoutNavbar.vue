<template>
    <div class="dl-layout-navbar">
        <div style="width: 100%; height: 100%">
            <slot />
        </div>
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
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
}
</style>
