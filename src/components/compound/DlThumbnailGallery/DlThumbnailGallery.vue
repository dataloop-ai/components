<template>
    <div class="gallery-wrapper">
        <div
            :style="imageContainerStyles"
            class="image-container"
        >
            <div class="slider">
                <div class="slider__arrow">
                    <dl-icon
                        size="l"
                        icon="icon-dl-left-chevron"
                        @mousedown.native="navigateBackward"
                    />
                </div>

                <div class="slider__images">
                    <div
                        v-for="image in currentImages"
                        :key="image"
                        class="slider__images--image"
                    >
                        <img
                            :src="image"
                            @mousedown="currentImage = image"
                        >
                    </div>
                </div>

                <div class="slider__arrow">
                    <dl-icon
                        size="l"
                        icon="icon-dl-right-chevron"
                        @mousedown.native="navigateForward"
                    />
                </div>
            </div>
        </div>
        <div class="menu" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'

export default defineComponent({
    components: {
        DlIcon
    },
    props: {
        images: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    data() {
        return {
            currentImage: this.images[0],
            currentImages: this.images
        }
    },
    computed: {
        imageContainerStyles(): object {
            return {
                backgroundImage: `url(${this.currentImage})`
            }
        }
    },
    methods: {
        navigateForward() {
            const firstElement = this.images[0]
            this.currentImages.shift()
            this.currentImages.push(firstElement)
        },
        navigateBackward() {
            const lastElement = this.currentImages.at(-1)
            this.currentImages.pop()
            this.currentImages.unshift(lastElement)
        }
    }
})
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    width: 100%;
    height: 700px;
    display: flex;
    justify-content: center;
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

.slider {
    position: absolute;
    bottom: 0;
    display: flex;
    &__arrow {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    &__images {
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        &--image {
            padding: 0px 15px;
            cursor: pointer;
        }
        &--image img {
            width: 100px;
            height: 100px;
        }
    }
}
</style>
