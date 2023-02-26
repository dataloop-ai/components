<template>
    <canvas style="border-radius: 2px" />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createAlphaSquare } from './utils'

export default defineComponent({
    name: 'DlPreview',
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 28
        }
    },
    data() {
        return {
            alphaSize: 5
        }
    },
    watch: {
        color() {
            this.renderColor()
        }
    },
    mounted() {
        this.renderColor()
    },
    methods: {
        renderColor() {
            const canvas = this.$el as HTMLCanvasElement
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

            ctx.fillStyle = this.color
            ctx.fillRect(0, 0, width, height)
        }
    }
})
</script>
