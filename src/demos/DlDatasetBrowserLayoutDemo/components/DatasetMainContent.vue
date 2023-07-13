<template>
    <div class="main-content">
        <main-content-header @onChangeViewMode="handleViewMode" />
        <main-content-images :view-mode="viewMode" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import MainContentHeader from './MainContent/MainContentNav.vue'
import MainContentImages from './MainContent/MainContentImages.vue'

export default defineComponent({
    name: 'DatasetMainContent',
    components: {
        MainContentHeader,
        MainContentImages
    },
    setup() {
        const viewMode = ref('')
        const handleViewMode = (value: string) => {
            viewMode.value = value
        }

        return {
            viewMode,
            handleViewMode
        }
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
