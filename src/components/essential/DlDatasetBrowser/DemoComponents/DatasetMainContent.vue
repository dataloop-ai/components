<template>
    <div class="main-content">
        <main-content-header />
        <main-content-images />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import MainContentHeader from './MainContentNav.vue'
import MainContentImages from './MainContentImages.vue'

export default defineComponent({
    name: 'DatasetMainContent',
    components: {
        MainContentHeader,
        MainContentImages
    }
})
</script>

<style scoped lang="scss">
.main-content {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
    padding-inline: 20px;
    align-content: center;
    text-align: center;

    img {
        width: 135px;
        height: 135px;
        object-fit: cover;
        border-radius: 2px;
    }
}
</style>
