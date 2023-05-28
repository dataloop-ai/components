<template>
    <div style="width: 800px">
        <div style="font-size: 14px">
            <span>Max length: </span>
            <input v-model="maxLength">
        </div>
        <div style="max-width: 500px; width: 100%">
            <dl-text-area
                v-model="textAreaValue"
                placeholder="Type your text..."
                show-counter
                :max-length="maxLength"
                max-height="500px"
                title="Text area title"
                required
                tooltip="Quis fugiat et non eu proident sit et amet."
                top-message="Pariatur consequat non sit aliqua labore ad reprehenderit deserunt ullamco incididunt non irure laborum deserunt."
                enable-resize
                clear-button-tooltip
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlTextArea } from '../components'
export default defineComponent({
    name: 'DlTextAreaDemo',
    components: {
        DlTextArea
    },
    setup() {
        const textAreaValue = ref('')
        const maxLength = ref(20)
        return {
            maxLength,
            textAreaValue
        }
    }
})
</script>
