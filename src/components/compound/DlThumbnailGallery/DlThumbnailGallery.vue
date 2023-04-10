<template>
    <div class="gallery-wrapper">
        <div
            :style="imageContainerStyles"
            class="image-container"
        >
            <div
                v-if="showGallery"
                class="slider"
            >
                <div class="slider__arrow">
                    <dl-icon
                        v-if="currentList.first !== 0"
                        size="l"
                        icon="icon-dl-left-chevron"
                        @mousedown.native="navigateBackward"
                    />
                </div>

                <div
                    ref="images"
                    class="slider__images"
                >
                    <div
                        v-for="image in currentImages"
                        :key="image"
                        class="slider__images--image"
                        :style="getBorderRadius(image)"
                        @mousedown.native="selectImage(image)"
                    >
                        <img :src="image">
                    </div>
                </div>

                <div class="slider__arrow">
                    <div class="slider__arrow--icon">
                        <dl-icon
                            v-if="currentList.last <= images.length"
                            size="l"
                            icon="icon-dl-right-chevron"
                            :inline="false"
                            @mousedown.native="navigateForward"
                        />
                    </div>
                </div>
            </div>
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
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'

export default defineComponent({
    components: {
        DlIcon
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        images: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        visibleThumbnails: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            showGallery: true,
            currentList: { first: 0, last: this.visibleThumbnails },
            selectedIndex: 0
        }
    },
    computed: {
        imageContainerStyles(): object {
            return {
                backgroundImage: `url(${this.modelValue || this.images[0]})`,
                '--thumbnail-size': `${100 / this.visibleThumbnails}%`
            }
        },
        currentImages() {
            return this.images.slice(
                this.currentList.first,
                this.currentList.last
            )
        }
    },
    methods: {
        selectImage(image: string) {
            this.selectedIndex =
                this.images.findIndex((element: string) => element === image) +
                1
            this.$emit('update:modelValue', image)
        },
        navigateForward() {
            this.currentList.first += this.visibleThumbnails
            this.currentList.last += this.visibleThumbnails
        },
        navigateBackward() {
            this.currentList.first -= this.visibleThumbnails
            this.currentList.last -= this.visibleThumbnails
        },
        getBorderRadius(image: string) {
            const isCurrent = image === this.modelValue
            return {
                border: isCurrent
                    ? '3px solid var(--dl-color-secondary)'
                    : '1px solid var(--dl-color-separator)',
                opacity: isCurrent ? '1' : '0.8'
            }
        }
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

.slider {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 65px;
    &__arrow {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    &__images {
        display: flex;
        justify-content: center;
        width: 80%;
        height: 100%;
        padding: 0px 10px;
        &--image {
            position: relative;
            border-radius: 3px;
            margin: 0px 5px;
            width: var(--thumbnail-size);
            max-width: 60px;
            max-height: 60px;
            transition: 0.1s;
            &:hover {
                transform: scale(1.1);
            }
            cursor: pointer;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        &--image img {
            pointer-events: none;
            width: 100%;
            height: 100%;
        }
    }
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
