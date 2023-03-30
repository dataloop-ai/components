<template>
    <div>
        <DlColorPicker
            theme="light"
            :color="colorPickerValue"
            :colors-history="colorsHistory"
            @changeColor="onColorChange"
            @updateColor="onColorUpdate"
        />
        <h1 :style="{ color: colorPickerValue }">
            The chosen color is {{ colorPickerValue }}
        </h1>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlColorPicker } from '../components'
import { NewColor } from '../components/types'

export default defineComponent({
    name: 'DlColorPickerDemo',
    components: {
        DlColorPicker
    },
    setup() {
        const colorPickerValue = ref('#AF8F8F')

        const colorsHistory = ref([])

        const onColorChange = (e: NewColor) => {
            colorPickerValue.value = e.hex
        }

        const onColorUpdate = (e: NewColor) => {
            colorsHistory.value = [
                `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`,
                ...colorsHistory.value
            ].slice(0, 7)
        }
    }
})
</script>
