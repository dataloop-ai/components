<template>
    <div
        v-if="showGallery"
        :style="imageContainerStyles"
        class="slider"
    >
        <div class="slider__arrow">
            <div
                v-if="currentList.first !== 0"
                class="slider__arrow--icon"
                @mousedown.native="navigateBackward"
            >
                <dl-icon
                    color="black"
                    size="l"
                    icon="icon-dl-left-chevron"
                />
            </div>
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
                @mousedown.native="$emit('update:modelValue', image)"
            >
                <img
                    :style="imageStyles"
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
                @mousedown.native="navigateForward"
            >
                <dl-icon
                    size="l"
                    icon="icon-dl-right-chevron"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon, DlTooltip } from '../../essential'
import { DlThumbnail } from './types'

export default defineComponent({
    components: {
        DlIcon,
        DlTooltip
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
            default: ''
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
            const isCurrent = image === this.modelValue
            return {
                border: isCurrent
                    ? '3px solid var(--dl-color-secondary)'
                    : '1px solid var(--dl-color-separator)',
                opacity: isCurrent ? '1' : '0.8'
            }
        },
        handleImageError(e: ErrorEvent) {
            (e.target as HTMLImageElement).src = this.invalidImage
        }
    }
})
</script>

<style lang="scss" scoped>
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
    }
}
</style>
