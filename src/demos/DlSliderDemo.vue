<template>
    <div>
        <dl-slider
            v-model="value"
            width="500px"
            text="slider"
            :step="1"
            :min="-100"
            :max="100"
            :editable="editable"
            :readonly="readonly"
            :disabled="disabled"
        />
        <div>
            <button @click="editable = !editable">
                Editable: {{ editable }}
            </button>
            <button @click="readonly = !readonly">
                Readonly: {{ readonly }}
            </button>
            <button @click="disabled = !disabled">
                Disable: {{ disabled }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { DlSlider } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlSliderDemo',
    components: {
        DlSlider
    },
    data() {
        return {
            value: 0,
            editable: false,
            disabled: false,
            readonly: false
        }
    },
    watch: {
        value(newValue, oldValue) {
            console.log(`@@@ value changed from ${oldValue} to ${newValue}`)
        }
    },
    template: 'dl-slider-demo'
})
</script>
