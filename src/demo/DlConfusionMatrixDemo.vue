<template>
    <dl-confusion-matrix
        :matrix="[
            [1, 2, 3],
            [4, 5, 6]
        ]"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlConfusionMatrix from '../components/DlConfusionMatrix/DlConfusionMatrix.vue'
export default defineComponent({
    components: {
        DlConfusionMatrix
    }
})
</script>
