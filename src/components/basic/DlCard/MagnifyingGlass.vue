<template>
    <div>
        <div class="magnifier">
            <div
                class="magnifier-container"
                @mousemove="moveMagnifier"
                @mouseleave="hideMagnifier"
            >
                <img
                    ref="image"
                    :src="imageUrl"
                    :alt="altText"
                    @mouseenter="showPreview"
                    @mousemove="movePreview"
                >
                <div
                    v-if="zoomMode"
                    ref="glass"
                    class="magnifier-glass"
                />
            </div>
            <!--<dl-tooltip
                    v-show="zoomMode"
                    anchor="center right"
                    self="center right"
                    :offset="[300, 0]"
                    max-height="280px"
                    max-width="280px"
                    style="border: 6px solid black"
            >
                <div

                        class="image-preview"
                >
                    <img
                            ref="imagePreview"
                            :src="imageUrl"
                            :alt="altText"
                    >
                </div>
            </dl-tooltip>-->
            <!--

            -->
            <!--<dl-tooltip
                    v-show="zoomMode"
                    anchor="center right"
                    self="center right"
                    :offset="[300, 0]"
                    max-height="280px"
                    max-width="280px"
                    style="border: 6px solid black"
            >
                <div
                        v-if="showImagePreview && zoomMode"
                        class="image-preview"
                >
                    <img
                            ref="imagePreview"
                            :src="imageUrl"
                            :alt="altText"
                    >
                </div>
            </dl-tooltip>-->
            <div
                v-if="showImagePreview && zoomMode"
                class="image-preview"
            >
                <img
                    ref="imagePreview"
                    :src="imageUrl"
                    :alt="altText"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'MagnifyingGlass',
    props: {
        imageUrl: {
            type: String,
            required: true
        },
        altText: {
            type: String,
            required: true
        },
        zoomMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showImagePreview: false,
            previewOffset: { x: 0, y: 0 }
        }
    },
    methods: {
        moveMagnifier(event: MouseEvent) {
            if (!this.zoomMode) return
            const glass: HTMLElement = this.$refs.glass as HTMLElement
            const image: HTMLElement = this.$refs.image as HTMLElement
            const imagePreview: HTMLElement = this.$refs
                .imagePreview as HTMLElement

            const pos = this.getCursorPos(event)
            let x = pos.x - glass.offsetWidth / 2
            let y = pos.y - glass.offsetHeight / 2

            if (x > (image as HTMLElement).clientWidth - glass.offsetWidth) {
                x = image.clientWidth - glass.offsetWidth
            }
            if (x < 0) {
                x = 0
            }
            if (y > image.clientHeight - glass.offsetHeight) {
                y = image.clientHeight - glass.offsetHeight
            }
            if (y < 0) {
                y = 0
            }

            glass.style.left = x + 'px'
            glass.style.top = y + 'px'
            glass.style.backgroundPosition = '-' + x * 2 + 'px -' + y * 2 + 'px'
            glass.style.display = 'block'

            if (!imagePreview?.clientWidth) return
            const previewWidth = imagePreview.clientWidth
            const scaleValue = 500 / previewWidth
            imagePreview.style.transform = 'scale(' + scaleValue + ')'
            imagePreview.style.top = -(5 * y) + 'px'
            imagePreview.style.left = -(2.6 * x) + 'px'
        },
        hideMagnifier() {
            if (!this.zoomMode) return
            ;(this.$refs.glass as HTMLElement).style.display = 'none'
            this.showImagePreview = false
        },
        getCursorPos(event: MouseEvent) {
            if (!this.zoomMode) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            let x = event.clientX - rect.left
            let y = event.clientY - rect.top

            x = x - window.pageXOffset
            y = y - window.pageYOffset

            return { x, y }
        },
        showPreview() {
            // if(!this.zoomMode) return
            this.showImagePreview = true
        },
        hidePreview() {
            if (!this.zoomMode) return
            this.showImagePreview = false
        },
        movePreview(event: MouseEvent) {
            if (!this.zoomMode) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            this.previewOffset = { x, y }
        }
    }
})
</script>

<style scoped lang="scss">
.magnifier {
    position: relative;
}

.magnifier-container {
    display: inline-block;
    position: relative;
    width: 200px;
    margin: 0;

    img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
}

.magnifier-glass {
    position: absolute;
    border: 1px solid #ccc;
    width: 112px;
    height: 112px;
    /*display: none;*/
    /*pointer-events: none;*/
    /*z-index: 999;*/
    cursor: zoom-in;
    background: #ffffff;
    opacity: 0.7;
}

.image-preview {
    /*

        position: fixed;
        top: 50%;
        right: 10%;
        transform: translate(-50%, -50%);
        width: 280px;
        height: 280px;
        overflow: hidden;
*/
    position: fixed;
    top: 50%;
    right: 20%;
    height: 280px;
    width: 280px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border: 6px solid white;

    img {
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(2);
        transform-origin: left top;
    }
}
</style>
