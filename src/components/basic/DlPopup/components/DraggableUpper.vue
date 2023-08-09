<template>
    <div
        ref="draggableUpper"
        class="root"
        @mouseenter="visibleDragIcon = true"
        @mouseleave="visibleDragIcon = false"
    >
        <dl-icon
            class="draggable-icon"
            color="dl-color-medium"
            icon="icon-dl-drag"
            size="12px"
            @mousedown="startDragElement"
        />
    </div>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import { defineComponent, getCurrentInstance, ref } from 'vue-demi'
import { DlIcon } from '../../../essential/DlIcon'

export default defineComponent({
    components: {
        DlIcon
    },
    emits: ['move'],
    setup(props, { emit }) {
        const visibleDragIcon = ref(false)

        const draggableOptions = ref({
            draggableX: 0,
            draggableY: 0,
            originalX: 0,
            originalY: 0,
            draggableCursor: 'pointer'
        })

        const iconStyles = (): Record<string, string> => {
            return {
                cursor: draggableOptions.value.draggableCursor,
                visibility: visibleDragIcon.value ? 'visible' : 'hidden'
            }
        }

        const startDragElement = (e: MouseEvent) => {
            e.preventDefault()

            const target: HTMLElement = e.currentTarget as any
            const iconOffsetX = target.parentElement.clientWidth / 2
            const iconOffsetY = target.parentElement.clientHeight / 2

            if (
                !draggableOptions.value.originalY &&
                !draggableOptions.value.originalX
            ) {
                draggableOptions.value.originalY = e.y
                draggableOptions.value.originalX = e.x
            }

            draggableOptions.value.draggableCursor = 'grabbing'
            document.onmousemove = throttle((e: MouseEvent) => {
                e = e || (window.event as MouseEvent)
                e.preventDefault()
                const x = e.x - iconOffsetX
                const y = e.y - iconOffsetY
                emit('move', x, y)
            }, 5)
            document.onmouseup = stopDragElement
        }
        const stopDragElement = () => {
            document.onmousemove = null
            document.onmouseup = null
            draggableOptions.value.draggableCursor = 'pointer'
        }

        return {
            visibleDragIcon,
            draggableOptions,
            iconStyles,
            startDragElement,
            stopDragElement
        }
    }
})
</script>

<style scoped>
.root {
    width: 100%;
    height: 10px;
    display: flex;
    justify-content: center;
}
.draggable-icon {
    display: none;
    padding: 0px 10px;
    transform: rotate(90deg);
}
.draggable-icon:hover {
    cursor: move;
    display: flex;
}
</style>
