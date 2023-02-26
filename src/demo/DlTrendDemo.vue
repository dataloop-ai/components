<template>
    <div>
        <dl-trend :value="75" />
        <dl-trend :value="0" />
        <dl-trend
            :value="25"
            direction="down"
        />
        <dl-trend
            value="with some text"
            direction="down"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTrend } from '../components'
export default defineComponent({
    name: 'DlTrendDemo',
    components: {
        DlTrend
    }
})
</script>
