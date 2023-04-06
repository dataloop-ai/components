<template>
    <div>
        <dl-thumbnail-gallery :images="images" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlThumbnailGallery } from '../../components'
import images from './images'

export default defineComponent({
    components: {
        DlThumbnailGallery
    },
    setup() {
        return { images }
    }
})
</script>
