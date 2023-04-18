<template>
    <div class="gallery-wrapper">
        <div
            :style="imageContainerStyles"
            class="image-container"
        >
            <dl-thumbnail-gallery
                v-model="selectedImage"
                :images="images"
                invalid-image="/src/demo/DlThumbnailGallery/images/error.png"
            />
        </div>
        <div class="menu">
            <div class="menu__pagination">
                {{ selectedIndex }} / {{ images.length }} Items
            </div>
            <div
                class="menu__thumbnail-icon"
                @mousedown="showGallery = !showGallery"
            >
                <dl-icon
                    icon="icon-dl-thumbnail"
                    size="l"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue-demi'
import { DlThumbnailGallery, DlThumbnail } from '../components'

const images: DlThumbnail[] = []
for (let i = 1; i < 20; i++) {
    images.push({
        name: `Image ${i}`,
        src: `https://picsum.photos/1000/800?random=${i}`,
        status: ''
    })
}

export default defineComponent({
    components: {
        DlThumbnailGallery
    },
    setup() {
        const selectedImage = ref()
        const selectedIndex = ref(0)
        const imageContainerStyles = computed(() => {
            return {
                backgroundImage: `url(${
                    selectedImage.value?.src || images[0].src
                })`
            }
        })
        watch(selectedImage, (val) => {
            selectedIndex.value =
                images.findIndex(
                    (element: DlThumbnail) => element.src === val.src
                ) + 1
        })

        return { images, selectedImage, imageContainerStyles, selectedIndex }
    }
})
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.image-container {
    user-select: none;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.menu {
    display: flex;
    justify-content: center;
    cursor: pointer;
    margin-top: 10px;
    &__pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--dl-color-medium);
        font-size: 0.7em;
        margin: 0px 10px;
    }
}
</style>
