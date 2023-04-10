<template>
    <div class="gallery-wrapper">
        <div
            :style="imageContainerStyles"
            class="image-container"
        >
            <dl-thumbnail-gallery
                v-model="selectedImage"
                :visible-thumbnails="4"
                :images="images"
            />
        </div>
        <div class="menu">
            <div class="menu__pagination">
                {{ selectedIndex }} / {{ images.length }} Items
            </div>
            <div
                class="menu__thumbnail-icon"
                @mousedown.native="showGallery = !showGallery"
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
import { DlThumbnailGallery } from '../../components'
import images from './images'

export default defineComponent({
    components: {
        DlThumbnailGallery
    },
    setup() {
        const selectedImage = ref('')
        const selectedIndex = ref(0)
        const imageContainerStyles = computed(() => {
            return {
                backgroundImage: `url(${selectedImage.value || images[0]})`
            }
        })
        watch(selectedImage, (val) => {
            selectedIndex.value =
                images.findIndex((element: string) => element === val) + 1
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
    position: relative;
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
