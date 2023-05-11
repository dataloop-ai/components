<template>
    <div class="dl-layout-main">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutMain'
})
</script>

<style scoped lang="scss">
.dl-layout-main {
    height: 100%;
    -webkit-flex: 2;
    -ms-flex: 2;
    flex: 2;
    overflow: scroll;
}
</style>
