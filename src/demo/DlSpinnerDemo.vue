<template>
    <dl-spinner
        text="Loading data, please wait..."
        :text-styles="{
            marginLeft: '10px',
            color: 'var(--dl-color-tooltip-background)'
        }"
    />
</template>

<script>
import { defineComponent } from 'vue-demi'
import { DlSpinner } from '../components'

export default defineComponent({
    components: {
        DlSpinner
    }
})
</script>
