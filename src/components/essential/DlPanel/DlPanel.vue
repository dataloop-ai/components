<template>
    <div
        :id="uuid"
        class="dl-panel"
        :class="{ 'non-selectable': avoidUserSelect }"
        :data-resizable="resizable"
        :style="cssVariables"
    >
        <div class="content">
            <slot />
        </div>
        <div
            ref="separator"
            class="separator"
            :class="{ resize: canResizeOrCollapse }"
        >
            <div v-show="canResizeOrCollapse" class="gutter" />
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

const MIN_HEIGHT = 25

export default defineComponent({
    name: 'DlPanel',
    props: {
        resizable: {
            type: Boolean,
            default: false
        },
        collapsable: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: null
        },
        minHeight: {
            type: Number,
            default: null
        },
        maxHeight: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            uuid: `dl-panel-${v4()}`,
            initialHeight: 0,
            y: 0,
            isFullHeight: false,
            avoidUserSelect: false
        }
    },
    computed: {
        canResizeOrCollapse(): boolean {
            return this.resizable === true || this.collapsable === true
        },
        computedHeight(): number {
            return this.height && this.height >= 0 ? this.height : 0
        },
        cssVariables(): Record<string, any> {
            return {
                '--dl-panel-height':
                    this.computedHeight === 0
                        ? '100%'
                        : this.computedHeight + 'px'
            }
        },
        _25PercentFromInitH(): number {
            return (this.initialHeight * 25) / 100
        },
        computedMinHeight(): number {
            if (this.minHeight && this.minHeight >= 0) {
                return this.minHeight
            }

            return this._25PercentFromInitH || MIN_HEIGHT
        },
        computedMaxHeight(): number {
            if (this.maxHeight && this.maxHeight >= this.initialHeight) {
                return this.maxHeight
            }

            return this.initialHeight + this._25PercentFromInitH
        }
    },
    mounted() {
        this.setIsFullHeight()

        const { height } = this.$el.getBoundingClientRect()
        ;(this.$el as HTMLDivElement).style.setProperty(
            '--dl-panel-height',
            height + 'px'
        )
        this.initialHeight = height

        const separator = this.$refs['separator'] as HTMLDivElement

        if (this.resizable === true) {
            separator.addEventListener('mousedown', this.mousedown)
        }

        if (this.collapsable === true) {
            separator.addEventListener('dblclick', this.doubleClick)
        }
    },
    methods: {
        mousedown(e: MouseEvent) {
            this.avoidUserSelect = true

            document.addEventListener('mousemove', this.mousemove)
            document.addEventListener('mouseup', this.mouseup)

            const { y } = this.$el.getBoundingClientRect()
            this.y = y + window.scrollY
        },
        mousemove(e: MouseEvent) {
            let diff
            let elementHeight

            const initialY = this.initialHeight + this.y

            if (e.pageY > initialY) {
                diff = e.pageY - initialY
                elementHeight = this.initialHeight + diff
            } else {
                diff = initialY - e.pageY
                elementHeight = this.initialHeight - diff
            }

            if (
                elementHeight >= this.computedMinHeight &&
                elementHeight <= this.computedMaxHeight
            ) {
                ;(this.$el as HTMLDivElement).style.height =
                    elementHeight + 'px'
            }
        },
        mouseup(e: MouseEvent) {
            this.setIsFullHeight()
            this.avoidUserSelect = false

            document.removeEventListener('mousemove', this.mousemove)
            document.removeEventListener('mouseup', this.mouseup)
        },
        doubleClick(e: MouseEvent) {
            let elementHeight = this.initialHeight

            if (this.isFullHeight === true) {
                elementHeight = this.computedMinHeight
            }

            ;(this.$el as HTMLDivElement).style.height = elementHeight + 'px'

            this.setIsFullHeight()
        },
        setIsFullHeight() {
            const boundings = this.$el.getBoundingClientRect()
            this.isFullHeight = this.initialHeight === boundings.height
        }
    },
    template: 'dl-panel'
})
</script>

<style scoped lang="scss">
.dl-panel {
    position: relative;
    background-color: var(--dl-color-panel-background);
    height: var(--dl-panel-height);

    & .content {
        overflow: hidden;
    }

    & .separator {
        position: absolute;
        bottom: -1px;
        height: 1px;
        width: 100%;
        background-color: var(--dl-color-separator);
        z-index: var(--dl-z-index-panel-elements);
    }

    & .gutter {
        position: absolute;
        bottom: -4px;
        left: calc(100% / 2 - 12px);
        height: 1px;
        width: 24px;
        background-color: var(--dl-color-lighter);
        z-index: var(--dl-z-index-panel-elements);
    }

    .resize {
        cursor: row-resize;

        &:hover {
            background-color: var(--dl-color-secondary);
        }
    }
}
</style>
