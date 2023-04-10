<template>
    <div
        v-if="showGallery"
        :style="imageContainerStyles"
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
                @mousedown.native="$emit('update:modelValue', image)"
            >
                <img :src="image">
            </div>
        </div>

        <div class="slider__arrow">
            <div class="slider__arrow--icon">
                <dl-button />
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'
import { DlButton } from '../../basic'

export default defineComponent({
    components: {
        DlIcon,
        DlButton
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
            currentList: { first: 0, last: this.visibleThumbnails }
        }
    },
    computed: {
        imageContainerStyles(): object {
            return {
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
</style>
