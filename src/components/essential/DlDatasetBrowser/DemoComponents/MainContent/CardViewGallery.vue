<template>
    <div class="card-view-gallery">
        <div
            v-for="(image, imageIndex) in items"
            :key="imageIndex"
            :style="imageStyles(image.url)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { ImageMetadata } from '../types/imageMetadata'

export default defineComponent({
    name: 'CardViewGallery',
    props: {
        items: {
            type: Array,
            default: () => Array as PropType<ImageMetadata[]>
        }
    },
    setup() {
        const imageStyles = (url: string): Record<string, string> => ({
            backgroundImage: `url(${url})`,
            width: '127px',
            height: '135px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            marginRight: '10px'
        })
        const log = console.log

        return {
            imageStyles,
            log
        }
    }
})
</script>

<style scoped lang="scss">
.card-view-gallery {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
    align-content: center;
    text-align: center;
}
</style>
