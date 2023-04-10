<template>
    <div style="height: 700px">
        <dl-thumbnail-gallery
            v-model="selectedImage"
            :images="images"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlThumbnailGallery } from '../../components'
import images from './images'

export default defineComponent({
    components: {
        DlThumbnailGallery
    },
    setup() {
        const selectedImage = ref('')
        return { images, selectedImage }
    }
})
</script>
