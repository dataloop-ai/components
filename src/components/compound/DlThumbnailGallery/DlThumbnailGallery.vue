<template>
    <div class="slider-wrapper">
        <div
            :style="imageContainerStyles"
            class="slider"
        >
            <div class="slider__arrow">
                <div
                    :class="getChevronClass('left')"
                    @mousedown="navigateBackward"
                >
                    <dl-icon
                        color="--dl-color-darker"
                        size="24px"
                        icon="icon-dl-left-chevron"
                        :inline="false"
                    />
                </div>
            </div>

            <div
                ref="images"
                class="slider__images"
            >
                <div
                    v-for="image in currentImages"
                    :key="image.src"
                    :class="getImageClass(image.src)"
                    :style="getImageOutline(image.src)"
                    @mousedown="handleThumbnailMousedown(image)"
                >
                    <div class="slider__images--status">
                        <dl-icon
                            v-if="image.status"
                            size="16px"
                            color="dl-color-darker"
                            :icon="getStatusIcon(image.status)"
                        />
                    </div>
                    <img
                        :src="image.src"
                        @error="handleImageError"
                    >
                    <dl-tooltip>{{ image.name }}</dl-tooltip>
                </div>
            </div>

            <div class="slider__arrow">
                <div
                    :class="getChevronClass('right')"
                    @mousedown="navigateForward"
                >
                    <dl-icon
                        size="24px"
                        icon="icon-dl-right-chevron"
                        :inline="false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon, DlTooltip } from '../../essential'
import { DlThumbnail, statusColors } from './types'

export default defineComponent({
    components: {
        DlIcon,
        DlTooltip
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        /**
         * The currently selected image
         */
        modelValue: {
            type: Object as PropType<DlThumbnail>,
            default: null
        },
        /**
         * The array of image objects to be contained in the gallery
         */
        images: {
            type: Array as PropType<DlThumbnail[]>,
            default: (): DlThumbnail[] => []
        },
        /**
         * The number of thumbnails visible at once
         */
        visibleThumbnails: {
            type: Number,
            default: 10
        },
        /**
         * The source of the image to be displayed when an image is unavailable
         */
        invalidImage: {
            type: String,
            default: null
        },
        /**
         * The aspect ratio of the image inside each thumbnail. Available values: default, full and full-with-padding
         */
        aspectRatio: {
            type: String,
            default: 'default'
        },
        /**
         * The opacity value of the white overlay on the thumbnails
         */
        overlayOpacity: {
            type: Number,
            default: 0.5
        }
    },
    emits: ['update:modelValue', 'selected'],
    data() {
        return {
            currentList: { first: 0, last: this.visibleThumbnails }
        }
    },
    computed: {
        imageContainerStyles(): object {
            return {
                '--thumbnail-size': `${100 / this.visibleThumbnails}%`,
                '--img-object-fit':
                    this.aspectRatio === 'full' ||
                    this.aspectRatio === 'full-with-padding'
                        ? 'contain'
                        : '',
                '--img-padding':
                    this.aspectRatio === 'full-with-padding' ? '5px' : '',
                '--images-min-width': `${this.currentImages.length * 70}px`,
                '--overlay-opacity': this.overlayOpacity
            }
        },
        currentImages(): DlThumbnail[] {
            return this.images.slice(
                this.currentList.first,
                this.currentList.last
            )
        }
    },
    methods: {
        navigateForward() {
            this.currentList.first += this.visibleThumbnails
            this.currentList.last += this.visibleThumbnails
        },
        navigateBackward() {
            this.currentList.first -= this.visibleThumbnails
            this.currentList.last -= this.visibleThumbnails
        },
        handleImageError(e: ErrorEvent) {
            (e.target as HTMLImageElement).src = this.invalidImage
        },
        getImageOutline(image: string) {
            return {
                outline:
                    image === this.modelValue?.src
                        ? '3px solid var(--dl-color-secondary)'
                        : '1px solid var(--dl-color-separator)'
            }
        },
        getImageClass(image: string) {
            return `slider__images--image ${
                image !== this.modelValue?.src ? 'greyed-out' : ''
            }`
        },
        getStatusIcon(status: string) {
            return statusColors[status as keyof typeof statusColors]
        },
        getChevronClass(side: string) {
            const isVisible =
                side === 'left'
                    ? this.currentList.first > 0
                    : this.currentList.last <= this.images.length
            return isVisible
                ? 'slider__arrow--icon'
                : 'slider__arrow--icon--invisible'
        },
        handleThumbnailMousedown(image: string) {
            this.$emit('update:modelValue', image)
            this.$emit('selected', image)
        }
    }
})
</script>

<style lang="scss" scoped>
.slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
}
.slider {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 65px;
    &__arrow {
        display: flex;
        align-items: center;
        &--icon {
            cursor: pointer;
            background-color: var(--dl-color-text-buttons);
            border-radius: 50%;
            &--invisible {
                visibility: hidden;
                cursor: default;
            }
        }
    }
    &__images {
        display: flex;
        justify-content: center;
        min-width: var(--images-min-width);
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
            background-color: var(--dl-color-text-buttons);
            padding: var(--img-padding);
        }
        &--image img {
            pointer-events: none;
            width: 100%;
            height: 100%;
            object-fit: var(--img-object-fit);
        }
        &--status {
            position: absolute;
            top: 0;
            right: 4px;
        }
    }
}
.greyed-out::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #ffffff;
    opacity: var(--overlay-opacity);
}
</style>
