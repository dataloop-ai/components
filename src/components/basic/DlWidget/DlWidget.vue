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
                v-if="draggable"
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
                        v-if="isEmpty && emptyStateProps"
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
import { computed, defineComponent, ref, toRef, PropType } from 'vue-demi'
import { DlIcon } from '../../essential'
import { getElementAbove, addMouseEnter, removeMouseEnter } from '../utils'
import { DlEmptyStateProps } from '../DlEmptyState/types'
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'

export default defineComponent({
    name: 'DlWidget',
    components: {
        DlIcon,
        DlEmptyState
    },
    props: {
        isEmpty: {
            type: Boolean,
            default: false
        },
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        },
        draggable: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const uuid = ref(`dl-widget-${v4()}`)
        const draggedWidget = ref<HTMLElement>(null)
        const hoveredWidget = ref(null)
        const isLeftSide = ref(false)
        const flexBasis = ref(null)
        const isDragging = ref(false)
        const timer = ref(null)
        const visibleDragIcon = ref(false)
        const wrapper = ref<HTMLDivElement>(null)
        const widget = ref<HTMLDivElement>(null)
        const clone = ref<HTMLDivElement>(null)
        const draggableRef = toRef(props, 'draggable')

        const widgetClasses = computed(() => {
            return `${isDragging.value ? 'dl-widget__drag' : 'dl-widget'}`
        })
        const iconStyles = computed(() => {
            return {
                '--dl-widget-drag-icon-left': `${
                    (widget.value as HTMLElement)?.offsetWidth / 2
                }px`,
                visibility:
                    visibleDragIcon.value && !isDragging.value
                        ? 'visible'
                        : 'hidden'
            }
        })

        const startDragging = (e: MouseEvent) => {
            isDragging.value = true
            document.body.style.cursor = 'grabbing'
            draggedWidget.value = getElementAbove(
                e.target as HTMLElement,
                'dl-widget'
            )
            if (draggedWidget.value && clone.value) {
                clone.value.appendChild(draggedWidget.value.cloneNode(true))
                clone.value.style.visibility = 'visible'
                clone.value.style.position = 'fixed'
                clone.value.style.width = `${draggedWidget.value.offsetWidth}px`
                clone.value.style.height = `${draggedWidget.value.offsetHeight}px`
                clone.value.style.backgroundColor = `var(--dl-color-bg)`
            }

            const sourceCanvas = draggedWidget.value?.querySelector('canvas')
            if (sourceCanvas && clone.value) {
                const targetCanvasCtx = clone.value
                    .querySelector('canvas')
                    .getContext('2d')

                targetCanvasCtx.drawImage(sourceCanvas, 0, 0)
            }

            moveClone(e as MouseEvent)

            addMouseEnter('dl-widget', handleMouseEnter as any)

            window.addEventListener('mousemove', moveClone)
            window.addEventListener('mouseup', stopDragging)
        }

        const moveClone = (e: MouseEvent) => {
            if (!isDragging.value || !clone.value) return
            clone.value.style.left = `${
                e.pageX - clone.value.offsetWidth / 2 - 5
            }px`
            clone.value.style.top = `${e.pageY + 10}px`
        }

        const stopDragging = (e: MouseEvent) => {
            isDragging.value = false
            document.body.style.cursor = 'default'
            if (!clone.value || !draggedWidget.value || !wrapper.value) {
                return
            }
            clone.value.style.visibility = 'hidden'
            clone.value.innerHTML = ''
            const target = getElementAbove(e.target as HTMLElement, 'dl-widget')
            const change = {
                source: draggedWidget.value,
                target,
                endDragging: true
            }
            if (target && draggedWidget.value) {
                const event = new CustomEvent('position-changing', {
                    detail: change
                })
                wrapper.value.dispatchEvent(event)
            } else {
                wrapper.value.dispatchEvent(new CustomEvent('position-changed'))
            }
            window.removeEventListener('mousemove', moveClone)
            window.removeEventListener('mouseup', stopDragging)
            setTimeout(() => {
                removeMouseEnter('dl-widget', handleMouseEnter as any)
            }, 1)
        }

        const handleMouseEnter = (e: MouseEvent) => {
            hoveredWidget.value = e.target as HTMLElement
            if (!hoveredWidget.value) {
                return
            }

            const mouseOffsetInside = e.clientX - hoveredWidget.value.offsetLeft

            isLeftSide.value =
                mouseOffsetInside < hoveredWidget.value.offsetWidth / 2

            hoveredWidget.value.addEventListener(
                'mousemove',
                handleMouseInsideWidget
            )

            hoveredWidget.value.addEventListener('mouseleave', () => {
                if (timer.value) {
                    clearTimeout(timer.value)
                    timer.value = null
                }
                hoveredWidget.value.removeEventListener(
                    'mousemove',
                    handleMouseInsideWidget
                )
            })

            timer.value = setTimeout(insertWidget, 200)
        }

        const insertWidget = () => {
            if (!hoveredWidget.value || !wrapper.value) {
                return
            }

            const targetWidget = getElementAbove(
                hoveredWidget.value,
                'widget-wrapper'
            )
            const event = new CustomEvent('position-changing', {
                detail: {
                    source: wrapper.value,
                    target: targetWidget,
                    side: isLeftSide.value ? 'left' : 'right'
                }
            })
            wrapper.value.dispatchEvent(event)
            if (timer.value) {
                window.clearTimeout(timer.value)
                timer.value = null
            }
            hoveredWidget.value.removeEventListener(
                'mousemove',
                handleMouseInsideWidget
            )
        }

        const handleMouseInsideWidget = (e: MouseEvent) => {
            if (!hoveredWidget.value) {
                return
            }

            const mouseOffsetInside = e.clientX - hoveredWidget.value.offsetLeft
            const isLeftSideCurrently =
                mouseOffsetInside < hoveredWidget.value.offsetWidth / 2
            if (isLeftSide.value !== isLeftSideCurrently) {
                if (timer.value) {
                    clearTimeout(timer.value)
                    timer.value = null
                }
                handleMouseEnter(e)
            }
        }

        const handleVisibleDragIcon = (val: boolean) => {
            if (!draggableRef.value) {
                return
            }
            if (!document.querySelector('.drag-clone').innerHTML.toString()) {
                visibleDragIcon.value = val
            }
        }

        return {
            wrapper,
            widget,
            clone,
            uuid,
            draggedWidget,
            hoveredWidget,
            isLeftSide,
            flexBasis,
            isDragging,
            timer,
            visibleDragIcon,
            widgetClasses,
            iconStyles,
            startDragging,
            moveClone,
            stopDragging,
            handleMouseEnter,
            insertWidget,
            handleMouseInsideWidget,
            handleVisibleDragIcon
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
