<template>
    <div>
        <div>
            <dl-date-time-picker
                v-model="date"
                show-time
                @change="handleModelValueUpdate"
            />
        </div>
        <div>
            {{ date }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlDateTimePicker } from '../components'

export default defineComponent({
    components: {
        DlDateTimePicker
    },
    data(): {
        date: Date
    } {
        return {
            date: null
        }
    },
    computed: {},
    methods: {
        handleModelValueUpdate(value: Date) {
            console.log('Date: ', value)
        }
    }
})
</script>
<style lang="scss" scoped>
.width-300 {
    width: 300px;
}
</style>
