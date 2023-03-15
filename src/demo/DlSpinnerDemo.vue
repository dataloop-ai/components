<template>
    <dl-spinner
        text="loading..."
        :text-styles="{ marginLeft: '10px' }"
    />
</template>

<script>
import { defineComponent } from 'vue-demi'
import DlSpinner from '../components/DlSpinner.vue'

export default defineComponent({
    components: {
        DlSpinner
    }
})
</script>
