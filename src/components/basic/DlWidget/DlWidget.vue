<template>
    <div
        ref="wrapper"
        class="widget-wrapper"
    >
        <div
            :id="uuid"
            ref="widget"
            :class="widgetStyles"
            @mouseenter="handleVisibleDragIcon(true)"
            @mouseleave="handleVisibleDragIcon(false)"
        >
            <div class="dl-widget__header">
                <div class="dl-widget__header--titles">
                    <slot name="header" />
                </div>
                <dl-icon
                    :style="`visibility: ${
                        visibleDragIcon && !isDragging ? 'visible' : 'hidden'
                    }`"
                    class="dl-widget__header--drag-icon"
                    icon="icon-dl-drag"
                    color="dl-color-medium"
                    size="15px"
                    @mousedown="startDragging"
                />
                <slot name="menu" />
            </div>

            <div class="dl-widget__content">
                <slot name="content" />
            </div>

            <div class="dl-widget__description">
                <slot name="description" />
            </div>
        </div>
        <div
            ref="clone"
            class="drag-clone"
        />
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
import { DlIcon } from '../../essential'
import { getElementAbove, addMouseEnter, removeMouseEnter } from './utils'

export default defineComponent({
    name: 'DlWidget',
    components: {
        DlIcon
    },
    data() {
        return {
            uuid: `dl-widget-${v4()}`,
            draggedWidget: null,
            hoveredWidget: null,
            isLeftSide: false,
            flexBasis: null,
            isDragging: false,
            timer: null,
            visibleDragIcon: false
        }
    },
    computed: {
        widgetStyles() {
            return `${this.isDragging ? 'dl-widget__drag' : 'dl-widget'}`
        }
    },
    methods: {
        startDragging(e: MouseEvent) {
            this.isDragging = true
            document.body.style.cursor = 'grabbing'
            this.draggedWidget = getElementAbove(
                e.target as HTMLElement,
                'dl-widget'
            )
            if (this.draggedWidget) {
                const clone = this.$refs.clone as HTMLElement
                clone.appendChild(this.draggedWidget.cloneNode(true))
                clone.style.visibility = 'visible'
                clone.style.width = `${this.draggedWidget.offsetWidth}px`
                clone.style.height = `${this.draggedWidget.offsetHeight}px`
            }

            const sourceCanvas = this.draggedWidget?.querySelector('canvas')
            if (sourceCanvas) {
                const targetCanvasCtx = (this.$refs.clone as HTMLElement)
                    .querySelector('canvas')
                    .getContext('2d')

                targetCanvasCtx.drawImage(sourceCanvas, 0, 0)
            }

            this.moveClone(e as MouseEvent)

            addMouseEnter('dl-widget', this.handleMouseEnter as any)

            window.addEventListener('mousemove', this.moveClone)
            window.addEventListener('mouseup', this.stopDragging)
        },
        moveClone(e: MouseEvent) {
            if (!this.isDragging) return
            const clone = this.$refs.clone as HTMLElement
            clone.style.left = `${e.pageX - clone.offsetWidth / 2 - 5}px`
            clone.style.top = `${e.pageY + 10}px`
        },
        stopDragging(e: MouseEvent) {
            this.isDragging = false
            document.body.style.cursor = 'default'
            const clone = this.$refs.clone as HTMLElement
            clone.style.visibility = 'hidden'
            clone.innerHTML = ''
            const target = getElementAbove(e.target as HTMLElement, 'dl-widget')
            const change = {
                source: this.draggedWidget,
                target
            }
            if (target && this.draggedWidget) {
                const event = new CustomEvent('change-position', {
                    detail: change
                })
                ;(this.$refs.wrapper as HTMLElement).dispatchEvent(event)
            }
            window.removeEventListener('mousemove', this.moveClone)
            window.removeEventListener('mouseup', this.stopDragging)
            setTimeout(() => {
                removeMouseEnter('dl-widget', this.handleMouseEnter as any)
            }, 1)
        },
        handleMouseEnter(e: MouseEvent) {
            this.hoveredWidget = e.target as HTMLElement
            const mouseOffsetInside = e.clientX - this.hoveredWidget.offsetLeft
            this.isLeftSide =
                mouseOffsetInside < this.hoveredWidget.offsetWidth / 2
            this.hoveredWidget.addEventListener(
                'mousemove',
                this.handleMouseInsideWidget
            )
            this.hoveredWidget.addEventListener('mouseleave', () => {
                clearTimeout(this.timer)
                this.hoveredWidget.removeEventListener(
                    'mousemove',
                    this.handleMouseInsideWidget
                )
            })
            this.timer = setTimeout(this.insertWidget, 200)
        },
        insertWidget() {
            const targetWidget = getElementAbove(
                this.hoveredWidget,
                'widget-wrapper'
            )
            const event = new CustomEvent('change-position', {
                detail: {
                    source: this.$refs.wrapper,
                    target: targetWidget,
                    side: this.isLeftSide ? 'left' : 'right'
                }
            })
            ;(this.$refs.wrapper as HTMLElement).dispatchEvent(event)
            window.clearTimeout(this.timer)
            this.hoveredWidget.removeEventListener(
                'mousemove',
                this.handleMouseInsideWidget
            )
        },
        handleMouseInsideWidget(e: MouseEvent) {
            const mouseOffsetInside = e.clientX - this.hoveredWidget.offsetLeft
            const isLeftSide =
                mouseOffsetInside < this.hoveredWidget.offsetWidth / 2
            if (this.isLeftSide !== isLeftSide) {
                clearTimeout(this.timer)
                this.handleMouseEnter(e)
            }
        },
        handleVisibleDragIcon(val: boolean) {
            if (!document.querySelector('.drag-clone').innerHTML.toString()) {
                this.visibleDragIcon = val
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-widget {
    border: 1px solid var(--dl-color-separator);
    user-select: none;
    height: 100%;
    display: flex;
    flex-direction: column;
    &__header {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid var(--dl-color-separator);

        &--drag-icon {
            flex-grow: 1;
            cursor: grab;

            &::v-deep .dl-icon {
                transform: rotate(90deg) !important;
            }
        }

        &--titles {
            width: 50%;
            display: flex;
            flex-direction: column;
        }
    }
    &__content {
        padding: 5px;
    }
    &__description {
        margin-top: auto;
        padding: 5px;
        font-size: 10px;
    }

    &__drag {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: var(--dl-color-separator);
            border-radius: 5px;
        }
    }
}

.drag-clone {
    position: absolute;
    background-color: var(--dl-color-text-buttons);
    z-index: var(--dl-z-index-menu);
}

.widget-wrapper {
    flex-basis: var(--widget-flex-basis);
    margin: var(--row-gap) var(--column-gap);
    padding: 15px;
}
</style>
