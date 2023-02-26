<template>
    <div>
        <dl-range
            v-model="value"
            width="500px"
            :min="0"
            :max="100"
            :step="5"
            text="Range"
            :snap="true"
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
            value: { min: 0, max: 100 },
            disabled: false,
            readonly: false
        }
    },
    template: 'dl-range-demo'
})
</script>
