<template>
    <div
        :id="uuid"
        class="dl-widget-grid"
        :style="gridStyle"
    >
        <div
            v-for="(row, rowIndex) in modelValue"
            :key="row"
            class="dl-widget-grid__row"
            :style="rowStyle"
            @mouseenter="currentRow = rowIndex"
        >
            <div
                v-for="(widget, widgetIndex) in row"
                :id="`${rowIndex}-${widgetIndex}`"
                :key="widget"
                :class="gridItemClasses"
                :style="`flex-basis: ${100 / row.length}%`"
                @mouseenter="
                    (e) => {
                        handleMouseEnter(e)
                        currentItem = widgetIndex
                    }
                "
            >
                <dl-widget>
                    <template #header>
                        <div class="dl-widget-grid__item--header">
                            <div class="dl-widget-grid__item--titles">
                                <dl-typography size="h2">
                                    {{ widget.title }}
                                </dl-typography>
                                <dl-typography size="h4">
                                    {{ widget.subTitle }}
                                </dl-typography>
                            </div>
                            <dl-icon
                                class="dl-widget-grid__item--drag-icon"
                                icon="icon-dl-drag"
                                color="dl-color-medium"
                                size="15px"
                                @mousedown="
                                    startDragging(
                                        `${rowIndex}-${widgetIndex}`,
                                        widget
                                    )
                                "
                            />
                            <div class="dl-widget-grid__item--menu">
                                <slot name="menu" />
                                <dl-icon
                                    v-if="isEditable"
                                    class="dl-widget-grid__item--delete-icon"
                                    icon="icon-dl-delete"
                                    color="dl-color-negative"
                                    size="20px"
                                    @mousedown="
                                        removeWidget(
                                            `${rowIndex}-${widgetIndex}`
                                        )
                                    "
                                />
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <div class="dl-widget-grid__item--content">
                            <component
                                :is="widget.content"
                                v-if="typeof widget.content === 'object'"
                            />
                            <div v-else>
                                {{ widget.content }}
                            </div>
                        </div>
                    </template>
                    <template #description>
                        {{ widget.description }}
                    </template>
                </dl-widget>
            </div>
        </div>

        <div
            ref="clone"
            :class="cloneClasses"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { Widget } from './types'
import { cloneDeep } from 'lodash'
import { equateElements, getTargetWidget, getIndex } from './utils'
import DlWidget from './DlWidget.vue'
import DlIcon from '../DlIcon.vue'
import DlTypography from '../DlTypography.vue'
import { v4 } from 'uuid'

interface DragSide {
    previous: boolean
    current: boolean
}

export default defineComponent({
    components: {
        DlWidget,
        DlIcon,
        DlTypography
    },
    props: {
        modelValue: {
            type: Array as PropType<Widget[][]>,
            default: () => [] as Widget[]
        },
        isEditable: { type: Boolean, default: false },
        rowGap: { type: String, default: '30px' },
        columnGap: { type: String, default: '30px' },
        widgetLibrary: { type: Array, default: () => [] as Widget[] }
    },
    emits: ['update:model-value', 'remove'],
    data(): {
        uuid: string
        timer: number
        isDragging: boolean
        dragTarget: HTMLElement
        currentRow: number
        currentItem: number
        draggedWidget: Widget
        draggedWidgetId: string
        dragSide: DragSide
    } {
        return {
            uuid: `dl-widget-grid-${v4()}`,
            timer: null,
            isDragging: false,
            dragTarget: null,
            currentRow: -1,
            currentItem: -1,
            draggedWidget: null,
            draggedWidgetId: null,
            dragSide: { previous: null, current: null }
        }
    },
    computed: {
        gridStyle(): Record<string, any> {
            return { gap: this.rowGap }
        },
        rowStyle(): Record<string, any> {
            return { gap: this.columnGap }
        },
        cloneClasses(): string {
            return `dl-widget-grid__clone ${
                this.isDragging ? 'dl-widget-grid__clone--dragging' : ''
            }`
        },
        gridItemClasses(): string {
            return `dl-widget-grid__item ${
                this.isDragging ? 'dl-widget-grid__item--dragging' : ''
            }`
        }
    },
    mounted() {
        window.addEventListener('mouseup', (e) => this.stopDragging(e))
    },
    methods: {
        startDragging(widgetIndex: string, widget: Widget) {
            window.addEventListener('mousemove', (e) => this.moveWidget(e))
            this.isDragging = true
            const draggedWidget = document.getElementById(widgetIndex)
            draggedWidget.style.visibility = 'hidden'
            this.draggedWidgetId = draggedWidget.id
            this.draggedWidget = widget
            equateElements(draggedWidget, this.$refs.clone as HTMLElement)
        },
        stopDragging(e: MouseEvent) {
            if (!this.isDragging) return
            this.isDragging = false
            const targetId = getTargetWidget(e.target as HTMLElement)?.id
            let newWidgets: Widget[][]
            if (targetId && this.draggedWidgetId) {
                newWidgets = cloneDeep(this.modelValue) as Widget[][]
                const targetIndex = getIndex(targetId)
                const sourceIndex = getIndex(this.draggedWidgetId)
                const temp = newWidgets[targetIndex.row][targetIndex.column]
                newWidgets[targetIndex.row][targetIndex.column] =
                    this.modelValue[sourceIndex.row][sourceIndex.column]
                newWidgets[sourceIndex.row][sourceIndex.column] = temp

                this.$emit('update:model-value', newWidgets)
            }

            if (this.$refs.clone) {
                (this.$refs.clone as HTMLElement).innerHTML = ''
            }

            const activeWidget = document.getElementById(this.draggedWidgetId)
            if (activeWidget) {
                activeWidget.style.visibility = 'visible'
            }
            this.draggedWidgetId = null
            window.removeEventListener('mousemove', this.stopDragging)
            window.removeEventListener('mousemove', this.handleMouseMove)
        },
        moveWidget(e: MouseEvent) {
            const clone = this.$refs.clone as HTMLElement
            clone.style.left = `${e.pageX - clone.offsetWidth / 2 - 5}px`
            clone.style.top = `${e.pageY + 10}px`
        },
        removeWidget(widgetId: string) {
            this.$emit(
                'update:model-value',
                this.modelValue.map((row: Widget[], rowIndex: number) =>
                    row.filter((widget: Widget, widgetIndex: number) => {
                        if (`${rowIndex}-${widgetIndex}` !== widgetId)
                            return widget
                        else this.$emit('remove', widget)
                    })
                )
            )
        },
        handleMouseEnter(e: Event) {
            this.dragTarget = e.target as HTMLElement
            this.dragSide.previous =
                (e as MouseEvent).x - this.dragTarget.offsetLeft <
                this.dragTarget.offsetWidth / 2
            if (
                !this.isDragging ||
                !(this.modelValue[this.currentRow].length < 3)
            )
                return

            e.target.addEventListener('mousemove', this.handleMouseMove)
            e.target.addEventListener('mouseleave', (e: Event) => {
                clearTimeout(this.timer)
                e.target.removeEventListener('mousemove', this.handleMouseMove)
            })

            this.timer = window.setTimeout(() => {
                this.rearrangeWidgets()
            }, 700)
        },
        handleMouseMove(e: Event) {
            this.dragSide.current =
                (e as MouseEvent).x - this.dragTarget.offsetLeft <
                this.dragTarget.offsetWidth / 2
            if (this.dragSide.current !== this.dragSide.previous) {
                clearTimeout(this.timer)
                this.handleMouseEnter(e)
            }
        },
        rearrangeWidgets() {
            if (
                !this.draggedWidgetId ||
                Number(this.draggedWidgetId[0]) == this.currentRow
            )
                return
            const newTargetRow = this.modelValue[this.currentRow]
            const newSourceRow =
                this.modelValue[Number(this.draggedWidgetId[0])]
            newTargetRow.splice(
                this.dragSide.previous
                    ? this.currentItem
                    : this.currentItem + 1,
                0,
                this.draggedWidget
            )
            newSourceRow.splice(Number(this.draggedWidgetId[2]), 1)
            const newWidgets = this.modelValue
            newWidgets[this.currentRow] = newTargetRow
            newWidgets[Number(this.draggedWidgetId[0])] = newSourceRow
            this.isDragging = false
            ;(this.$refs.clone as HTMLElement).innerHTML = ''
            this.$emit('update:model-value', newWidgets)
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-widget-grid {
    display: flex;
    flex-direction: column;

    &__row {
        display: flex;
    }

    &__clone {
        position: absolute;
        background-color: var(--dl-color-shadow);
        outline: 1px solid var(--dl-color-separator);
        visibility: hidden;
        padding: 10px;
        border-radius: 2px;

        &--dragging {
            visibility: visible;
        }
    }

    &__item {
        transition: 0.05s;
        user-select: none;
        outline: 1px solid var(--dl-color-separator);
        border-radius: 2px;

        &--dragging {
            &:hover {
                background-color: var(--dl-color-fill);
            }
        }

        &--header {
            display: flex;
            justify-content: space-between;
        }

        &--titles {
            display: flex;
            flex-direction: column;
            width: 45%;
        }

        &--menu {
            width: 50%;
            display: flex;
            justify-content: flex-end;
        }

        &--drag-icon {
            transform: rotate(90deg);
            margin-top: -30px;
            cursor: grab;
        }

        &--delete-icon {
            cursor: pointer;
        }

        &--content {
            width: 100%;
            margin-bottom: 20px;
            margin-top: 20px;
            color: var(--dl-color-darker);
        }

        &--footer {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-top: auto;
        }
    }
}
</style>
