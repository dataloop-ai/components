<template>
    <div
        class="color-alpha"
        @mousedown.prevent.stop="selectAlpha"
    >
        <canvas ref="canvasAlpha" />
        <div
            :style="slideAlphaStyle"
            class="slide"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createAlphaSquare, createLinearGradient } from './utils'

export default defineComponent({
    name: 'DlAlpha',
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        rgba: {
            type: Object,
            default: () => ({
                r: 0,
                g: 0,
                b: 0,
                a: 1
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
    emits: ['selectAlpha', 'updateAlpha'],
    data() {
        return {
            slideAlphaStyle: {},
            alphaSize: 5
        }
    },
    watch: {
        color() {
            this.renderColor()
        },
        'rgba.a'() {
            this.renderSlide()
        }
    },
    mounted() {
        this.renderColor()
        this.renderSlide()
    },
    methods: {
        renderColor() {
            const canvas = this.$refs.canvasAlpha as HTMLCanvasElement
            const width = this.width
            const height = this.height
            const size = this.alphaSize
            const canvasSquare = createAlphaSquare(size)

            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.width = width
            canvas.height = height

            ctx.fillStyle = ctx.createPattern(
                canvasSquare,
                'repeat'
            ) as CanvasPattern
            ctx.fillRect(0, 0, width, height)

            createLinearGradient(
                'p',
                ctx,
                width,
                height,
                'rgba(255,255,255,0)',
                this.color
            )
        },
        renderSlide() {
            this.slideAlphaStyle = {
                top: this.rgba.a * this.height - 2 + 'px'
            }
        },
        selectAlpha(e: MouseEvent) {
            const { top: hueTop } = this.$el.getBoundingClientRect()
            let alpha: number = 0
            const mousemove = (e: MouseEvent) => {
                let y = e.clientY - hueTop

                if (y < 0) {
                    y = 0
                }
                if (y > this.height) {
                    y = this.height
                }

                alpha = parseFloat((y / this.height).toFixed(2))
                this.$emit('selectAlpha', alpha)
            }

            mousemove(e)

            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
                this.$emit('updateAlpha', alpha)
            }

            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
    }
})
</script>

<style scoped lang="scss">
.color-alpha {
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
