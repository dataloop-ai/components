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
            @change="handleChange"
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
        <div>
            Events: <br>
            {{ events }}
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
            readonly: false,
            events: []
        }
    },
    watch: {
        value(newValue, oldValue) {
            console.log(`@@@ model value update ${oldValue} to ${newValue}`)
            this.events.push(
                `@@@ model value update ${oldValue} to ${newValue}`
            )
        }
    },
    methods: {
        handleChange(value: number) {
            console.log(`@@@ handling change ${value}`)
            this.events.push(`@@@ handling change ${value}`)
        }
    },
    template: 'dl-slider-demo'
})
</script>
