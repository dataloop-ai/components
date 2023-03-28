<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlScrollBar',
    props: {
        itemCount: {
            type: Number,
            default: 0
        },
        itemsInView: {
            type: Number,
            default: 0
        },
        position: {
            type: Number,
            default: 0
        },
        height: {
            type: String,
            default: null
        }
    },
    emits: ['position-update'],
    data(): {
        isDragging: boolean
        mouseOffsetTop: number
        maxHeight: number
        previousMin: number
    } {
        return {
            isDragging: false,
            mouseOffsetTop: null,
            maxHeight: null,
            previousMin: 0
        }
    },
    computed: {
        heightNum(): number {
            return parseInt(this.height)
        },
        scrollStep(): number {
            return this.heightNum / this.itemCount
        },
        scrollTop(): number {
            const top = this.position * this.scrollStep
            const space =
                this.maxHeight -
                (this.$refs.scroll as HTMLElement)?.offsetHeight -
                50
            return top < space ? top : space
        },
        scrollClasses(): string {
            return `scroll-bar ${this.isDragging ? 'scroll-bar__drag' : ''}`
        },
        scrollStyles(): Record<string, string> {
            return {
                marginTop: `${this.scrollTop}px`,
                height: `${
                    (this.itemsInView * this.heightNum) / this.itemCount
                }px`
            }
        },
        maxScroll(): number {
            return (this.$refs as any).wrapper.offsetHeight - 50 || 1
        }
    },
    mounted() {
        window.addEventListener('mouseup', this.stopDragging)
        this.$nextTick(() => {
            this.maxHeight = (this.$refs.wrapper as HTMLElement).offsetHeight
        })
    },
    methods: {
        startDragging(e: MouseEvent) {
            this.isDragging = true
            this.mouseOffsetTop =
                e.clientY - (this.$refs.scroll as HTMLElement).offsetTop
            window.addEventListener('mousemove', this.moveScrollBar)
        },
        stopDragging() {
            this.isDragging = false
            window.removeEventListener('mousemove', this.moveScrollBar)
        },
        moveScrollBar(e: MouseEvent) {
            if (!this.isDragging) return
            const marginTop =
                e.clientY -
                (this.$refs.wrapper as HTMLElement).offsetTop -
                this.mouseOffsetTop
            if (
                marginTop < 0 ||
                marginTop >
                    this.maxHeight -
                        (this.$refs.scroll as HTMLElement).offsetHeight -
                        50
            )
                return
            ;(
                this.$refs.scroll as HTMLElement
            ).style.marginTop = `${marginTop}px`
            this.updatePosition(marginTop)
        },
        updatePosition(top: number) {
            const newMin = Math.trunc((this.itemCount * top) / this.maxScroll)
            if (newMin !== this.previousMin + 1) {
                this.$emit('position-update', newMin)
            }
        }
    }
})
</script>

<template>
    <div
        ref="wrapper"
        class="scroll-bar-wrapper"
    >
        <div
            ref="scroll"
            :style="scrollStyles"
            :class="scrollClasses"
            @mousedown="startDragging"
        />
    </div>
</template>

<style scoped lang="scss">
.scroll-bar-wrapper {
    margin-top: 10px;
    width: 1%;
}
.scroll-bar {
    background: #d9d9d9;
    width: 100%;
    opacity: 0.8;
    border-radius: 5px;
    transition: margin-top 0.5s;
    cursor: pointer;
    &:hover {
        background-color: #949494;
    }
    &__drag {
        transition: margin-top 0s;
    }
}
</style>
