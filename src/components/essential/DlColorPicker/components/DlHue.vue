<template>
    <div
        class="hue"
        @mousedown.prevent.stop="selectHue"
    >
        <canvas ref="canvasHue" />
        <div
            :style="slideHueStyle"
            class="slide"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlHue',
    props: {
        hsv: {
            type: Object,
            default: () => ({
                h: 0,
                s: 0,
                v: 0
            })
        },
        width: {
            type: Number,
            default: 14
        },
        height: {
            type: Number,
            default: 152
        }
    },
    emits: ['selectHue', 'updateHue'],
    data() {
        return {
            slideHueStyle: {}
        }
    },
    mounted() {
        this.renderColor()
        this.renderSlide()
    },
    methods: {
        renderColor() {
            const canvas = this.$refs.canvasHue as HTMLCanvasElement
            const width = this.width
            const height = this.height
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.width = width
            canvas.height = height

            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, '#FF0000')
            gradient.addColorStop(0.17 * 1, '#FF00FF')
            gradient.addColorStop(0.17 * 2, '#0000FF')
            gradient.addColorStop(0.17 * 3, '#00FFFF')
            gradient.addColorStop(0.17 * 4, '#00FF00')
            gradient.addColorStop(0.17 * 5, '#FFFF00')
            gradient.addColorStop(1, '#FF0000')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
        },
        renderSlide() {
            this.slideHueStyle = {
                top: (1 - this.hsv.h / 360) * this.height - 2 + 'px'
            }
        },
        selectHue(e: MouseEvent) {
            const { top: hueTop } = this.$el.getBoundingClientRect()
            const ctx = (e.target as HTMLCanvasElement).getContext(
                '2d'
            ) as CanvasRenderingContext2D
            let color: { r: number; g: number; b: number } = null

            const mousemove = (e: MouseEvent) => {
                let y = e.clientY - hueTop

                if (y < 0) {
                    y = 0
                }
                if (y > this.height) {
                    y = this.height
                }

                this.slideHueStyle = {
                    top: y - 2 + 'px'
                }

                const imgData = ctx.getImageData(
                    0,
                    Math.min(y, this.height - 1),
                    1,
                    1
                )
                const [r, g, b] = imgData.data
                color = { r, g, b }
                this.$emit('selectHue', color)
            }

            mousemove(e)

            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
                this.$emit('updateHue', color)
            }

            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
    }
})
</script>

<style scoped lang="scss">
.hue {
    position: relative;
    margin-left: 10px;
    cursor: pointer;
    .slide {
        position: absolute;
        left: 0;
        top: 100px;
        width: 100%;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
        pointer-events: none;
    }
}
</style>
