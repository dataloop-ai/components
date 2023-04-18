<template>
    <div class="slider-wrapper">
        <div
            v-if="showGallery"
            :style="imageContainerStyles"
            class="slider"
        >
            <div class="slider__arrow">
                <div
                    v-if="currentList.first > 0"
                    class="slider__arrow--icon"
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
                    class="slider__images--image"
                    :style="getBorderRadius(image.src)"
                    @mousedown="$emit('update:modelValue', image)"
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
                    v-if="currentList.last <= images.length"
                    class="slider__arrow--icon"
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
        modelValue: {
            type: Object as PropType<DlThumbnail>,
            default: null
        },
        images: {
            type: Array as PropType<DlThumbnail[]>,
            default: () => []
        },
        visibleThumbnails: {
            type: Number,
            default: 10
        },
        invalidImage: {
            type: String,
            default: null
        },
        aspectRatio: {
            type: String,
            default: 'default'
        }
    },
    data() {
        return {
            showGallery: true,
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
                    this.aspectRatio === 'full-with-padding' ? '5px' : ''
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
        navigateForward() {
            this.currentList.first += this.visibleThumbnails
            this.currentList.last += this.visibleThumbnails
        },
        navigateBackward() {
            this.currentList.first -= this.visibleThumbnails
            this.currentList.last -= this.visibleThumbnails
        },
        getBorderRadius(image: string) {
            const isCurrent = image === this.modelValue?.src
            return {
                border: isCurrent
                    ? '3px solid var(--dl-color-secondary)'
                    : '1px solid var(--dl-color-separator)',
                opacity: isCurrent ? '1' : '0.8'
            }
        },
        handleImageError(e: ErrorEvent) {
            console.log(this.invalidImage)
            ;(e.target as HTMLImageElement).src = this.invalidImage
        },
        getStatusIcon(status: string) {
            return statusColors[status]
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
        cursor: pointer;
        display: flex;
        align-items: center;
        &--icon {
            background-color: var(--dl-color-text-buttons);
            border-radius: 50%;
        }
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
</style>
