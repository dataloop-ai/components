<template>
    <div>
        <dl-text-area
            v-model="textAreaValue"
            placeholder="Type your text..."
            show-counter
            :max-length="20"
            enable-resize
            @focus="textAreaFocused = true"
            @blur="textAreaFocused = false"
        />
        <div style="margin-left: 20px">
            <p>Value: {{ textAreaValue }}</p>
            <p>Status: {{ textAreaFocused ? 'focused' : 'unfocused' }}</p>
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
        const textAreaFocused = ref(false)

        return {
            textAreaValue,
            textAreaFocused
        }
    }
})
</script>
