<template>
    <div class="gallery-wrapper">
        <div class="image-container">
            <div class="slider">
                <div class="slider__back">
                    <dl-icon icon="icon-dl-left-chevron" />
                </div>

                <div class="slider__images">
                    <div
                        v-for="image in images"
                        :key="image"
                        class="slider__images--image"
                    >
                        <img :src="image">
                    </div>
                </div>

                <div class="slider__forward">
                    <dl-icon icon="icon-dl-right-chevron" />
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
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
}

.slider {
    position: absolute;
    bottom: 0;
    display: flex;
    &__images {
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        &--image {
            padding: 0px 15px;
        }
        &--image img {
            width: 100px;
            height: 100px;
        }
    }
}

.menu {
}
</style>
