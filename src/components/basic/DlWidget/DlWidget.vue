<template>
    <div
        ref="wrapper"
        class="widget-wrapper"
    >
        <div
            :id="uuid"
            ref="widget"
            :class="widgetClasses"
            @mouseenter="handleVisibleDragIcon(true)"
            @mouseleave="handleVisibleDragIcon(false)"
        >
            <dl-icon
                :style="iconStyles"
                class="dl-widget__drag-icon"
                icon="icon-dl-drag"
                color="dl-color-medium"
                size="15px"
                @mousedown="startDragging"
            />
            <slot>
                <div class="dl-widget__header">
                    <div class="dl-widget__header--titles">
                        <slot name="header" />
                    </div>
                    <slot name="menu" />
                </div>

                <div class="dl-widget__content">
                    <dl-empty-state
                        v-if="isEmpty"
                        v-bind="emptyStateProps"
                    >
                        <template
                            v-for="(_, slot) in $slots"
                            #[slot]="props"
                        >
                            <slot
                                :name="slot"
                                v-bind="props"
                            />
                        </template>
                    </dl-empty-state>
                    <slot
                        v-if="!isEmpty"
                        name="content"
                    />
                </div>

                <div
                    v-if="!isEmpty"
                    class="dl-widget__description"
                >
                    <slot name="description" />
                </div>
            </slot>
        </div>
        <div
            ref="clone"
            class="drag-clone"
        />
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'
import { getElementAbove, addMouseEnter, removeMouseEnter } from './utils'
import { DlEmptyStateProps } from '../DlEmptyState/types'
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'

export default defineComponent({
    name: 'DlWidget',
    components: {
        DlIcon,
        DlEmptyState
    },
    props: {
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () => {}
        }
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
        widgetClasses() {
            return `${this.isDragging ? 'dl-widget__drag' : 'dl-widget'}`
        },
        iconStyles() {
            return {
                '--dl-widget-drag-icon-left': `${
                    (this.$refs.widget as HTMLElement)?.offsetWidth / 2
                }px`,
                visibility:
                    this.visibleDragIcon && !this.isDragging
                        ? 'visible'
                        : 'hidden'
            }
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
                clone.style.backgroundColor = `var(--dl-color-bg)`
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
    position: relative;
    &__header {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid var(--dl-color-separator);
        font-size: 20px;
        color: var(--dl-color-darker);
        justify-content: space-between;

        &--titles {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
    &__content {
        padding: 5px;
    }
    &__description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 1;
        max-height: 1 * 2;
        margin: 20px 16px 16px 16px;
        font-size: 12px;
        color: var(--dl-color-medium);
    }

    &__drag-icon {
        position: absolute;
        top: 5px;
        left: calc(var(--dl-widget-drag-icon-left) - 5px);
        flex-grow: 1;
        cursor: grab;

        &::v-deep .dl-icon {
            transform: rotate(90deg) !important;
        }
    }

    &__drag {
        position: relative;
        opacity: 0.2;
        background: var(--dl-color-separator);
        &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
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
}
</style>
