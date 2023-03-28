<template>
    <div
        class="saturation"
        @mousedown.prevent.stop="selectSaturation"
    >
        <canvas ref="canvasSaturation" />
        <div
            :style="slideSaturationStyle"
            class="slide"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createLinearGradient } from './utils'

export default defineComponent({
    name: 'DlSaturation',
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        hsv: {
            type: Object,
            default: () => ({
                h: 0,
                s: 0,
                v: 0
            })
        },
        size: {
            type: Number,
            default: 152
        }
    },
    emits: ['selectSaturation', 'updateSaturation'],
    data() {
        return {
            slideSaturationStyle: {}
        }
    },
    mounted() {
        this.renderColor()
        this.renderSlide()
    },
    methods: {
        renderColor() {
            const canvas = this.$refs.canvasSaturation as HTMLCanvasElement
            const size = this.size
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.width = size
            canvas.height = size

            ctx.fillStyle = this.color
            ctx.fillRect(0, 0, size, size)

            createLinearGradient(
                'l',
                ctx,
                size,
                size,
                '#FFFFFF',
                'rgba(255,255,255,0)'
            )
            createLinearGradient(
                'p',
                ctx,
                size,
                size,
                'rgba(0,0,0,0)',
                '#000000'
            )
        },
        renderSlide() {
            this.slideSaturationStyle = {
                left: this.hsv.s * this.size - 5 + 'px',
                top: (1 - this.hsv.v) * this.size - 5 + 'px'
            }
        },
        selectSaturation(e: any) {
            const { top: saturationTop, left: saturationLeft } =
                this.$el.getBoundingClientRect()
            const ctx = e.target.getContext('2d')
            let color: { r: number; g: number; b: number } = null

            const mousemove = (e: MouseEvent) => {
                let x = e.clientX - saturationLeft
                let y = e.clientY - saturationTop

                if (x < 0) {
                    x = 0
                }
                if (y < 0) {
                    y = 0
                }
                if (x > this.size) {
                    x = this.size
                }
                if (y > this.size) {
                    y = this.size
                }

                this.slideSaturationStyle = {
                    left: x - 5 + 'px',
                    top: y - 5 + 'px'
                }

                const imgData = ctx.getImageData(
                    Math.min(x, this.size - 1),
                    Math.min(y, this.size - 1),
                    1,
                    1
                )
                const [r, g, b] = imgData.data
                color = { r, g, b }
                this.$emit('selectSaturation', color)
            }

            mousemove(e)

            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
                this.$emit('updateSaturation', color)
            }

            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
    }
})
</script>

<style scoped lang="scss">
.saturation {
    position: relative;
    cursor: pointer;
    .slide {
        position: absolute;
        left: 100px;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #fff;
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
        pointer-events: none;
    }
}
</style>
