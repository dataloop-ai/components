<template>
    <div>
        <dl-progress-bar
            width="50%"
            color="dl-color-secondary"
            indeterminate
            :value="0.2"
            label="Progress Bar"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlProgressBar } from '../components'
export default defineComponent({
    name: 'DlProgressBarDemo',
    components: {
        DlProgressBar
    }
})
</script>
