<template>
    <div
        ref="wrapper"
        class="widget-wrapper"
    >
        <div
            :id="uuid"
            ref="widget"
            :class="widgetStyles"
        >
            <div
                class="dl-widget__header"
                @mouseenter="visibleDragIcon = true"
                @mouseleave="visibleDragIcon = false"
            >
                <div class="dl-widget__header--titles">
                    <slot name="header" />
                </div>
                <dl-icon
                    :style="`visibility: ${
                        visibleDragIcon ? 'visible' : 'hidden'
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
import DlIcon from '../DlIcon.vue'
import {
    getElementAbove,
    addMouseEnter,
    removeMouseEnter,
    setFlexBasis,
    insertAfter
} from './utils'
import { swapNodes } from '../../utils/swapNodes'

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
    mounted() {
        setFlexBasis()
    },
    methods: {
        startDragging(e: MouseEvent) {
            this.isDragging = true
            this.draggedWidget = getElementAbove(
                e.target as HTMLElement,
                'dl-widget'
            )
            if (this.draggedWidget) {
                (this.$refs.clone as HTMLElement).appendChild(
                    this.draggedWidget.cloneNode(true)
                )
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
            ;(this.$refs.clone as HTMLElement).innerHTML = ''
            const target = getElementAbove(e.target as HTMLElement, 'dl-widget')
            if (target && this.draggedWidget) {
                swapNodes({
                    source: this.draggedWidget,
                    target
                })
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
            this.timer = setTimeout(this.insertWidget, 1000)
        },
        insertWidget() {
            const targetWidget = getElementAbove(
                this.hoveredWidget,
                'widget-wrapper'
            )
            const targetRow = getElementAbove(this.hoveredWidget, 'dl-grid-row')
            if (this.isLeftSide) {
                targetRow.insertBefore(
                    this.$refs.wrapper as HTMLElement,
                    targetWidget
                )
            } else {
                insertAfter(
                    this.$refs.wrapper as unknown as HTMLElement,
                    targetWidget
                )
            }
            this.hoveredWidget.removeEventListener(
                'mousemove',
                this.handleMouseInsideWidget
            )
            setFlexBasis()
        },
        handleMouseInsideWidget(e: MouseEvent) {
            const mouseOffsetInside = e.clientX - this.hoveredWidget.offsetLeft
            const isLeftSide =
                mouseOffsetInside < this.hoveredWidget.offsetWidth / 2
            if (this.isLeftSide !== isLeftSide) {
                clearTimeout(this.timer)
                this.handleMouseEnter(e)
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
            cursor: pointer;

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
        visibility: hidden;
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
    transition: 0.1s;
}
</style>
