<template>
    <div>
        <dl-slider
            v-model="value"
            width="500px"
            text="slider"
            :step="1"
            :min="50"
            :max="100"
            :slim="slim"
            :readonly="readonly"
            :disabled="disabled"
            @change="handleChange"
            @input-focus="handleFocus"
            @input-blur="handleBlur"
        />
        <div>
            <button @click="slim = !slim">slim: {{ slim }}</button>
            <button @click="readonly = !readonly">
                Readonly: {{ readonly }}
            </button>
            <button @click="disabled = !disabled">
                Disable: {{ disabled }}
            </button>
        </div>
        <div>
            Events: <br />
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
            value: null,
            slim: false,
            disabled: false,
            readonly: false,
            events: []
        }
    },
    watch: {
        value(newValue, oldValue) {
            this.events[0] = `model value update ${oldValue} to ${newValue}`
        }
    },
    methods: {
        handleChange(value: number) {
            this.events[1] = `handling change ${value}`
        },
        handleFocus(event: Event) {
            this.events[1] = `Input Focus `
        },
        handleBlur(event: Event) {
            this.events[1] = `Input Blur `
        }
    },
    template: 'dl-slider-demo'
})
</script>
