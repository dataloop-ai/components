<template>
    <div
        ref="draggableUpper"
        class="root"
    />
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted } from 'vue-demi'

export default defineComponent({
    emits: ['move'],
    setup() {
        const vm = getCurrentInstance()

        onMounted(() => {
            const root = vm!.refs.draggableUpper as HTMLElement
            let newX = 0
            let newY = 0
            let offsetX = 0
            let offsetY = 0

            if (root) {
                root.onmousedown = dragMouseDown
            }

            function dragMouseDown(e: any) {
                e = e || window.event
                e.preventDefault()

                offsetX = e.layerX
                offsetY = e.layerY

                newX = e.clientX
                newY = e.clientY
                document.onmouseup = closeDragElement

                document.onmousemove = elementDrag
            }

            function elementDrag(e: any) {
                e = e || window.event
                e.preventDefault()
                newX = e.clientX - offsetX
                newY = e.clientY - offsetY
                vm!.emit('move', newX, newY)
            }

            function closeDragElement() {
                document.onmouseup = null
                document.onmousemove = null
            }
        })
    }
})
</script>

<style scoped>
.root {
    width: 100%;
    height: 10px;
    cursor: move;
}
</style>
