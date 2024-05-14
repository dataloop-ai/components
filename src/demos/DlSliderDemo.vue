<template>
    <div>
        <dl-slider
            v-model="value"
            width="500px"
            text="slider"
            :step="1"
            :min="-100"
            :max="100"
            :slim="slim"
            :readonly="readonly"
            :disabled="disabled"
            @change="handleChange"
            @input-focus="handleFocus"
            @input-blur="handleBlur"
        />

        <dl-slider
            v-model="value2"
            width="500px"
            text="slider"
            :step="0.01"
            :min="-10"
            :max="10"
            :slim="slim"
            :readonly="readonly"
            :disabled="disabled"
            @change="handleChange"
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
            value2: null,
            slim: false,
            disabled: false,
            readonly: false,
            events: []
        }
    },
    watch: {
        value(newValue, oldValue) {
            console.log(`@@@ model value update ${oldValue} to ${newValue}`)
            this.events[0] = `@@@ model value update ${oldValue} to ${newValue}`
        }
    },
    methods: {
        handleChange(value: number) {
            console.log(`@@@ handling change ${value}`)
            this.events[1] = `@@@ handling change ${value}`
        },
        handleFocus(event: Event) {
            this.events[1] = `@@@ Input Focus `
        },
        handleBlur(event: Event) {
            this.events[1] = `@@@ Input Blur `
        }
    },
    template: 'dl-slider-demo'
})
</script>
