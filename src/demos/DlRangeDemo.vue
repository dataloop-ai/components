<template>
    <div>
        <dl-range
            v-model="value"
            width="500px"
            :min="0"
            :max="1"
            :step="0.1"
            text="Range"
            :readonly="readonly"
            :disabled="disabled"
            name="range"
        />
        <div>
            <button @click="readonly = !readonly">
                Readonly: {{ readonly }}
            </button>
            <button @click="disabled = !disabled">
                Disable: {{ disabled }}
            </button>
        </div>
        <div>
            {{ value }}
        </div>
    </div>
</template>

<script lang="ts">
import { DlRange } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlRangeDemo',
    components: {
        DlRange
    },
    data() {
        return {
            value: { min: 0, max: 0.5 },
            disabled: false,
            readonly: false
        }
    },
    watch: {
        value(val) {
            console.log('value changed: ', val)
        }
    },
    template: 'dl-range-demo'
})
</script>
